@echo off

echo Backing up package.json...
copy package.json package.json~

echo Copying cm-patcher-package.json to package.json...
copy cm-patcher-package.json package.json

echo If patcher exits with error, run "cm-patch-fix.bat" to restore the game.

echo Patcher should be opened now...

if exist .\nw.exe (
    .\nw.exe .
) else if exist .\Game.exe (
    .\Game.exe
) else (
    for /r %%i in (*.exe) do (
        if not "%%~nxi" == "notification_helper.exe" (
            echo Run %%i as Game.exe
            %%i
        )
    )
)

.\cm-patch-fix.bat
