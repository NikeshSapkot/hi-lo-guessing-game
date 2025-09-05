import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Trophy, Target, TrendingUp, TrendingDown, CheckCircle, X, Zap, Brain, Activity } from 'lucide-react'
import { 
  AIStrategyEngine, 
  GameTheoryAnalyzer, 
  PerformanceAnalytics,
  dpUtils
} from '../lib/gameAlgorithms'
import AdvancedAnalytics from './AdvancedAnalytics'

const confettiVariants = {
  hidden: { opacity: 0, scale: 0, y: 0 },
  visible: (i) => ({
    opacity: 1,
    scale: [0, 1, 0],
    y: [-20, -100, -200],
    x: [(i - 2) * 30, (i - 2) * 50],
    rotate: [0, 360],
    transition: {
      duration: 2,
      ease: "easeOut",
      delay: i * 0.1
    }
  })
}

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function HiLoGame() {
  const [gameState, setGameState] = useState('waiting') // waiting, playing, won, quit
  const [targetNumber, setTargetNumber] = useState(null)
  const [currentGuess, setCurrentGuess] = useState('')
  const [guessCount, setGuessCount] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [guessHistory, setGuessHistory] = useState([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [lastGuessType, setLastGuessType] = useState('')
  
  // Advanced DSA and AI state
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [aiEngine] = useState(() => new AIStrategyEngine())
  const [gameTheoryAnalyzer] = useState(() => new GameTheoryAnalyzer())
  const [performanceAnalytics] = useState(() => new PerformanceAnalytics())
  const [aiRecommendations, setAiRecommendations] = useState([])
  const [currentRange, setCurrentRange] = useState({ low: 1, high: 100 })
  const [gameSessionStart, setGameSessionStart] = useState(null)
  const [showAIHints, setShowAIHints] = useState(false)
  const [difficultyMode, setDifficultyMode] = useState('normal') // easy, normal, hard, expert
  
  useEffect(() => {
    if (gameState === 'won') {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [gameState])
  
  // Initialize with some sample data for demo purposes
  useEffect(() => {
    // Add some initial sample data to show off the DSA features
    if (performanceAnalytics.getAnalytics().totalGames === 0) {
      // Sample data for demonstration
      const sampleGuesses = [50, 25, 37, 31, 34, 35];
      sampleGuesses.forEach((guess, index) => {
        performanceAnalytics.recordGuess(guess, 35, index + 1, 1000);
      });
      
      performanceAnalytics.recordSession({
        target: 35,
        attempts: 6,
        completed: true,
        timeElapsed: 6000,
        guesses: sampleGuesses
      });
      
      // Add more sample sessions
      performanceAnalytics.recordSession({
        target: 72,
        attempts: 4,
        completed: true,
        timeElapsed: 4500,
        guesses: [50, 75, 70, 72]
      });
    }
  }, []);

  // Advanced DSA functions with memoization
  const memoizedAIAnalysis = dpUtils.memoize((guesses, range) => {
    if (!guesses || guesses.length === 0) return [];
    
    const previousGuesses = guesses.map(g => ({
      guess: g.guess,
      feedback: g.guess < targetNumber ? 'low' : g.guess > targetNumber ? 'high' : 'correct'
    }));
    
    return [
      aiEngine.binarySearchStrategy(range.low, range.high, previousGuesses),
      aiEngine.monteCarloStrategy(range.low, range.high, previousGuesses, 1000),
      aiEngine.bayesianStrategy(range.low, range.high, previousGuesses),
      aiEngine.adaptivePatternStrategy(range.low, range.high, previousGuesses)
    ].sort((a, b) => b.confidence - a.confidence);
  });

  const updateAIRecommendations = () => {
    if (gameState === 'playing' && guessHistory.length > 0) {
      const recommendations = memoizedAIAnalysis(guessHistory, currentRange);
      setAiRecommendations(recommendations);
    }
  };

  const updateGameRange = (guess, isCorrect, isHigh) => {
    if (isCorrect) return;
    
    setCurrentRange(prev => {
      if (isHigh) {
        return { low: prev.low, high: guess - 1 };
      } else {
        return { low: guess + 1, high: prev.high };
      }
    });
  };

  // Dynamic difficulty adjustment using DP
  const getDynamicDifficulty = () => {
    const analytics = performanceAnalytics.getAnalytics();
    const efficiency = analytics.averageAttempts;
    
    if (efficiency <= 4) return { range: [1, 1000], name: 'Expert Mode' };
    if (efficiency <= 6) return { range: [1, 500], name: 'Hard Mode' };
    if (efficiency <= 8) return { range: [1, 200], name: 'Medium Mode' };
    return { range: [1, 100], name: 'Normal Mode' };
  };

  const startNewGame = () => {
    const difficulty = getDynamicDifficulty();
    const [min, max] = difficulty.range;
    const newTarget = Math.floor(Math.random() * (max - min + 1)) + min;
    
    setTargetNumber(newTarget);
    setGameState('playing');
    setCurrentGuess('');
    setGuessCount(0);
    setFeedback(`🎯 I'm thinking of a number between ${min} and ${max}. ${difficulty.name} activated!`);
    setGuessHistory([]);
    setShowConfetti(false);
    setLastGuessType('');
    setCurrentRange({ low: min, high: max });
    setGameSessionStart(Date.now());
    setAiRecommendations([]);
  };

  const makeGuess = () => {
    const guess = parseInt(currentGuess)
    const timeToGuess = gameSessionStart ? Date.now() - gameSessionStart : 0
    
    // Validate input
    if (isNaN(guess)) {
      setFeedback('🚫 Please enter a valid number!')
      setLastGuessType('error')
      return
    }

    // Check for quit condition
    if (guess === 0) {
      setGameState('quit')
      setFeedback(`You chose to quit! The number was ${targetNumber}.`)
      setLastGuessType('quit')
      
      // Record session data
      performanceAnalytics.recordSession({
        target: targetNumber,
        attempts: guessCount,
        completed: false,
        timeElapsed: timeToGuess,
        guesses: guessHistory.map(h => h.guess)
      })
      return
    }

    // Dynamic range validation based on current difficulty
    if (guess < currentRange.low || guess > currentRange.high) {
      setFeedback(`⚡ Please enter a number between ${currentRange.low} and ${currentRange.high} (or 0 to quit).`)
      setLastGuessType('error')
      return
    }

    const newCount = guessCount + 1
    const newHistory = [...guessHistory, { guess, count: newCount, timestamp: Date.now() }]
    setGuessCount(newCount)
    setGuessHistory(newHistory)
    
    // Record guess in BST and other data structures
    performanceAnalytics.recordGuess(guess, targetNumber, newCount, timeToGuess)

    // Check if guess is correct
    if (guess === targetNumber) {
      setGameState('won')
      setFeedback(`🎉 Incredible! You guessed ${targetNumber} correctly in ${newCount} ${newCount === 1 ? 'guess' : 'guesses'}!`)
      setLastGuessType('correct')
      
      // Record successful session
      performanceAnalytics.recordSession({
        target: targetNumber,
        attempts: newCount,
        completed: true,
        timeElapsed: timeToGuess,
        guesses: newHistory.map(h => h.guess)
      })
      
      // Get optimal strategy analysis
      const optimalStrategy = gameTheoryAnalyzer.getOptimalStrategy(currentRange.low, currentRange.high)
      console.log('Game Theory Analysis:', optimalStrategy)
      
    } else {
      const isHigh = guess > targetNumber
      const isLow = guess < targetNumber
      
      // Update game range using DSA principles
      updateGameRange(guess, false, isHigh)
      
      if (isLow) {
        setFeedback(`📈 Too low! Try a higher number. (Guess #${newCount}) | Range: ${guess + 1}-${currentRange.high}`)
        setLastGuessType('low')
      } else {
        setFeedback(`📉 Too high! Try a lower number. (Guess #${newCount}) | Range: ${currentRange.low}-${guess - 1}`)
        setLastGuessType('high')
      }
      
      // Update AI recommendations using advanced algorithms
      setTimeout(() => updateAIRecommendations(), 100)
    }

    setCurrentGuess('')
    setGameSessionStart(Date.now()) // Reset timer for next guess
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      makeGuess()
    }
  }

  const resetGame = () => {
    setGameState('waiting')
    setTargetNumber(null)
    setCurrentGuess('')
    setGuessCount(0)
    setFeedback('')
    setGuessHistory([])
    setShowConfetti(false)
    setLastGuessType('')
  }

  const getProgressBarWidth = () => {
    if (guessCount === 0) return 0
    return Math.min((guessCount / 15) * 100, 100) // Assuming 15 guesses as "par"
  }

  const getFeedbackGradient = () => {
    switch (lastGuessType) {
      case 'correct': return 'linear-gradient(135deg, #10b981, #34d399)'
      case 'high': return 'linear-gradient(135deg, #f87171, #fb7185)'
      case 'low': return 'linear-gradient(135deg, #60a5fa, #22d3ee)'
      case 'error': return 'linear-gradient(135deg, #fb923c, #f87171)'
      case 'quit': return 'linear-gradient(135deg, #9ca3af, #6b7280)'
      default: return 'linear-gradient(135deg, #a855f7, #ec4899)'
    }
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="text-center my-16"
      >
        <motion.h2
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="gradient-text mb-8"
          style={{ fontSize: '5rem', fontWeight: 900, lineHeight: '1.1' }}
        >
          Live Demo
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          viewport={{ once: true }}
          className="opacity-70 mb-8"
          style={{ fontSize: '2rem', maxWidth: '1000px', margin: '0 auto', fontWeight: 300 }}
        >
          Experience the Hi-Lo guessing game with next-generation UI/UX
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 opacity-50"
        >
          <Target size={24} />
          <span style={{ fontSize: '1.25rem', fontWeight: 500 }}>Interactive Prototype</span>
          <div style={{ width: '8px', height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '1.25rem', fontWeight: 500 }}>Real-time Feedback</span>
        </motion.div>
      </motion.div>

      <div className="flex justify-center">
        <div style={{ width: '100%', maxWidth: '768px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative group"
          >
            {/* Animated Background Glow */}
            <div 
              className="absolute" 
              style={{
                inset: '-6px',
                background: getFeedbackGradient(),
                borderRadius: '2rem',
                filter: 'blur(16px)',
                opacity: 0.25,
                transition: 'opacity 1s ease',
                zIndex: -1
              }}
            />
            
            {/* Main Game Card - Rectangular with 16:9 aspect ratio */}
            <div 
              className="glass relative overflow-hidden mx-auto"
              style={{
                borderRadius: '2rem',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                minHeight: '600px',
                aspectRatio: '16/9',
                width: '100%',
                maxWidth: '768px'
              }}
            >
              {/* Vibrant Top Accent Line */}
              <div 
                className="absolute" 
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)'
                }}
              />
              {/* Vibrant Side Accent Lines */}
              <div 
                className="absolute" 
                style={{
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '6px',
                  background: 'linear-gradient(180deg, #3b82f6, #7c3aed, #8b5cf6)'
                }}
              />
              <div 
                className="absolute" 
                style={{
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: '6px',
                  background: 'linear-gradient(180deg, #ec4899, #f43f5e, #ef4444)'
                }}
              />
              
              {/* Confetti Animation */}
              <AnimatePresence>
                {showConfetti && (
                  <div className="absolute" style={{ inset: 0, pointerEvents: 'none', zIndex: 10 }}>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        custom={i}
                        variants={confettiVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute"
                        style={{ top: '50%', left: '50%' }}
                      >
                        <div 
                          style={{
                            width: '16px',
                            height: '16px',
                            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                            borderRadius: '50%'
                          }} 
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {/* Header */}
              <motion.div
                className="p-8 text-center" 
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
                variants={pulseVariants}
                animate={gameState === 'won' ? 'pulse' : ''}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  className="gradient-purple flex items-center justify-center mx-auto mb-6"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '1.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  <AnimatePresence mode="wait">
                    {gameState === 'won' ? (
                      <motion.div
                        key="trophy"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                      >
                        <Trophy size={40} color="white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="target"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Target size={40} color="white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>Hi-Lo Challenge</h3>
                
                {/* Progress Bar */}
                {gameState === 'playing' && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="mb-4 overflow-hidden"
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '50px',
                      height: '8px'
                    }}
                  >
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${getProgressBarWidth()}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #a855f7, #22d3ee)',
                        borderRadius: '50px'
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>

              {/* Game Content */}
              <div className="p-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Feedback Display */}
                <motion.div
                  key={feedback}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div 
                    className="glass p-6" 
                    style={{
                      borderRadius: '1rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: `linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(34, 211, 238, 0.2))`
                    }}
                  >
                    <motion.div
                      className="flex items-center justify-center gap-2 mb-2"
                      animate={{ scale: lastGuessType === 'correct' ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {lastGuessType === 'high' && <TrendingDown size={20} style={{ color: '#fca5a5' }} />}
                      {lastGuessType === 'low' && <TrendingUp size={20} style={{ color: '#93c5fd' }} />}
                      {lastGuessType === 'correct' && <CheckCircle size={20} style={{ color: '#86efac' }} />}
                      {lastGuessType === 'error' && <X size={20} style={{ color: '#fca5a5' }} />}
                      {lastGuessType === 'quit' && <X size={20} style={{ color: '#d1d5db' }} />}
                    </motion.div>
                    <p style={{ fontSize: '1.125rem', fontWeight: 500, color: 'white', lineHeight: '1.75' }}>
                      {feedback || 'Ready to start your guessing adventure?'}
                    </p>
                    {gameState === 'playing' && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.75rem' }}
                      >
                        Attempts: {guessCount} • Enter 0 to quit
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                {/* Game Input */}
                <AnimatePresence>
                  {gameState === 'playing' && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.5 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}
                    >
                      <motion.input
                        whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(168, 85, 247, 0.3)' }}
                        type="number"
                        placeholder="Enter your guess (1-100)"
                        value={currentGuess}
                        onChange={(e) => setCurrentGuess(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="input-modern"
                        style={{
                          width: '100%',
                          maxWidth: '400px',
                          padding: '1.5rem 2rem',
                          textAlign: 'center',
                          fontSize: '1.75rem',
                          fontWeight: 700,
                          color: 'white',
                          background: 'rgba(255, 255, 255, 0.15)',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '1.5rem',
                          backdropFilter: 'blur(12px)',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                        }}
                        min="0"
                        max="100"
                      />
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={makeGuess}
                        disabled={!currentGuess}
                        className="btn-gradient flex items-center gap-3"
                        style={{
                          padding: '1.25rem 3rem',
                          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1.25rem',
                          borderRadius: '1.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                          opacity: currentGuess ? 1 : 0.5,
                          transition: 'all 0.3s ease',
                          minWidth: '200px'
                        }}
                      >
                        <Zap size={24} />
                        <span>Make Guess</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Guess History */}
                <AnimatePresence>
                  {guessHistory.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass p-6"
                      style={{
                        borderRadius: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <h4 className="flex items-center gap-2 mb-4" style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                        <Target size={16} />
                        Your Guessing Journey
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {guessHistory.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            className="glass"
                            style={{
                              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(34, 211, 238, 0.2))',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              padding: '0.5rem 1rem',
                              borderRadius: '50px',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            #{item.count}: {item.guess}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Game Stats */}
                <AnimatePresence>
                  {(gameState === 'won' || gameState === 'quit') && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      className="glass p-6"
                      style={{
                        borderRadius: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div className="grid grid-cols-2 gap-6 text-center">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                        >
                          <p className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{targetNumber}</p>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>Target Number</p>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                        >
                          <p className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{guessCount}</p>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>Total Attempts</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Recommendations Display */}
                <AnimatePresence>
                  {gameState === 'playing' && aiRecommendations.length > 0 && showAIHints && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      className="glass p-6"
                      style={{
                        borderRadius: '1rem',
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                        background: 'rgba(34, 211, 238, 0.1)'
                      }}
                    >
                      <h4 className="flex items-center gap-2 mb-4" style={{ fontWeight: 600, color: 'rgba(34, 211, 238, 1)' }}>
                        <Brain size={16} />
                        AI Strategy Recommendations
                      </h4>
                      <div className="space-y-3">
                        {aiRecommendations.slice(0, 3).map((rec, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg"
                            style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          >
                            <div>
                              <span className="text-white font-semibold capitalize">
                                {rec.name?.replace(/([A-Z])/g, ' $1').trim()}: 
                              </span>
                              <span className="text-cyan-300 text-lg font-bold">{rec.guess}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-white/60">Confidence</div>
                              <div className="text-sm font-semibold text-cyan-400">
                                {(rec.confidence * 100).toFixed(0)}%
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  <AnimatePresence mode="wait">
                    {gameState === 'waiting' && (
                      <motion.div
                        key="start-actions"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex gap-4"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={startNewGame}
                          className="btn-success flex items-center gap-2"
                          style={{
                            padding: '1rem 2rem',
                            background: 'linear-gradient(135deg, #10b981, #34d399)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '1rem',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <Play size={20} />
                          <span>Start Adventure</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowAnalytics(!showAnalytics)}
                          className="glass flex items-center gap-2"
                          style={{
                            padding: '1rem 2rem',
                            background: 'rgba(168, 85, 247, 0.2)',
                            border: '1px solid rgba(168, 85, 247, 0.4)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <Activity size={20} />
                          <span>DSA Analytics</span>
                        </motion.button>
                      </motion.div>
                    )}

                    {(gameState === 'won' || gameState === 'quit') && (
                      <motion.div
                        key="end-actions"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex gap-4"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={startNewGame}
                          className="btn-success flex items-center gap-2"
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #10b981, #34d399)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '1rem',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <Play size={16} />
                          <span>Play Again</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={resetGame}
                          className="glass flex items-center gap-2"
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <RotateCcw size={16} />
                          <span>Reset</span>
                        </motion.button>
                      </motion.div>
                    )}

                    {gameState === 'playing' && (
                      <motion.div
                        key="playing-actions"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex gap-3"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowAIHints(!showAIHints)}
                          className="glass flex items-center gap-2"
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: showAIHints 
                              ? 'linear-gradient(135deg, #22d3ee, #06b6d4)'
                              : 'rgba(34, 211, 238, 0.2)',
                            border: '1px solid rgba(34, 211, 238, 0.4)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <Brain size={16} />
                          <span>AI Hints</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setGameState('quit')
                            setFeedback(`Game ended! The number was ${targetNumber}.`)
                            setLastGuessType('quit')
                          }}
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #ef4444, #f43f5e)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '1rem',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <X size={16} />
                          <span>Quit</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Advanced DSA Analytics Dashboard */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-16"
          >
            <AdvancedAnalytics
              gameHistory={guessHistory}
              currentGuess={currentGuess}
              analytics={{
                bstData: performanceAnalytics.bst.inorderTraversal(),
                range: currentRange,
                gameState
              }}
              aiRecommendations={aiRecommendations}
              patternAnalysis={{
                patterns: guessHistory.length > 1 ? aiEngine.analyzeGuessPatterns(guessHistory) : null,
                difficulty: getDynamicDifficulty()
              }}
              performanceMetrics={performanceAnalytics.getAnalytics()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
