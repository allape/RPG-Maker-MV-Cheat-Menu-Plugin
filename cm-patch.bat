@echo off

echo Backing up package.json...
copy package.json package.json~

echo Copying cm-patcher-package.json to package.json...
copy cm-patcher-package.json package.json

echo If patcher exits with error, run "cm-patch-fix.bat" to restore the game.

echo Patcher should be opened now...

if exist .\nw.exe (
    .\nw.exe .
    .\cm-patch-fix.bat
) else if exist .\Game.exe (
    .\Game.exe
    .\cm-patch-fix.bat
) else (
    for /r %%i in (*.exe) do (
        if not "%%~nxi" == "notification_helper.exe" (
            echo Run %%i as Game.exe
            %%i
            .\cm-patch-fix.bat
            exit
        )
    )
    echo Game executable not found.
)

