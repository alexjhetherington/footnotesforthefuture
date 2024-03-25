---
title: "Ballistic Zen Custom Maps Tutorial"
date: 2023-03-01T15:23:08+01:00
draft: false
highlighted: true
description: "Short guide to using Ballistic Zen's experimental custom maps feature."

resources:
- name: thumbnail
  src: trenchboom-overview.PNG

tags:
- Game Dev
---

Ballistic Zen Custom Maps Tutorial
===

# Intro

Guide is up-to-date as of *[Ballistic Zen]((https://store.steampowered.com/app/1966930/Ballistic_Zen/)) version 1.6.*

Ballistic Zen Version 1.4 and above supports custom lines. Ballistic Zen Version 1.5 and up supports custom maps. This page will explain how to create and use both.

**Custom maps** are built in Trenchbroom and currently support:

* All textures that already exist in the game
* Importing new textures
* Collectables
* Spawning the player (obviously!)
* Custom lines
* Trigger respawns (death zones)
* Trigger set respawn points (respawn hubs)

Custom maps do not currently support, in descending order of priority:

* Other entities (boost pads)
* Pre-built lines (blue and white)
* Centralised hosting
* In built models (trees)
* Area blocking (player blocked from visiting an area until they have a given amount of respect)

It is unlikely custom maps will ever support:
* Custom models (please build everything in the editor)
* Custom lighting (including modifying the skybox)

**Custom Lines** are generated in game and the basic functionality is fully implemented. Further work required involves improved the management of lines (renaming, drafts, deleting, centralised hosting etc).

If you'd like to encourage futher work on custom maps, please buy the game on [steam](https://store.steampowered.com/app/1966930/Ballistic_Zen/), or chose to pay on [itch](https://footnotesforthefuture.itch.io/ballistic-zen).

# Custom Maps

### Get Trenchbroom

[Trenchbroom](https://trenchbroom.github.io/) is a free and open source level editor. To use it:

* Follow [this link](https://github.com/TrenchBroom/TrenchBroom/releases)
* Scroll down to the release you want
  * This guide uses *version 2022.2*
  * *versions 2024+* may be incompatible
* Scroll down a bit more to Assets
* Choose the appropriate download. For me it was `TrenchBroom-Win64-v2022.2-RC3-Release.7z`

![Trenchbroom Downloads](trenchbroom-downloads.PNG)

* Download, extract, and run the .exe

### Set up Trenchbroom

To place the player spawn and collectables, and set different textures, you need to perform some additional setup.

* Open Trenchbroom
* Choose New Map
* Choose **Half-life (experimental)**. Yep, that's right!

![Trenchbroom Half Life](trenchbroom-half-life.PNG)

* To set up textures:
  * Navigate to the Face tab
  * Press the plus button
  * Navigate to the `%BallisticZenInstallFolder%/Ballistic Zen_Data/StreamingAssets`
  * Select the default textures .wad file

![Trenchbroom WAD](trenchbroom-wad.PNG)

* To set up entities:
  * Navigate to the Entity tab
  * Select Browse
  * Navigate to the `%BallisticZenInstallFolder%/Ballistic Zen_Data/StreamingAssets`
  * Select the default entities .fgd file

![Trenchbroom FGD](trenchbroom-fgd.PNG)

### Make your map!

Trenchbroom is a powerful program and how to use it is out of scope of this guide. You can find the fantastic manual [here](https://trenchbroom.github.io/manual/latest/).

* Don't forget to add a player spawn!
* Save the map to `%BallisticZenUserDataFolder%/player-maps`
  * You can find this on windows by going to `%AppData%`, going up a level, then going to `LocalLow\footnotesforthefuture\Ballistic Zen\player-maps`
  * Put maps from other players into this folder

Here is a map I made: [Big Ramps](Big Ramps.map). `Right click -> Save Link As` to the above location to give it a try. It's not very good! Feel free to use it as a starting point!

Currently the most official place to share your maps is the [discord server](https://discord.gg/XS29Pdr).

Custom lines will work on custom maps so don't forget to share both. See the appropriate section below!

### Custom Textures

Ballistic Zen custom maps now support custom textures. Textures must be packed up in a '.wad' file.

* Create '.wad' files for custom textures using external tools
  * [Half-Life Texture Tools](https://github.com/yuraj11/HL-Texture-Tools) is easy to use
  * Create any number of `.wad` files
  * They can be named in any way
* Save the wads to `%BallisticZenUserDataFolder%/player-maps/wads`
  * You can find this on windows by going to `%AppData%`, going up a level, then going to `LocalLow\footnotesforthefuture\Ballistic Zen\player-maps\wads`
* Tell Trenchbroom where to find them in the same was as initial setup

# Custom Lines

Custom lines are created in game.

* Start recording a line with the `L` key
* Stop recording a line with the `L` key again
* Cancel the line with the `C` key, or, 
* Save the line with the `F` key

Watch [this video](https://www.youtube.com/watch?v=zbHPwwxpgT4) for a demonstration.

* Lines can be found in the following folder: `%BallisticZenUserDataFolder%/player-lines`
  * You can find this on windows by going to `%AppData%`, going up a level, then going to `LocalLow\footnotesforthefuture\Ballistic Zen\player-lines`
  * Put lines from other players into this folder

Here is a line I made for the main game: [Colossus](Colossus.bzl). `Right click -> Save Link As` to the above location to give it a try. You can find it in the pyramid. It's extremely difficult. Consider it a puzzle!

Currently the most official place to share your lines is the [discord server](https://discord.gg/XS29Pdr).

Custom lines will work on custom maps so don't forget to share both. See the above section!