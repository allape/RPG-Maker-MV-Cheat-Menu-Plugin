## Cheater for RPG Maker MV

### ⚠️⚠️⚠️ Still in TESTING, Save Game Frequently ⚠️⚠️⚠️

### In Progress
- `Searching Text Field` caches with game saving file
- `Scroll Selector` states cache with game saving file

### Instructions
- Download release zip
- Download Cheat Plugin patch at [GitHub](https://github.com/emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin)
- Unzip these zips
- Copy everything in release zip into `Cheat_Menu/`
- Copy all files inside `Cheat_Menu/` into game folder
- Run `MVPluginPatcher.exe`
- Start game, then load a game or start a new game, then press `1` to display cheat menu 

### FAQ
- After double-clicking `MVPluginPatcher.exe`, there is a black window keeps showing
  - It means this exe failed to patch the game with cheats
- There is no ```www/js/plugins``` in game folder
    - use [EnigmaVBUnpacker](https://f95zone.to/threads/rpg-maker-mv-unpacker.417/post-3577739) to unpack game

### Dev
```shell
# install dependencies
npm i

# build production
npm run-script build
```
