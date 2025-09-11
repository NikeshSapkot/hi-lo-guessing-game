# Common Problems and Solutions When Building Hi-Lo Games

This document outlines common problems developers encounter when building number guessing games and provides practical solutions.

## 1. Input Validation Problems

### Problem: Invalid User Input
**Common Issues:**
- Users entering non-numeric values
- Empty or whitespace-only inputs
- Negative numbers or decimal values
- Very large numbers that exceed JavaScript's safe integer range

**Solutions:**
```javascript
// Robust input validation
function validateGuess(input) {
  const guess = parseInt(input, 10);
  
  if (isNaN(guess)) {
    return { valid: false, error: "Please enter a valid number" };
  }
  
  if (guess < 1 || guess > 100) {
    return { valid: false, error: "Number must be between 1 and 100" };
  }
  
  return { valid: true, value: guess };
}
```

### Problem: Leading Zeros and String Handling
**Issue:** Input "007" might be treated differently than "7"

**Solution:**
```javascript
// Normalize input by parsing and converting back
const normalizeInput = (input) => {
  const parsed = parseInt(input, 10);
  return isNaN(parsed) ? null : parsed;
};
```

## 2. Random Number Generation Issues

### Problem: Predictable Random Numbers
**Issue:** `Math.random()` is not cryptographically secure and can be predictable

**Solutions:**
```javascript
// For games, Math.random() is usually sufficient
const generateTarget = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// For testing, use seeded random for reproducibility
class SeededRandom {
  constructor(seed = 1) {
    this.seed = seed;
  }
  
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  range(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}
```

### Problem: Non-Uniform Distribution
**Issue:** Poor random number generation can lead to biased results

**Solution:**
```javascript
// Ensure uniform distribution
const uniformRandom = (min, max) => {
  const range = max - min + 1;
  const maxValid = Math.floor(Number.MAX_SAFE_INTEGER / range) * range - 1;
  
  let random;
  do {
    random = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  } while (random > maxValid);
  
  return (random % range) + min;
};
```

## 3. State Management Problems

### Problem: Race Conditions in State Updates
**Issue:** Multiple rapid state updates can lead to inconsistent state

**Solution:**
```javascript
// Use functional updates for React
const makeGuess = useCallback(() => {
  setGuessCount(prevCount => prevCount + 1);
  setGuessHistory(prevHistory => [...prevHistory, guess]);
}, [guess]);

// Or use useReducer for complex state
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'MAKE_GUESS':
      return {
        ...state,
        guessCount: state.guessCount + 1,
        guessHistory: [...state.guessHistory, action.guess],
        feedback: generateFeedback(action.guess, state.target)
      };
    default:
      return state;
  }
};
```

### Problem: Incomplete State Resets
**Issue:** Not clearing all state when starting a new game

**Solution:**
```javascript
const resetGame = () => {
  // Reset ALL game-related state
  setGameState('waiting');
  setTargetNumber(null);
  setCurrentGuess('');
  setGuessCount(0);
  setFeedback('');
  setGuessHistory([]);
  setStartTime(null);
  // Don't forget timers, analytics, etc.
  clearTimeout(gameTimer);
  resetAnalytics();
};
```

## 4. Performance Issues

### Problem: Memory Leaks in Long Sessions
**Issue:** Storing unlimited history can consume excessive memory

**Solutions:**
```javascript
// Limit history size
const MAX_HISTORY_SIZE = 1000;

const addToHistory = (newEntry) => {
  setHistory(prevHistory => {
    const updated = [...prevHistory, newEntry];
    return updated.length > MAX_HISTORY_SIZE 
      ? updated.slice(-MAX_HISTORY_SIZE) 
      : updated;
  });
};

// Or use circular buffer for fixed memory usage
class CircularBuffer {
  constructor(size) {
    this.size = size;
    this.buffer = new Array(size);
    this.index = 0;
    this.count = 0;
  }
  
  add(item) {
    this.buffer[this.index] = item;
    this.index = (this.index + 1) % this.size;
    this.count = Math.min(this.count + 1, this.size);
  }
  
  getAll() {
    return this.buffer.slice(0, this.count);
  }
}
```

### Problem: Expensive Re-renders
**Issue:** Computing analytics on every render

**Solution:**
```javascript
// Memoize expensive calculations
const analytics = useMemo(() => {
  return computeExpensiveAnalytics(gameHistory);
}, [gameHistory]);

// Use React.memo for components
const AnalyticsDisplay = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});
```

## 5. User Experience Problems

### Problem: Unclear Feedback
**Issue:** Vague or confusing error messages

**Solutions:**
```javascript
const generateFeedback = (guess, target, attempts) => {
  if (guess === target) {
    return `🎉 Correct! You found ${target} in ${attempts} ${attempts === 1 ? 'guess' : 'guesses'}!`;
  }
  
  const difference = Math.abs(guess - target);
  let hint = '';
  
  if (difference > 25) hint = 'Very ';
  else if (difference > 10) hint = 'Pretty ';
  else if (difference > 5) hint = 'Getting ';
  else hint = 'Very ';
  
  const direction = guess < target ? 'low' : 'high';
  return `${hint}${direction}! Try ${guess < target ? 'higher' : 'lower'}. (Attempt ${attempts})`;
};
```

### Problem: Poor Accessibility
**Issue:** Screen readers and keyboard users can't play effectively

**Solutions:**
```javascript
// ARIA labels and screen reader support
<input
  type="number"
  value={guess}
  onChange={(e) => setGuess(e.target.value)}
  aria-label="Enter your guess"
  aria-describedby="feedback-text"
  onKeyPress={(e) => e.key === 'Enter' && makeGuess()}
/>

<div id="feedback-text" aria-live="polite">
  {feedback}
</div>

// Focus management
useEffect(() => {
  if (gameState === 'won' || gameState === 'lost') {
    playAgainButtonRef.current?.focus();
  }
}, [gameState]);
```

## 6. Algorithm and Logic Problems

### Problem: Inefficient Search Strategies
**Issue:** Linear search approach for AI recommendations

**Solution:**
```javascript
// Binary search for optimal AI strategy
const binarySearchStrategy = (low, high, previousGuesses) => {
  let currentLow = low;
  let currentHigh = high;
  
  // Narrow range based on previous feedback
  for (const { guess, feedback } of previousGuesses) {
    if (feedback === 'low') {
      currentLow = Math.max(currentLow, guess + 1);
    } else if (feedback === 'high') {
      currentHigh = Math.min(currentHigh, guess - 1);
    }
  }
  
  return Math.floor((currentLow + currentHigh) / 2);
};
```

### Problem: Poor Random Target Selection
**Issue:** Some numbers appear more frequently than others

**Solution:**
```javascript
// Test random distribution
const testRandomDistribution = (samples = 10000) => {
  const counts = new Array(101).fill(0);
  
  for (let i = 0; i < samples; i++) {
    const num = Math.floor(Math.random() * 100) + 1;
    counts[num]++;
  }
  
  const expected = samples / 100;
  const variance = counts.slice(1).reduce((sum, count) => {
    return sum + Math.pow(count - expected, 2);
  }, 0) / 100;
  
  console.log('Random distribution variance:', variance);
  return variance < expected * 0.1; // Good if variance is low
};
```

## 7. Testing Challenges

### Problem: Testing Random Behavior
**Issue:** Difficult to test games with random elements

**Solutions:**
```javascript
// Dependency injection for testability
class Game {
  constructor(randomGenerator = Math.random) {
    this.random = randomGenerator;
  }
  
  generateTarget() {
    return Math.floor(this.random() * 100) + 1;
  }
}

// Mock random for tests
const mockRandom = (value) => () => value;
const game = new Game(mockRandom(0.5)); // Will always generate 51
```

### Problem: Integration Testing UI State
**Issue:** Complex state transitions are hard to test

**Solution:**
```javascript
// Test state machine transitions
describe('Game State Machine', () => {
  test('should transition from waiting to playing', () => {
    const { getByText } = render(<Game />);
    const startButton = getByText('Start Game');
    
    fireEvent.click(startButton);
    
    expect(screen.getByLabelText('Enter your guess')).toBeInTheDocument();
  });
  
  test('should handle win condition', () => {
    const mockGame = new Game(mockRandom(0.5)); // Target will be 51
    const { getByLabelText, getByText } = render(<GameWithMock game={mockGame} />);
    
    fireEvent.click(getByText('Start Game'));
    fireEvent.change(getByLabelText('Enter your guess'), { target: { value: '51' } });
    fireEvent.click(getByText('Make Guess'));
    
    expect(screen.getByText(/Correct!/)).toBeInTheDocument();
  });
});
```

## 8. Cross-Platform and Browser Issues

### Problem: Different Number Input Behavior
**Issue:** Mobile browsers handle number inputs differently

**Solutions:**
```javascript
// Input mode and pattern for better mobile experience
<input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  value={guess}
  onChange={handleInputChange}
/>

const handleInputChange = (e) => {
  const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow digits
  setGuess(value);
};
```

### Problem: CSS Compatibility
**Issue:** Modern CSS features not supported in all browsers

**Solution:**
```css
/* Graceful fallbacks for backdrop-filter */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

@supports not (backdrop-filter: blur(20px)) {
  .glass {
    background: rgba(255, 255, 255, 0.3);
  }
}
```

## 9. Security Considerations

### Problem: Client-Side Cheating
**Issue:** Target number visible in browser dev tools

**Solutions:**
```javascript
// For educational games, this is usually acceptable
// For competitive games, validate on server
const serverValidatedGuess = async (guess) => {
  const response = await fetch('/api/guess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guess, sessionId })
  });
  
  return response.json(); // Server returns only feedback, not target
};
```

## 10. Deployment and Build Issues

### Problem: Asset Path Issues in Production
**Issue:** Assets not loading when deployed to subdirectory

**Solution:**
```javascript
// vite.config.js
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/hi-lo-game/' : '/',
  // ... other config
});
```

### Problem: Bundle Size Optimization
**Issue:** Large bundle size affects loading performance

**Solutions:**
```javascript
// Code splitting for analytics
const AdvancedAnalytics = lazy(() => import('./AdvancedAnalytics'));

// Tree shaking unused utilities
export { BST, AIEngine } from './gameAlgorithms';
// Import only what's needed: import { BST } from './gameAlgorithms';

// Bundle analyzer to identify large dependencies
npm install --save-dev webpack-bundle-analyzer
```

## Prevention Strategies

1. **Write Tests Early**: Test edge cases and state transitions
2. **Use TypeScript**: Catch type-related bugs at compile time
3. **Implement Proper Error Boundaries**: Handle unexpected errors gracefully
4. **Profile Performance**: Monitor memory usage and render performance
5. **Test Across Devices**: Ensure consistent behavior on different platforms
6. **Use Linting Tools**: ESLint and Prettier catch common issues
7. **Validate All Inputs**: Never trust user input, always validate
8. **Plan State Management**: Use appropriate tools (Context, Redux, Zustand)
9. **Consider Accessibility**: Design for all users from the start
10. **Monitor in Production**: Use error tracking and performance monitoring

## Conclusion

Building a Hi-Lo game seems simple, but robust implementation requires careful consideration of edge cases, performance, accessibility, and user experience. By anticipating these common problems and implementing the suggested solutions, you can create a more reliable and enjoyable game.

Remember to:
- Start with a minimal working version
- Add complexity gradually
- Test thoroughly at each step
- Consider the user experience at every decision point
- Keep the code maintainable and well-documented
