# Cheat Menu for RPG Maker MV/MZ

inspired by (forked
from) [emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin](https://github.com/emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin)

---

### ⚠️⚠️⚠️ Still in TESTING, Save Game Frequently ⚠️⚠️⚠️

- Tested in
    - NW v0.29.0
    - NW v0.49.0

---

### FAQ

- There is no `www/js/plugins` or `js/plugins` in game folder.
    - Use [EnigmaVBUnpacker](https://f95zone.to/threads/rpg-maker-mv-unpacker.417/post-3577739) to unpack game.
- There is no `Game.exe` in game folder.
    - Open file [cm-patch.bat](cm-patch.bat) with `Note Pad` or other text editor.
    - Change the line `.\Game.exe` to the executable file of your game.
        - For example: change `.\Game.exe` to `.\Game_en.exe` when game is patched with english translation.
    - Then save it and double click `cm-patch.bat` to patch the game.

### Previews

[Dummy Playground](https://allape.github.io/RPG-Maker-MV-Cheat-Menu-Plugin/index.html)

![pic-main.png](samples/pic-main.png)
![pic-empty-settings.png](samples/pic-empty-settings.png)
![pic-settings.png](samples/pic-settings.png)

### Installation

- Download [Cheat Menu](https://github.com/allape/RPG-Maker-MV-Cheat-Menu-Plugin/releases).
- Extract the zip file and copy everything to game folder.
    - Make sure that `cm-patch.bat` is in the same folder of `Game.exe`.
- Double click `cm-patch.bat`.

### Uninstallation

- Double click `cm-patch.bat`, it will guide to unpatch this game.
    - And also, you can manually copy `www/js/plugins.js~` to `www/js/plugins.js`.
        - It will be `js/plugins.js~` if you have MZ game.

### Dev

```shell
# run
npm run dev
# build
npm run build
```
