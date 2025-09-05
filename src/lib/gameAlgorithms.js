// Advanced Data Structures and Algorithms for Hi-Lo Game

/**
 * Binary Search Tree for tracking game statistics and patterns
 */
class BST {
  constructor() {
    this.root = null;
  }

  insert(value, metadata = {}) {
    this.root = this.insertRec(this.root, value, metadata);
  }

  insertRec(root, value, metadata) {
    if (root === null) {
      return { value, metadata, left: null, right: null, frequency: 1 };
    }

    if (value === root.value) {
      root.frequency++;
      root.metadata = { ...root.metadata, ...metadata };
    } else if (value < root.value) {
      root.left = this.insertRec(root.left, value, metadata);
    } else {
      root.right = this.insertRec(root.right, value, metadata);
    }

    return root;
  }

  inorderTraversal() {
    const result = [];
    this.inorderRec(this.root, result);
    return result;
  }

  inorderRec(root, result) {
    if (root !== null) {
      this.inorderRec(root.left, result);
      result.push({ value: root.value, frequency: root.frequency, metadata: root.metadata });
      this.inorderRec(root.right, result);
    }
  }

  findMostFrequent() {
    let max = 0;
    let mostFrequent = null;
    this.findMostFrequentRec(this.root, (node) => {
      if (node.frequency > max) {
        max = node.frequency;
        mostFrequent = node;
      }
    });
    return mostFrequent;
  }

  findMostFrequentRec(root, callback) {
    if (root !== null) {
      callback(root);
      this.findMostFrequentRec(root.left, callback);
      this.findMostFrequentRec(root.right, callback);
    }
  }
}

/**
 * Min-Max Heap for tracking best and worst performances
 */
class MinMaxHeap {
  constructor() {
    this.minHeap = [];
    this.maxHeap = [];
  }

  insertMinHeap(value) {
    this.minHeap.push(value);
    this.heapifyUpMin(this.minHeap.length - 1);
  }

  insertMaxHeap(value) {
    this.maxHeap.push(value);
    this.heapifyUpMax(this.maxHeap.length - 1);
  }

  heapifyUpMin(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.minHeap[index] >= this.minHeap[parentIndex]) break;
      [this.minHeap[index], this.minHeap[parentIndex]] = [this.minHeap[parentIndex], this.minHeap[index]];
      index = parentIndex;
    }
  }

  heapifyUpMax(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.maxHeap[index] <= this.maxHeap[parentIndex]) break;
      [this.maxHeap[index], this.maxHeap[parentIndex]] = [this.maxHeap[parentIndex], this.maxHeap[index]];
      index = parentIndex;
    }
  }

  getMin() {
    return this.minHeap[0];
  }

  getMax() {
    return this.maxHeap[0];
  }
}

/**
 * Trie for pattern recognition in guess sequences
 */
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfPattern = false;
    this.frequency = 0;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(pattern) {
    let current = this.root;
    for (let char of pattern) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    current.isEndOfPattern = true;
    current.frequency++;
  }

  searchPattern(pattern) {
    let current = this.root;
    for (let char of pattern) {
      if (!current.children[char]) {
        return null;
      }
      current = current.children[char];
    }
    return current;
  }

  getAllPatterns() {
    const patterns = [];
    this.dfs(this.root, '', patterns);
    return patterns;
  }

  dfs(node, pattern, patterns) {
    if (node.isEndOfPattern) {
      patterns.push({ pattern, frequency: node.frequency });
    }
    for (let char in node.children) {
      this.dfs(node.children[char], pattern + char, patterns);
    }
  }
}

/**
 * AI Strategy Engine using various algorithms
 */
class AIStrategyEngine {
  constructor() {
    this.strategies = {
      binarySearch: this.binarySearchStrategy.bind(this),
      monteCarlo: this.monteCarloStrategy.bind(this),
      bayesian: this.bayesianStrategy.bind(this),
      adaptivePattern: this.adaptivePatternStrategy.bind(this)
    };
    this.gameHistory = [];
    this.probabilityDistribution = new Array(101).fill(1/100);
  }

  // Binary Search Strategy - Optimal for unknown target
  binarySearchStrategy(low, high, previousGuesses = []) {
    if (low > high) return Math.floor((low + high) / 2);
    
    const mid = Math.floor((low + high) / 2);
    const confidence = this.calculateConfidence('binarySearch', previousGuesses);
    
    return {
      guess: mid,
      confidence,
      reasoning: `Binary search suggests ${mid} (optimal divide-and-conquer approach)`,
      strategy: 'binarySearch'
    };
  }

  // Monte Carlo Strategy - Statistical simulation approach
  monteCarloStrategy(low, high, previousGuesses = [], iterations = 10000) {
    const outcomes = {};
    
    for (let i = 0; i < iterations; i++) {
      const target = Math.floor(Math.random() * (high - low + 1)) + low;
      const guessesNeeded = this.simulateGame(target, low, high, previousGuesses);
      
      for (let guess = low; guess <= high; guess++) {
        if (!outcomes[guess]) outcomes[guess] = [];
        outcomes[guess].push(guessesNeeded);
      }
    }

    let bestGuess = low;
    let bestAverageGuesses = Infinity;

    for (let guess in outcomes) {
      const avgGuesses = outcomes[guess].reduce((a, b) => a + b, 0) / outcomes[guess].length;
      if (avgGuesses < bestAverageGuesses) {
        bestAverageGuesses = avgGuesses;
        bestGuess = parseInt(guess);
      }
    }

    return {
      guess: bestGuess,
      confidence: this.calculateConfidence('monteCarlo', previousGuesses),
      reasoning: `Monte Carlo simulation (${iterations} iterations) suggests ${bestGuess}`,
      strategy: 'monteCarlo',
      expectedGuesses: bestAverageGuesses.toFixed(2)
    };
  }

  // Bayesian Inference Strategy - Learning from previous games
  bayesianStrategy(low, high, previousGuesses = []) {
    // Update probability distribution based on previous guesses
    previousGuesses.forEach(({ guess, feedback }) => {
      this.updateProbabilityDistribution(guess, feedback, low, high);
    });

    // Find the guess with highest probability
    let maxProb = 0;
    let bestGuess = Math.floor((low + high) / 2);

    for (let i = low; i <= high; i++) {
      if (this.probabilityDistribution[i] > maxProb) {
        maxProb = this.probabilityDistribution[i];
        bestGuess = i;
      }
    }

    return {
      guess: bestGuess,
      confidence: maxProb,
      reasoning: `Bayesian inference suggests ${bestGuess} (probability: ${(maxProb * 100).toFixed(1)}%)`,
      strategy: 'bayesian',
      probabilityDistribution: [...this.probabilityDistribution]
    };
  }

  // Adaptive Pattern Strategy - Learning from user behavior
  adaptivePatternStrategy(low, high, previousGuesses = []) {
    if (previousGuesses.length === 0) {
      return this.binarySearchStrategy(low, high);
    }

    // Analyze patterns in user's guessing behavior
    const patterns = this.analyzeGuessPatterns(previousGuesses);
    const predictedRange = this.predictUserRange(patterns, low, high);
    
    // Use pattern analysis to make educated guess
    const strategicGuess = this.calculateStrategicGuess(predictedRange, previousGuesses);

    return {
      guess: strategicGuess,
      confidence: this.calculatePatternConfidence(patterns),
      reasoning: `Adaptive pattern analysis suggests ${strategicGuess}`,
      strategy: 'adaptivePattern',
      detectedPatterns: patterns
    };
  }

  // Helper Methods
  simulateGame(target, low, high, previousGuesses) {
    let currentLow = low;
    let currentHigh = high;
    let guesses = 0;

    while (currentLow <= currentHigh) {
      guesses++;
      const mid = Math.floor((currentLow + currentHigh) / 2);
      
      if (mid === target) break;
      else if (mid < target) currentLow = mid + 1;
      else currentHigh = mid - 1;
    }

    return guesses;
  }

  updateProbabilityDistribution(guess, feedback, low, high) {
    // Zero out impossible values based on feedback
    if (feedback === 'low') {
      for (let i = low; i <= guess; i++) {
        this.probabilityDistribution[i] = 0;
      }
    } else if (feedback === 'high') {
      for (let i = guess; i <= high; i++) {
        this.probabilityDistribution[i] = 0;
      }
    }

    // Normalize the distribution
    const sum = this.probabilityDistribution.reduce((a, b) => a + b, 0);
    if (sum > 0) {
      this.probabilityDistribution = this.probabilityDistribution.map(p => p / sum);
    }
  }

  analyzeGuessPatterns(guesses) {
    const patterns = {
      averageJump: 0,
      trendDirection: 'none',
      volatility: 0,
      preferredRanges: {}
    };

    if (guesses.length < 2) return patterns;

    // Calculate average jump size
    let totalJump = 0;
    for (let i = 1; i < guesses.length; i++) {
      totalJump += Math.abs(guesses[i].guess - guesses[i-1].guess);
    }
    patterns.averageJump = totalJump / (guesses.length - 1);

    // Determine trend direction
    const firstHalf = guesses.slice(0, Math.floor(guesses.length / 2));
    const secondHalf = guesses.slice(Math.floor(guesses.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, g) => sum + g.guess, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, g) => sum + g.guess, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg + 5) patterns.trendDirection = 'increasing';
    else if (secondAvg < firstAvg - 5) patterns.trendDirection = 'decreasing';

    // Calculate volatility (standard deviation)
    const mean = guesses.reduce((sum, g) => sum + g.guess, 0) / guesses.length;
    const variance = guesses.reduce((sum, g) => sum + Math.pow(g.guess - mean, 2), 0) / guesses.length;
    patterns.volatility = Math.sqrt(variance);

    return patterns;
  }

  predictUserRange(patterns, low, high) {
    // Predict where user might focus next based on patterns
    const range = high - low;
    const centerBias = 0.1; // Slight bias towards center
    
    return {
      low: low + Math.floor(range * centerBias),
      high: high - Math.floor(range * centerBias),
      confidence: Math.min(patterns.volatility / 10, 1.0)
    };
  }

  calculateStrategicGuess(predictedRange, previousGuesses) {
    // Combine binary search with pattern prediction
    const binaryGuess = Math.floor((predictedRange.low + predictedRange.high) / 2);
    
    // Add some randomness based on user patterns
    const randomAdjustment = (Math.random() - 0.5) * 10;
    
    return Math.max(predictedRange.low, 
           Math.min(predictedRange.high, 
           Math.floor(binaryGuess + randomAdjustment)));
  }

  calculateConfidence(strategy, previousGuesses) {
    const baseConfidence = {
      binarySearch: 0.9,
      monteCarlo: 0.85,
      bayesian: 0.8,
      adaptivePattern: 0.7
    };

    // Adjust confidence based on number of previous guesses
    const experienceBonus = Math.min(previousGuesses.length * 0.02, 0.1);
    
    return Math.min(baseConfidence[strategy] + experienceBonus, 1.0);
  }

  calculatePatternConfidence(patterns) {
    // Higher confidence if patterns are more stable
    const volatilityPenalty = Math.min(patterns.volatility / 50, 0.3);
    return Math.max(0.5, 0.9 - volatilityPenalty);
  }

  getBestStrategy(low, high, previousGuesses = []) {
    const strategies = [];
    
    // Get recommendations from all strategies
    for (let strategyName in this.strategies) {
      try {
        const result = this.strategies[strategyName](low, high, previousGuesses);
        strategies.push({ name: strategyName, ...result });
      } catch (error) {
        console.error(`Error in ${strategyName}:`, error);
      }
    }

    // Return the strategy with highest confidence
    return strategies.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
  }
}

/**
 * Game Theory Analyzer
 */
class GameTheoryAnalyzer {
  constructor() {
    this.gameTree = {};
    this.memo = new Map();
  }

  // Minimax algorithm for optimal play analysis
  minimax(low, high, depth, isMaximizing, target = null) {
    const key = `${low}-${high}-${depth}-${isMaximizing}`;
    if (this.memo.has(key)) {
      return this.memo.get(key);
    }

    if (low === high) {
      const result = { score: depth, guess: low };
      this.memo.set(key, result);
      return result;
    }

    if (depth > 10) { // Prevent infinite recursion
      const result = { score: depth, guess: Math.floor((low + high) / 2) };
      this.memo.set(key, result);
      return result;
    }

    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestGuess = Math.floor((low + high) / 2);

    // Try different guess strategies
    const candidates = [
      Math.floor((low + high) / 2), // Binary search
      low + Math.floor((high - low) / 3), // Lower third
      high - Math.floor((high - low) / 3), // Upper third
    ];

    for (let guess of candidates) {
      if (guess < low || guess > high) continue;

      // Simulate both possible outcomes
      const lowResult = this.minimax(low, guess - 1, depth + 1, !isMaximizing, target);
      const highResult = this.minimax(guess + 1, high, depth + 1, !isMaximizing, target);
      
      const avgScore = (lowResult.score + highResult.score) / 2;

      if (isMaximizing && avgScore > bestScore) {
        bestScore = avgScore;
        bestGuess = guess;
      } else if (!isMaximizing && avgScore < bestScore) {
        bestScore = avgScore;
        bestGuess = guess;
      }
    }

    const result = { score: bestScore, guess: bestGuess };
    this.memo.set(key, result);
    return result;
  }

  getOptimalStrategy(low, high) {
    this.memo.clear(); // Clear memoization for fresh calculation
    const result = this.minimax(low, high, 0, false);
    
    return {
      optimalGuess: result.guess,
      expectedMoves: result.score,
      strategy: 'minimax',
      reasoning: `Minimax analysis suggests ${result.guess} for optimal play`
    };
  }
}

/**
 * Advanced Performance Analytics
 */
class PerformanceAnalytics {
  constructor() {
    this.bst = new BST();
    this.heap = new MinMaxHeap();
    this.trie = new Trie();
    this.sessions = [];
  }

  recordGuess(guess, target, attempts, timeToGuess) {
    // Add to BST for frequency analysis
    this.bst.insert(guess, { target, attempts, timeToGuess, timestamp: Date.now() });
    
    // Add to heap for best/worst performance tracking
    this.heap.insertMinHeap(attempts);
    this.heap.insertMaxHeap(attempts);
    
    // Add pattern to trie
    this.trie.insert(guess.toString());
  }

  recordSession(sessionData) {
    this.sessions.push({
      ...sessionData,
      timestamp: Date.now(),
      efficiency: this.calculateEfficiency(sessionData.attempts, sessionData.target)
    });
  }

  calculateEfficiency(attempts, target) {
    const optimalAttempts = Math.ceil(Math.log2(100)); // Theoretical minimum for 1-100
    return Math.max(0, (optimalAttempts / attempts) * 100);
  }

  getAnalytics() {
    return {
      totalGames: this.sessions.length,
      averageAttempts: this.sessions.reduce((sum, s) => sum + s.attempts, 0) / this.sessions.length || 0,
      bestPerformance: this.heap.getMin() || 0,
      worstPerformance: this.heap.getMax() || 0,
      mostFrequentGuess: this.bst.findMostFrequent(),
      commonPatterns: this.trie.getAllPatterns().slice(0, 5),
      efficiencyTrend: this.calculateEfficiencyTrend(),
      skillLevel: this.calculateSkillLevel()
    };
  }

  calculateEfficiencyTrend() {
    if (this.sessions.length < 2) return 'insufficient_data';
    
    const recent = this.sessions.slice(-5);
    const older = this.sessions.slice(-10, -5);
    
    if (older.length === 0) return 'improving';
    
    const recentAvg = recent.reduce((sum, s) => sum + s.efficiency, 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + s.efficiency, 0) / older.length;
    
    if (recentAvg > olderAvg + 5) return 'improving';
    if (recentAvg < olderAvg - 5) return 'declining';
    return 'stable';
  }

  calculateSkillLevel() {
    const analytics = this.getAnalytics();
    const avgAttempts = analytics.averageAttempts;
    
    if (avgAttempts <= 4) return 'expert';
    if (avgAttempts <= 6) return 'advanced';
    if (avgAttempts <= 8) return 'intermediate';
    if (avgAttempts <= 12) return 'beginner';
    return 'novice';
  }
}

// Export all classes and utilities
export {
  BST,
  MinMaxHeap,
  Trie,
  AIStrategyEngine,
  GameTheoryAnalyzer,
  PerformanceAnalytics
};

// Utility functions for dynamic programming and optimization
export const dpUtils = {
  // Memoization decorator
  memoize: (fn) => {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  },

  // LCS for finding common patterns
  longestCommonSubsequence: (seq1, seq2) => {
    const dp = Array(seq1.length + 1).fill().map(() => Array(seq2.length + 1).fill(0));
    
    for (let i = 1; i <= seq1.length; i++) {
      for (let j = 1; j <= seq2.length; j++) {
        if (seq1[i-1] === seq2[j-1]) {
          dp[i][j] = dp[i-1][j-1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
      }
    }
    
    return dp[seq1.length][seq2.length];
  },

  // Knapsack for resource optimization
  knapsack: (capacity, weights, values) => {
    const n = weights.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= capacity; w++) {
        if (weights[i-1] <= w) {
          dp[i][w] = Math.max(
            values[i-1] + dp[i-1][w - weights[i-1]],
            dp[i-1][w]
          );
        } else {
          dp[i][w] = dp[i-1][w];
        }
      }
    }
    
    return dp[n][capacity];
  }
};
