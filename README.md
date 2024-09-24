# Cheat Menu for RPG Maker MV/MZ

inspired by (forked
from) [emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin](https://github.com/emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin)

---
### ⚠️⚠️⚠️ Still in TESTING, Save Game Frequently ⚠️⚠️⚠️
---

### Installation

#### Method 1

- Download [Git](https://git-scm.com/downloads)
  - Run installer and click `Next` until finish
- Download [cheat script](https://github.com/allape/RPG-Maker-MV-Cheat-Menu-Plugin/releases)
- Extract the zip file and copy everything to game folder
  - Make sure that `patch.sh` is in the same folder of `Game.exe`
- Open `patch.sh` with `Git for Windows`
- After a black window shows up and closes, the game is patched

### Uninstallation, for now. `patcher` will support uninstallation in the future

- Open `www/js/plugins/AsCheater.js` or `js/plugins/AsCheater.js` with text editor, remove all characters, then save.
- Re-installation requires the full steps in `Installation` without patching

### FAQ

- There is no `www/js/plugins` or `js/plugins` in game folder
  - Use [EnigmaVBUnpacker](https://f95zone.to/threads/rpg-maker-mv-unpacker.417/post-3577739) to unpack game

### Dev

```shell
# run
npm run dev
# build
npm build
```
