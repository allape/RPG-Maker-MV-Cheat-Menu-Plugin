## Cheat Menu for RPG Maker MV/MZ, inspired by (forked from) [emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin](https://github.com/emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin)

---
### ⚠️⚠️⚠️ Still in TESTING, Save Game Frequently ⚠️⚠️⚠️
---

### Executable `patcher` is not supported in macOS yet

### Screenshots
![Index](screenshots/home.png)  
![SpeedHack](screenshots/speed-hack.png)  
![PartyHP](screenshots/party-hp.png)  

### Features
- Keyboard and Mouse both supported 
- Modules
  - God Mode
  - Move Speed
  - Gold
  - Items
  - Variables
  - Status: manipulate Max HP, max MP, attack, defense and more
  - Translate
    - Open source online translation services: [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate#mirrors)
    - Draw japanese to translate: [Google Translate](https://translate.google.com/?sl=ja&tl=en&op=translate), [jisho](https://jisho.org/#handwriting)
    - ✔ Message window translate
    - ✔ Choices translate
    - ❌ Menu or Item translate
    - ❌ Image text translate
  - Speed Hack: [Cheat Engine](https://www.cheatengine.org/) also supports speed hack, but CE may cause program freeze (nwjs base game, but Unity3D is completely fine)
  - Enemy HP: manipulate HP of enemies in battle
  - Party HP: manipulate HP of teammates and hero itself in battle
  - Party MP: manipulate MP of teammates and hero itself in battle
  - Party TP: manipulate TP of teammates and hero itself in battle
  - Teleport
  - No Clip
  - Give Experience
  - Switches: Toggle boolean variables
  - Weapons
  - Armors
  - Clear States
  - Game Save: for emergency only

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

### FAQ
- After double-clicking `MVPluginPatcher.exe`, there is a black window keeps showing
  - It means this exe failed to patch the game with cheats
- There is no `www/js/plugins` or `js/plugins` in game folder
    - Use [EnigmaVBUnpacker](https://f95zone.to/threads/rpg-maker-mv-unpacker.417/post-3577739) to unpack game

### Dev

#### Building on Windows requires changing `./build.sh` to `build.sh` in `build:go` of `package.json` scripts

#### nodejs
```shell
# install dependencies
npm i
# build production, this will also build patcher. (Windows requires `MINGW64` to run shell script)
npm run-script build
```
#### go
```shell
cd patcher
# install go mod dependencies
go get
# build executable patcher
./build.sh
```

#### Styles inspection, and styles only, [index.html](public/index.html)

#### Copy files after built, details in [postbuild.js](postbuild.js)
- Create a file, `copycat.json`, at project root dir
- Key is a relative path to project root dir, value is an absolute path which is destination
