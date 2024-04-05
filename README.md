# Cheat Menu for RPG Maker MV/MZ

inspired by (forked
from) [emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin](https://github.com/emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin)

---
### ⚠️⚠️⚠️ Still in TESTING, Save Game Frequently ⚠️⚠️⚠️
---

### Installation

- Download [release zip](https://github.com/allape/RPG-Maker-MV-Cheat-Menu-Plugin/releases)
- Traditional method
  - Download Cheat Plugin patch at [GitHub](https://github.com/emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin)
  - Unzip these zips
  - Copy everything inside release zip into `Cheat_Menu/`, and allow overriding existing files
  - Copy all files inside `Cheat_Menu/` into game folder
  - Run `MVPluginPatcher.exe`
- New method with JavaScript interpreter
  - Unzip release zip
  - Copy all files into game folder
  - Run `patcher.exe`
- Start Game, wait for 1 second at least, then load an existing save or start a new game
  - Press `1` to open/hide cheat menu
  - Click top-left corner to open cheat menu

### Uninstallation, for now. `patcher` will support uninstallation in the future

- Open `www/js/plugins/AsCheater.js` or `js/plugins/AsCheater.js` with text editor, remove every character, then save.
- Re-installation requires the full steps in `Installation` without patching

### FAQ

- After double-clicking `MVPluginPatcher.exe`, there is a black window keeps showing
  - It means this exe failed to patch the game with cheats
- There is no `www/js/plugins` or `js/plugins` in game folder
  - Use [EnigmaVBUnpacker](https://f95zone.to/threads/rpg-maker-mv-unpacker.417/post-3577739) to unpack game
- If `Cheat Menu` is not working, or game prompt an ERROR on starting
  - Restore `www/js/plugins.js` or `js/plugins.js` with `plugins.js.bak` using a text editor. Or reinstall the game
  - Replace the content in `plugins_patch.go.txt` to `AsCheater_legacy`
    - Or delete `plugins_patch.go.txt`, then rename `plugins_patch.legacy.go.txt` to `plugins_patch.go.txt`
  - Follow the `Installation` to patch plugin

### Dev

```shell
# run
npm run dev
# build
npm build
```
