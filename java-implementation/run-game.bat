@echo off
echo ================================
echo    Hi-Lo Game - Java Version
echo ================================
echo.
echo Compiling Java code...
javac HiLoGame.java

if %ERRORLEVEL% EQU 0 (
    echo Compilation successful!
    echo.
    echo Starting the game...
    echo.
    java HiLoGame
) else (
    echo.
    echo Compilation failed! Please check for errors.
    echo Make sure Java JDK is installed and in your PATH.
)

echo.
pause
