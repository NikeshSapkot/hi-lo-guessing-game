# Hi-Lo Game: Logic and Implementation Details

This document explains the core game logic implemented in this project, the data structures and algorithms used to analyze gameplay, and potential challenges you may face while building or extending the game.


## 1) Game Overview
- Objective: Guess a secret number between 1 and 100.
- Controls: Enter a number and submit; enter 0 to quit a game.
- Feedback: Each guess returns one of: Too low, Too high, or Correct.
- Win condition: Guess the exact number.


## 2) Core State Machine
The UI is driven by a simple state machine in the component `src/components/SimpleHiLoGame.jsx`:
- waiting: Initial state before a game starts
- playing: Active game; target is set; guesses are accepted
- won: Player guessed the target
- quit: Player entered 0 to exit the current game

State transitions:
- waiting -> playing: Start game (generate target in [1, 100])
- playing -> won: Correct guess
- playing -> quit: Guess == 0
- won/quit -> playing: Start a new game
- won/quit -> waiting: Reset


## 3) Input Validation and Feedback
- Accept only integers (NaN is rejected)
- Range validation: 1-100 (or 0 to quit)
- Feedback messages:
  - Too low, Too high (include guess count)
  - Win message with attempts
  - Quit message reveals the target


## 4) Random Target Generation
- The target number is chosen uniformly using: `Math.floor(Math.random() * 100) + 1`.
- Potential improvement: For testability, inject a seeded RNG in development/testing.


## 5) Guess Tracking and History
- Each guess is appended to `guessHistory` with count and timestamp.
- History is rendered as labeled chips for quick visual scanning.


## 6) Analytics and Algorithms (DSA/AI)
The game includes educational analytics to demonstrate time/space complexity and algorithmic thinking. These utilities live in `src/lib/gameAlgorithms.js`.

6.1) PerformanceAnalytics
- Records per-guess and per-session metrics.
- Aggregates:
  - totalGames, totalGuesses
  - averageAttempts
  - best/worst performance (via heaps)
  - most frequent guesses (via BST)
  - common patterns (via Trie)
- Complexity: O(n) space for storing sessions/guesses.

6.2) Binary Search Tree (BST)
- Purpose: Track frequency and metadata of guesses.
- Operations used: insert, inorder traversal, most frequent value.
- Complexity:
  - Average insert/search: O(log n)
  - Worst-case (unbalanced): O(n)

6.3) Min/Max Heaps
- Purpose: Track best (min attempts) and worst (max attempts) outcomes.
- Operations: insert to min-heap and max-heap; read min/max.
- Complexity:
  - insert: O(log n)
  - getMin/getMax: O(1)

6.4) Trie (Prefix Tree)
- Purpose: Store simple guess "patterns" (here, stringified numbers) for frequency/pattern analysis.
- Operations: insert, search, DFS for all patterns.
- Complexity:
  - insert/search: O(L) where L is pattern length (small here)

6.5) AI Strategy Engine
- Strategies implemented:
  - binarySearch: Optimal divide-and-conquer strategy for unknown target; O(log n) reasoning.
  - monteCarlo: Simple stochastic variant around midpoints; demonstrates probabilistic thinking.
  - bayesian: Maintains/update a probability distribution based on feedback (low/high) to suggest the highest-probability guess.
  - adaptivePattern: Analyzes trends/volatility in prior guesses to bias ranges.
- API: `getBestStrategy(low, high, previousGuesses)` compares strategies by confidence and returns the best suggestion.

6.6) Game Theory Analyzer (Minimax)
- Educational minimax approach over ranges to estimate an optimal next guess.
- Guards recursion depth to avoid blowups.
- Returns: { optimalGuess, expectedMoves } for a given range.


## 7) Measured Metrics
- Time complexity records per operation (BST insert, AI calls), using high-resolution time.
- Space complexity estimates for guess history and node structures.
- Efficiency vs. theoretical optimal: compares attempts to ceil(log2(100)).


## 8) UI/UX Details
- Modern, accessible inputs with clear focus states.
- Minimal background with subtle pattern and a single floating orb to reduce distraction.
- Responsive layout for mobile and desktop.


## 9) Potential Problems and How to Avoid Them
1) Input Handling & Edge Cases
   - Non-numeric input (NaN) should be rejected with friendly feedback.
   - Out-of-range guesses (e.g., <1 or >100) must be blocked and explained.
   - Leading zeros or empty strings: sanitize and validate before parseInt.

2) State Management Bugs
   - Race conditions when updating multiple state slices derived from previous values. Use functional setState or compute from latest state.
   - Ensure all state resets occur when starting a new game (history, counters, analytics timers).

3) Performance & Memory
   - Storing large histories over many sessions can grow; consider truncating or summarizing for long-running sessions.
   - Avoid re-computing heavy analytics for every render; memoize or batch updates.

4) Randomness & Testability
   - Pure `Math.random()` complicates deterministic tests. Abstract RNG for seeded tests.

5) Accessibility (a11y)
   - Provide clear instructions and error messages for screen readers.
   - Ensure sufficient color contrast; minimal background helps. Maintain focus ring visibility.
   - Keyboard navigation: Enter to submit is supported; ensure buttons/inputs are focusable.

6) Visual Overload
   - Heavy gradients and animations can distract or reduce readability. The project uses a subtle grid pattern and a single faint orb to keep it minimal.

7) Cross-Browser Issues
   - CSS features like backdrop-filter and custom scrollbars may behave differently across browsers. Provide graceful fallbacks.

8) Numerical Limits & Internationalization
   - Input type=number behaves differently per locale (e.g., decimal separators). Use step and validation accordingly.

9) Security
   - No user PII; do not log sensitive data. Keep dependencies updated.

10) Deployment Builds
   - Ensure assets paths work under production hosting (e.g., base path in Vite config if hosted on a subpath).


## 10) Extensibility Ideas
- Difficulty modes (e.g., different ranges: 1-1000) with dynamic optimal attempt references.
- Leaderboards or session persistence via localStorage.
- Swap AI strategy suggestions live and visualize decision boundaries.
- Add tests: unit tests for algorithms and component tests for state transitions.


## 11) How to Run (local)
- Install deps in `hi-lo-game` folder: `npm install`
- Start dev server: `npm run dev`
- Build for production: `npm run build` and preview with `npm run preview`


## 12) File Map (key files)
- `src/components/SimpleHiLoGame.jsx`: Main game UI and state machine
- `src/lib/gameAlgorithms.js`: DSA/AI utilities (BST, Heaps, Trie, AI strategies, Minimax, Analytics)
- `src/App.jsx`: Page layout + animated minimal background
- `src/index.css`: Base styles and utility classes


— End of Document —

