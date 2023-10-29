---
title: "Alex's Godot Character Movement Manifesto"
date: 2023-10-22T15:23:08+01:00
draft: false

highlighted: true
description: "An opinionated guide to creating character controllers in Godot."

resources:
- name: thumbnail
  src: movement_code.PNG

tags:
- game-dev
---

# Alex's Godot Character Movement Manifesto

You can find an example Godot Character Controller using `move_and_collide` [here](https://github.com/alexjhetherington/godot-character-controller-example/tree/main)

## Motivation
* I spent a long time learning about and creating character controllers in Unity for [Ballistic Zen] (https://store.steampowered.com/app/1966930/Ballistic_Zen/)
* [Shifty's Godot Character Movement Manifesto] (https://markdownpastebin.com/?id=d9d61e67f9d64db2bd215f165b931449) is a bit out of date
* I switched to Godot and had to learn a lot, again. I want to help others in my situation!

## Context
* This manifesto is about first person character controllers
  * Third person character controllers can do a lot with character animations and free-er camera movement

## Built-in vs Custom Character Controllers, and a Philosophy on what to build
* Built-in character controllers *will always have unworkable issues*
* Built-in character controllers are intended for a wide audience to get movement working quickly
* **There is no universal character controller**
* If you care about movement, creating a custom character controller is inevitable
* There should be no expectation on game engine developers to provide a character controller that meets all *your* needs
  * For what it's worth, I think Godot *should* provide step functionality, but they don't currently
* **Character controller design is inextricably linked with the game environment**
  * If there are no steps in the game, don't make a step function
  * If there are no height changes in the game, don't let the character move up and down
  * There are more ignorable edge cases than you expect.
  * Environmental work-arounds such as ramps instead of stairs are possible; they add load to level design, but make character controller development easier
  * *Don't build a character controller in isolation from the environment it will inhabit*
* Character controller development requires fast iteration; avoid engine or physics rewrites (if you're not running your own)
  * If the engine you are using has deep-rooted physics issues, prepare to compromise!
* Character controller development is complicated, but does *not* take that long once you know what you're doing!

## General Techniques
* Prefer (most to least) Cylinder > Cube > Capsule shape for collision detection
  * Capsules reduce the demand for complicated slide algorithms but behave unreliably at platform edges
  * A cube's flat bottom creates reliable platform edge behaviour, and variability in closest wall distance based on wall angle is hardly noticable, but slide direction behaves unreliably where walls join
  * A cylinder's flat bottom creates reliable platform edge behaviour, and the curved edge creates reliable wall slide behaviour
* Prefer Shape casts over ray casts; ray casts can easily miss parts of the environment
* Steps can be handled by:
  * (Simpler) Ignore collisions at the bottom of the controller, and force a minimum distance distance to the floor below; this has the disadvantage of causing slope slide behaviour to become very confusing; *I do not recommend doing this if you have steep slopes in your game*
  * (More General) Perform additional tests "Up, forward, down" and use the results to potentially modify the final movement 
* Blocking movement on slopes is tricky when multiple slopes intersect!
* Run physics at a fixed timestep; interpolate visually to prevent jitters
* See my Godot controller [here](https://github.com/alexjhetherington/godot-character-controller-example/tree/main) - many techniques I use are appropriate for any character controller

## Godot Specifics
* Physics nodes have been renamed since Shifty's Manifesto. [Example PR](https://github.com/godotengine/godot-proposals/issues/2867)
* CharacterBody has `move_and_slide` and is intended for character bodies
  * CharacterBody does not have a step function, but one could be created using [Physics Space State](https://docs.godotengine.org/en/stable/classes/class_physicsdirectspacestate3d.html)
  * CharacterBody `move_and_slide` behaviour is suitable for simple geometry but is unreliable especially with complicated slopes
* RigidBody3D has `integrated_forces` and is intended for physics objections
  * I don't *believe* it is possible to manually set an object position inside `integrated_forces`, so I don't believe it is suitable for character controllers
* StaticBody has `move_and_collide`, and is intended for custom behaviour
  * `move_and_collide` and setting position manually allows creation of *most* desired behaviour
  * `move_and_collide` performs automatic depentration which obfuscates some issues, and appears to have minor issues with vertical movement and slopes; but I nevertheless recommend it for most projects
  * AnimatableBody3D is a StaticBody that affects the environment, and could be used as a mostly drop in replacement. I have not tested this. 
* **IMPORTANT** Godot physics is still buggy in Godot 4.0. Box collisions seem to work well, but Cylinder collisions are broken. Using [Jolt](https://github.com/godot-jolt/godot-jolt) is **absolutely mandatory** for custom character controller development.
  * Jolt is non-deterministic; this means physics are not consistent - but physics are still predictable - there are no noticable downsides to movement using Jolt
  * Depending on game mechanics (replays?) non-determinism might be a deal breaker - in this case fall back to default physics and the humble cube!
* See my Godot controller [here](https://github.com/alexjhetherington/godot-character-controller-example/tree/main) to see an example of using `move_and_collide`