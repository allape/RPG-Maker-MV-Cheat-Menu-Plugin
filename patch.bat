@echo off

echo Backing up package.json...
copy package.json package.json~

echo Copying patcher-package.json to package.json...
copy patcher-package.json package.json

echo If patcher exits with error, run "patch-fix.bat" to restore the game.

echo Patcher should be opened now...

.\Game.exe
.\patch-fix.bat
