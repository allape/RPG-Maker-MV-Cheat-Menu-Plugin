@echo off

echo Backing up package.json...
copy package.json package.json~

echo Copying cm-patcher-package.json to package.json...
copy cm-patcher-package.json package.json

echo If patcher exits with error, run "cm-patch-fix.bat" to restore the game.

echo Patcher should be opened now...

.\Game.exe
.\cm-patch-fix.bat
