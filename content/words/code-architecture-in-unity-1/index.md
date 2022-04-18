---
title: "Code Architecture in Unity"
date: 2022-05-29T15:23:08+01:00
draft: true

highlighted: true
description: "A practical guide for those who are as confused as I was."

resources:
- name: thumbnail
  src: code-unity.PNG
---

** Discuss Ballistic Zen on my discord: https://discord.gg/7nzsjUU and wishlist here: https://store.steampowered.com/app/1966930/Ballistic_Zen/**

## Preamble

I'm writing this guide to remind myself how to think about architecting code in Unity. There are precious few architecture tutorials that can be found online, and those that do exist often introduce an architectural concept (like the "Message Bus") then fail to explain when and when not to use it. This guide aims to do better.

For other readers:

* I am not a professional Unity programmer. I don't really know what I'm doing. I come from the Java enterprise world.
* I mostly work solo. I have taken part in some small game jams. I have no experience working on very large games.
* These guidelines are for projects that heavily leverage GameObjects and Monobehaviours (so not DOTS projects!)
* These guidelines do not take into account the architectural needs of multiplayer games.

## The Most Important Decision You Have To Make

So, you've made a start on splitting up your classes into distinct functional units<sup>[1]</sup>. But your classes are a mess. There are references flying around everywhere. You just want to watch an NPC walk around so you add it to a new scene along with a ground plane. Suddenly - a null pointer exception. You need to add the player to fix it. Another. This time you need to add the UI. Then you need the loading mechanism. Instantly your entire game is in the new scene. You can't live like this!

There are many decisions you will have to make. But there's only one question, really.

Class A needs to communicate with class B. How does that happen?

## The Golden Rules

Before you can start drawing lines between classes, you need to internalise the golden rules.

Components (MonoBehaviours that are attached to GameObjects, and ScriptableObjects that live free in globally accessible memory) are written for 2 people. The first you know well. The second is easy to forget:

1. The Engineer. That's you when you're writing code. Code should be easy to write, easy to extend, and easy to understand.
2. The Designer. That's the person who is dragging things around in the scene view. Maybe that's you, or maybe it's someone else. The interface the designer uses to interact with each components should be easy to understand and convenient to use

Prefabs are *King*. Even if you have only one instance of a "thing" in a scene, it should be a prefab!

*	Making a sweeping change for similar objects across entire scenes is trivial with prefabs.
* Changes to prefabs don't change the scene asset they are contained in, making version control history much more managable.
*	If classes are the smallest building block for separation of concern, prefabs are the next one up. Make prefabs for any nested game "system" that should work indepdently (player controller, a collectable, a UI screen are three examples)

Prefabs should work indepdently!

* Prefabs *must* require no architectural setup once dragged into a scene. A designer doesn't want to drag a reference to the player into every new NPC they add to their scene.

Scene Lifecycle must not be assumed!

*	Any given component must not assume any other component exists unless the latter is explicitly part of the formers behaviour
* Setting up different GameObjects in multiple additive scenes is fine! Assuming a game object exists from a previously loaded additive scene is not fine! Designers will jump at every opportunity to make this assumption. Do not let them!

## I've Made A Component. Now What?

You have made a class. It's responsible for one thing. Perhaps it has public methods that must be called for it to do anything. Perhaps it runs in the Update loop and is doing it's own thing.

One thing is for sure. Someone else needs to talk to your new class, or your new class needs to talk to someone else.

Let's figure out how.

###	Singletons

Singletons here means a component that can be globally accessed at any time, from any scene.

A component is a candidate for a singleton if all of the below are true:

1* There should only be one instance of the component
2* The component should exist in every scene
3* The component does not spatially exist
4* The component does not control itself

The latter two statements are to help you filter out components where the phrase "it seemed like a good idea at the time" is likely to get you. GameObjects of which there should only be one, but which spatially exist or control themselves, are very likely to be tied to specific scenes.

There should only be a single player, but the player shouldn't exist on the main menu. It's not a good candidate for a singleton.

The LoadFromDisk component should be accessible from every scene. It's a good candidate for a singleton.

Some components may not be needed in every scene, but are still suitable candidates for singletons if their existence across all scenes is not disruptive. Managers that keep track of currently loaded GameObjects (like a list of NPCs) are good candidates that fit this scenario.

Singletons can have state!

#### ScriptableObjects

**Singletons should be implemented as ScriptableObjects**

Creating an instance of a singleton means creating the asset file in the Unity editor. Sort of helpful to conceptualise ScriptableObjects as a MonoBehaviours that isn't attached to a GameObject. During play ScriptableObjects always exist in memory, so **scene load order is not a worry** (see the caveat below).

**Other scripts can reference ScriptableObjects by exposing a serialized field in the inspector.** ScriptableObjects can be dragged into this field like a MonoBehaviour. This means **ScriptableObject singletons can be referenced inside of prefabs.**

#### Initialising State

Some singletons may have a state that should be initialised at the start of the game. **Do not initialise this data using the Awake method.**

*	Awake behaviour is inconsistent
* The ScriptableObject should not make an assumption about load order

Create a helper MonoBehaviour component that sets up the singleton in an initial scene. The goal is for the singleton to perform its function adequately without the setup scene.

Sometimes, setup is completely unavoidable. In these cases, uses OnEnable.

* It will be called on Unity Editor reload and when first referenced in the build.

#### Do Not Destroy On Load

An alternative to ScriptableObjects it to use the static method Class.Instance pattern, which if called when null will set up a GameObject with the DoNotDestroyOnLoad flag. The singleton can then be referenced directly in code, rather than requiring an inspector.

It is not my preferred option because the concrete type is explicitly stated then. If you wanted to switch the singleton with a different implementation it would require code change. Note: A different 'implementation' might be an instance of the same class with different variables set up in the inspector!

### Components with Multiple Instances

[1]: https://en.wikipedia.org/wiki/Separation_of_concerns