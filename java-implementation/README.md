# Hi-Lo Game - Java Implementation

A comprehensive console-based Hi-Lo number guessing game written in Java with advanced features including multiple difficulty levels, timed gameplay, and detailed statistics tracking.

## Features

### 🎮 Game Modes
- **Standard Game**: Classic Hi-Lo gameplay with no time limit
- **Timed Game**: Race against the clock (60 seconds)

### 🎚️ Difficulty Levels
- **Easy**: 1-50 (Optimal: 6 guesses)
- **Medium**: 1-100 (Optimal: 7 guesses) 
- **Hard**: 1-1000 (Optimal: 10 guesses)
- **Expert**: 1-10000 (Optimal: 14 guesses)

### 📊 Advanced Features
- **Statistics Tracking**: Win rate, average guesses, best/worst scores
- **Performance Analysis**: Efficiency ratings and binary search tips
- **Smart Hints**: Context-aware feedback based on guess proximity
- **Input Validation**: Robust error handling and user-friendly prompts
- **Session Tracking**: Per-difficulty performance breakdowns

## How to Run

### Prerequisites
- Java 8 or higher installed
- Command line access (Terminal/Command Prompt)

### Compilation and Execution

1. **Navigate to the java-implementation directory**:
   ```bash
   cd java-implementation
   ```

2. **Compile the Java file**:
   ```bash
   javac HiLoGame.java
   ```

3. **Run the game**:
   ```bash
   java HiLoGame
   ```

### Alternative: One-line compilation and execution
```bash
javac HiLoGame.java && java HiLoGame
```

## How to Play

1. **Choose a game mode** from the main menu
2. **Select difficulty level** (if not already set)
3. **Make your guesses**:
   - Enter numbers within the specified range
   - Use feedback ("too high" or "too low") to narrow down
   - Enter `0` to quit the current game
4. **View statistics** to track your performance over time

### Strategy Tips
- **Use Binary Search**: Always guess the middle of the remaining range
- **For range 1-100**: Start with 50, then 25 or 75 based on feedback
- **Optimal performance**: You can always find the answer in ≤ log₂(n) guesses

## Code Structure

### Main Class: `HiLoGame`
- **Game Logic**: Core gameplay mechanics and state management
- **Input Handling**: Robust validation and error recovery
- **User Interface**: Menu system and feedback display

### Inner Classes:
- **`Difficulty` Enum**: Defines game difficulty levels with optimal guess calculations
- **`GameStatistics`**: Tracks performance metrics and displays analytics
- **`GameResult` Enum**: Represents guess outcomes (TOO_LOW, TOO_HIGH, CORRECT)

### Key Methods:
- `playStandardGame()`: Standard gameplay loop
- `playTimedGame()`: Timed gameplay with countdown
- `processGuess()`: Core logic for evaluating guesses
- `getValidInput()`: Robust input validation
- `displayStatistics()`: Comprehensive performance analysis

## Educational Value

This implementation demonstrates several computer science concepts:

### 🔍 Algorithms
- **Binary Search Strategy**: Optimal guessing algorithm
- **Input Validation**: Defensive programming practices
- **State Management**: Game state tracking and transitions

### 📊 Data Structures
- **Enumerations**: Type-safe constants for game states
- **Collections**: Lists and Maps for statistics tracking
- **Object-Oriented Design**: Encapsulation and separation of concerns

### 🎯 Design Patterns
- **Enumeration Pattern**: Difficulty levels and game results
- **Strategy Pattern**: Different game modes
- **Template Method**: Common gameplay structure

## Sample Output

```
╔════════════════════════════════════════╗
║          🎯 HI-LO CHALLENGE 🎯        ║
║                                        ║
║    A Modern Number Guessing Game       ║
║   by Nikesh Sapkota & Prashant Basyal ║
╚════════════════════════════════════════╝

🎮 GAME MENU:
1. 🎯 Play Standard Game
2. ⏰ Play Timed Game (60 seconds)
3. 🎚️ Change Difficulty
4. 📊 View Statistics
5. ❓ Help
6. 👋 Quit
Enter your choice: 1

🎯 STANDARD GAME MODE
Range: 1 to 100
Optimal guesses: 7
Enter 0 to quit the current game.

Attempt #1 - Enter your guess: 50
🎯 Pretty 📈 Too low! Try higher.
Attempt #2 - Enter your guess: 75
🎪 Getting 📉 Too high! Try lower.
Attempt #3 - Enter your guess: 62
🎊 Very 📈 Too low! Try higher.
Attempt #4 - Enter your guess: 68
🎊 Very 📉 Too high! Try lower.
Attempt #5 - Enter your guess: 65

🎉 Congratulations!
🎯 You guessed 65 in 5 attempts!
🏅 Perfect! You used the optimal strategy!
📈 Efficiency: 140.0%
```

## Performance Analysis

The game provides detailed performance metrics:
- **Efficiency Rating**: Compares your performance to optimal binary search
- **Win Rate**: Percentage of games completed successfully
- **Difficulty Analysis**: Performance breakdown by difficulty level
- **Trend Tracking**: Recent performance compared to historical average

## Extensions and Modifications

This codebase is designed for easy extension:

1. **Add New Difficulty Levels**: Extend the `Difficulty` enum
2. **New Game Modes**: Create additional play methods
3. **Enhanced Statistics**: Expand the `GameStatistics` class
4. **AI Opponent**: Add computer player using optimal strategy
5. **File Persistence**: Save/load statistics to/from files

## Educational Use

Perfect for demonstrating:
- **Object-Oriented Programming**: Classes, encapsulation, inheritance
- **Algorithm Analysis**: Time complexity, optimal strategies
- **Error Handling**: Input validation, exception management
- **User Interface Design**: Console-based interaction patterns
- **Software Architecture**: Modular design, separation of concerns

## Authors

- **Nikesh Sapkota** - Lead Developer
- **Prashant Basyal** - Co-Developer

## Version History

- **v2.0** (2025-01-11): Feature-complete version with statistics and multiple game modes
- **v1.0** (Initial): Basic Hi-Lo gameplay implementation
