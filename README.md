## Auto Translator for RPG Maker MV

### ⚠️⚠️⚠️ This plugin will not replace the original text, it will display the translated text in an individual viewport ⚠️⚠️⚠️

### Features
- ✔ Message window translate
- ✔ Choices translate
- ❌ Menu or Item translate
- ❌ Image text translate

### Translate Server: [https://github.com/LibreTranslate/LibreTranslate#mirrors](https://github.com/LibreTranslate/LibreTranslate#mirrors)

### Instructions
- Download release zip
- Download Cheat Plugin patch at [GitHub](https://github.com/emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin)
- Unzip these zips
- Copy ```Auto_Translator.js``` into ```Cheat_Menu/www/js/plugins```
- Replace the ```plugins_patch.txt``` in ```Cheat_Menu/``` with the same name file in release
- Copy all files inside ```Cheat_Menu/``` into game folder
- Run MVPluginPatcher.exe
- Start game, then a button will appear in the top-left corner in 3 seconds, clicking it will display the translation window 

### FAQ
- there is no ```www/js/plugins``` in game folder
    - use [EnigmaVBUnpacker](https://f95zone.to/threads/rpg-maker-mv-unpacker.417/post-3577739) to unpack game

### Dev
```shell
# install dependencies
npm i

# build production
npm run-script build
```
