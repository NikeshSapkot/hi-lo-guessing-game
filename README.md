# Hi-Lo Guessing Game Project

A modern, interactive React website showcasing the classic Hi-Lo Number Guessing Game with comprehensive documentation and a fully playable game interface.

## 🎮 Features

### Documentation Section
- **Requirements Card**: Clear list of game rules and specifications
- **Algorithm Card**: Step-by-step explanation of the game logic
- **Hurdles Card**: Common challenges and their solutions

### Interactive Game
- Random number generation (1-100)
- Real-time feedback (too high/too low)
- Guess counter and history tracking
- Quit functionality (enter 0)
- Play again option
- Input validation and error handling
- Modern, responsive UI with animations

## 🛠️ Built With

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **Lucide React** - Modern icons
- **Class Variance Authority** - Component styling utilities

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
   ```bash
   cd hi-lo-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 Game Rules

1. The computer thinks of a random number between 1 and 100
2. Enter your guess in the input field
3. Receive feedback: "too high", "too low", or "correct!"
4. Enter `0` at any time to quit the game
5. Try to guess the number in as few attempts as possible
6. Play again after winning or quitting

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   └── input.jsx
│   ├── Documentation.jsx # Requirements, Algorithm, Hurdles
│   └── HiLoGame.jsx      # Interactive game component
├── lib/
│   └── utils.js          # Utility functions
├── App.jsx               # Main application component
├── index.css             # Global styles with Tailwind
└── main.jsx              # React entry point
```

## 🎨 Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean cards with hover effects and transitions
- **Color-coded Sections**: Blue (Requirements), Green (Algorithm), Orange (Hurdles)
- **Interactive Feedback**: Real-time game status and guess history
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 🧠 Algorithm Overview

1. **Initialize**: Generate random target number (1-100)
2. **Input Loop**: Accept user guesses and validate input
3. **Comparison**: Compare guess with target and provide feedback
4. **Termination**: End on correct guess or quit signal (0)
5. **Replay**: Offer option to start new game

## 📚 Educational Value

This project demonstrates:
- **Game Logic Implementation**: Random number generation, input validation
- **State Management**: React hooks for game state
- **User Interface Design**: Modern component-based architecture
- **Algorithm Documentation**: Clear explanation of program flow
- **Problem Solving**: Handling edge cases and user input validation

## 🎓 Perfect for

- Computer Science classroom demonstrations
- Algorithm teaching and learning
- React development portfolio pieces
- Interactive programming examples
- Code review and discussion sessions

## 📄 License

This project is open source and available under the MIT License.

---

*Built with ❤️ for educational purposes*
