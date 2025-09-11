#!/bin/bash

echo "================================"
echo "   Hi-Lo Game - Java Version"
echo "================================"
echo

echo "Compiling Java code..."
javac HiLoGame.java

if [ $? -eq 0 ]; then
    echo "Compilation successful!"
    echo
    echo "Starting the game..."
    echo
    java HiLoGame
else
    echo
    echo "Compilation failed! Please check for errors."
    echo "Make sure Java JDK is installed and in your PATH."
fi

echo
echo "Press any key to exit..."
read -n 1
