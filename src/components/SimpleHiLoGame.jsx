import { useState, useEffect } from 'react'
import { Play, RotateCcw, Trophy, Target, Activity, Brain, BarChart3 } from 'lucide-react'
import { 
  AIStrategyEngine, 
  GameTheoryAnalyzer, 
  PerformanceAnalytics
} from '../lib/gameAlgorithms'

export default function SimpleHiLoGame() {
  const [gameState, setGameState] = useState('waiting') // waiting, playing, won, quit
  const [targetNumber, setTargetNumber] = useState(null)
  const [currentGuess, setCurrentGuess] = useState('')
  const [guessCount, setGuessCount] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [guessHistory, setGuessHistory] = useState([])
  
  // DSA Analytics State
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [performanceAnalytics] = useState(() => new PerformanceAnalytics())
  const [aiEngine] = useState(() => new AIStrategyEngine())
  const [gameTheoryAnalyzer] = useState(() => new GameTheoryAnalyzer())
  const [gameStartTime, setGameStartTime] = useState(null)
  const [currentGameAnalytics, setCurrentGameAnalytics] = useState(null)

  const startNewGame = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1
    setTargetNumber(newTarget)
    setGameState('playing')
    setCurrentGuess('')
    setGuessCount(0)
    setFeedback('I\'m thinking of a number between 1 and 100!')
    setGuessHistory([])
    setGameStartTime(Date.now())
    
    // Initialize analytics for new game
    setCurrentGameAnalytics({
      gameId: Date.now(),
      startTime: Date.now(),
      target: newTarget,
      guesses: [],
      dsaOperations: {
        bstInsertions: 0,
        heapOperations: 0,
        trieSearches: 0,
        algorithmCalls: 0
      },
      timeComplexity: [],
      spaceComplexity: []
    })
  }

  const makeGuess = () => {
    const guess = parseInt(currentGuess)
    const operationStartTime = performance.now()
    
    // Validate input
    if (isNaN(guess)) {
      setFeedback('Please enter a valid number!')
      return
    }

    // Check for quit condition
    if (guess === 0) {
      setGameState('quit')
      setFeedback(`You chose to quit! The number was ${targetNumber}.`)
      if (currentGameAnalytics) {
        finalizeGameAnalytics(false, Date.now() - currentGameAnalytics.startTime)
      }
      return
    }

    // Range validation
    if (guess < 1 || guess > 100) {
      setFeedback('Please enter a number between 1 and 100 (or 0 to quit).')
      return
    }

    const newCount = guessCount + 1
    const newHistory = [...guessHistory, { guess, count: newCount, timestamp: Date.now() }]
    setGuessCount(newCount)
    setGuessHistory(newHistory)

    // DSA Operations Tracking
    if (currentGameAnalytics) {
      // Track BST insertion - O(log n) time, O(1) space for each insertion
      const bstStartTime = performance.now()
      performanceAnalytics.recordGuess(guess, targetNumber, newCount, Date.now() - gameStartTime)
      const bstEndTime = performance.now()
      
      // Track AI algorithm calls - O(log n) for binary search, O(n) for others
      const aiStartTime = performance.now()
      const previousGuesses = newHistory.slice(0, -1).map(h => ({
        guess: h.guess,
        feedback: h.guess < targetNumber ? 'low' : h.guess > targetNumber ? 'high' : 'correct'
      }))
      const aiRecommendation = aiEngine.binarySearchStrategy(1, 100, previousGuesses)
      const aiEndTime = performance.now()
      
      // Update analytics
      const updatedAnalytics = {
        ...currentGameAnalytics,
        guesses: [...currentGameAnalytics.guesses, {
          guess,
          timestamp: Date.now(),
          attempt: newCount,
          correct: guess === targetNumber
        }],
        dsaOperations: {
          ...currentGameAnalytics.dsaOperations,
          bstInsertions: currentGameAnalytics.dsaOperations.bstInsertions + 1,
          algorithmCalls: currentGameAnalytics.dsaOperations.algorithmCalls + 1
        },
        timeComplexity: [
          ...currentGameAnalytics.timeComplexity,
          {
            operation: 'BST_INSERT',
            complexity: 'O(log n)',
            actualTime: bstEndTime - bstStartTime,
            dataSize: newCount
          },
          {
            operation: 'AI_BINARY_SEARCH',
            complexity: 'O(log n)',
            actualTime: aiEndTime - aiStartTime,
            dataSize: 100 // search space
          }
        ],
        spaceComplexity: [
          ...currentGameAnalytics.spaceComplexity,
          {
            operation: 'GUESS_STORAGE',
            complexity: 'O(n)',
            actualSpace: newCount * 32, // approximate bytes per guess
            dataSize: newCount
          }
        ]
      }
      setCurrentGameAnalytics(updatedAnalytics)
    }

    // Check if guess is correct
    if (guess === targetNumber) {
      setGameState('won')
      setFeedback(`🎉 Congratulations! You guessed ${targetNumber} correctly in ${newCount} ${newCount === 1 ? 'guess' : 'guesses'}!`)
      if (currentGameAnalytics) {
        finalizeGameAnalytics(true, Date.now() - currentGameAnalytics.startTime)
      }
    } else if (guess < targetNumber) {
      setFeedback(`📈 Too low! Try a higher number. (Guess #${newCount})`)
    } else {
      setFeedback(`📉 Too high! Try a lower number. (Guess #${newCount})`)
    }

    setCurrentGuess('')
  }

  const finalizeGameAnalytics = (won, totalTime) => {
    if (currentGameAnalytics) {
      const finalAnalytics = {
        ...currentGameAnalytics,
        endTime: Date.now(),
        totalTime,
        won,
        efficiency: won ? Math.max(1, Math.ceil(Math.log2(100)) - guessCount) : 0
      }
      
      // Store in performance analytics
      performanceAnalytics.recordSession({
        target: targetNumber,
        attempts: guessCount,
        completed: won,
        timeElapsed: totalTime,
        guesses: guessHistory.map(h => h.guess),
        analytics: finalAnalytics
      })
    }
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
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <div className="glass relative overflow-hidden mx-auto" style={{
        borderRadius: '2rem',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        minHeight: '500px',
        padding: '2rem'
      }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-purple flex items-center justify-center mx-auto mb-4" style={{
            borderRadius: '1rem',
            boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
          }}>
            {gameState === 'won' ? <Trophy size={32} color="white" /> : <Target size={32} color="white" />}
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
            Hi-Lo Challenge
          </h3>
        </div>

        {/* Feedback Display */}
        <div className="text-center mb-6">
          <div className="glass p-4" style={{
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(168, 85, 247, 0.2)'
          }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 500, color: 'white', lineHeight: '1.75' }}>
              {feedback || 'Ready to start your guessing adventure?'}
            </p>
            {gameState === 'playing' && (
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.75rem' }}>
                Attempts: {guessCount} • Enter 0 to quit
              </p>
            )}
          </div>
        </div>

        {/* Game Input */}
        {gameState === 'playing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
            <input
              type="number"
              placeholder="Enter your guess (1-100)"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '1rem 1.5rem',
                textAlign: 'center',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'white',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '1rem',
                outline: 'none'
              }}
              min="0"
              max="100"
            />
            <button
              onClick={makeGuess}
              disabled={!currentGuess}
              style={{
                padding: '1rem 2rem',
                background: currentGuess ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '1rem',
                border: 'none',
                cursor: currentGuess ? 'pointer' : 'not-allowed',
                minWidth: '150px'
              }}
            >
              Make Guess
            </button>
          </div>
        )}

        {/* Guess History */}
        {guessHistory.length > 0 && (
          <div className="glass p-4 mb-6" style={{
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h4 style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
              Your Guesses:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {guessHistory.map((item, index) => (
                <div
                  key={index}
                  className="glass"
                  style={{
                    background: 'rgba(168, 85, 247, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  #{item.count}: {item.guess}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Stats */}
        {(gameState === 'won' || gameState === 'quit') && (
          <div className="glass p-4 mb-6" style={{
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'center' }}>
              <div>
                <p className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{targetNumber}</p>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>Target Number</p>
              </div>
              <div>
                <p className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{guessCount}</p>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>Total Attempts</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {gameState === 'waiting' && (
            <>
              <button
                onClick={startNewGame}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Play size={20} />
                <span>Start Game</span>
              </button>
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                style={{
                  padding: '1rem 2rem',
                  background: showAnalytics ? 'linear-gradient(135deg, #22d3ee, #06b6d4)' : 'rgba(34, 211, 238, 0.2)',
                  border: '1px solid rgba(34, 211, 238, 0.4)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Activity size={20} />
                <span>DSA Analytics</span>
              </button>
            </>
          )}

          {(gameState === 'won' || gameState === 'quit') && (
            <>
              <button
                onClick={startNewGame}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Play size={16} />
                <span>Play Again</span>
              </button>
              <button
                onClick={resetGame}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* DSA Analytics Dashboard */}
      {showAnalytics && (
        <div className="glass p-8 mt-8" style={{
          borderRadius: '2rem',
          border: '2px solid rgba(34, 211, 238, 0.3)',
          background: 'rgba(34, 211, 238, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4" style={{
              borderRadius: '1rem',
              background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
              boxShadow: '0 20px 40px rgba(34, 211, 238, 0.3)'
            }}>
              <BarChart3 size={32} color="white" />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
              DSA Time & Space Complexity Analytics
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
              Real-time analysis of Data Structures and Algorithms performance
            </p>
          </div>

          {/* Current Game Analytics */}
          {currentGameAnalytics && (
            <div className="mb-8">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Brain size={20} />
                Current Game DSA Metrics
              </h4>
              
              {/* Operations Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="glass p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-cyan-300">
                    {currentGameAnalytics.dsaOperations.bstInsertions}
                  </div>
                  <div className="text-sm text-white/60">BST Insertions</div>
                  <div className="text-xs text-cyan-400">O(log n)</div>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-300">
                    {currentGameAnalytics.dsaOperations.algorithmCalls}
                  </div>
                  <div className="text-sm text-white/60">AI Algorithm Calls</div>
                  <div className="text-xs text-purple-400">O(log n)</div>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-300">
                    {currentGameAnalytics.guesses.length * 32}B
                  </div>
                  <div className="text-sm text-white/60">Memory Usage</div>
                  <div className="text-xs text-green-400">O(n)</div>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-yellow-300">
                    {currentGameAnalytics.timeComplexity.length}
                  </div>
                  <div className="text-sm text-white/60">Total Operations</div>
                  <div className="text-xs text-yellow-400">Tracked</div>
                </div>
              </div>

              {/* Time Complexity Analysis */}
              {currentGameAnalytics.timeComplexity.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Activity size={16} />
                    Time Complexity Analysis
                  </h5>
                  <div className="space-y-3">
                    {currentGameAnalytics.timeComplexity.slice(-5).map((op, index) => (
                      <div key={index} className="glass p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-white">
                            {op.operation.replace(/_/g, ' ')}
                          </span>
                          <span className="text-cyan-400 font-mono text-sm">
                            {op.complexity}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/60">
                            Data Size: {op.dataSize}
                          </span>
                          <span className="text-white/60">
                            Actual Time: {op.actualTime.toFixed(4)}ms
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Space Complexity Analysis */}
              {currentGameAnalytics.spaceComplexity.length > 0 && (
                <div>
                  <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 size={16} />
                    Space Complexity Analysis
                  </h5>
                  <div className="space-y-3">
                    {currentGameAnalytics.spaceComplexity.slice(-3).map((op, index) => (
                      <div key={index} className="glass p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-white">
                            {op.operation.replace(/_/g, ' ')}
                          </span>
                          <span className="text-purple-400 font-mono text-sm">
                            {op.complexity}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/60">
                            Data Elements: {op.dataSize}
                          </span>
                          <span className="text-white/60">
                            Estimated Space: {op.actualSpace} bytes
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Historical Performance Analytics */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Target size={20} />
              Historical DSA Performance
            </h4>
            
            {(() => {
              const analytics = performanceAnalytics.getAnalytics()
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass p-6 rounded-xl">
                    <h5 className="font-semibold text-white mb-3">Algorithm Efficiency</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Average Attempts</span>
                        <span className="text-cyan-400 font-bold">
                          {analytics.averageAttempts.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Optimal (log₂ 100)</span>
                        <span className="text-green-400 font-bold">7.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Efficiency Rate</span>
                        <span className="text-yellow-400 font-bold">
                          {((7 / Math.max(analytics.averageAttempts, 1)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-xl">
                    <h5 className="font-semibold text-white mb-3">BST Performance</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Total Insertions</span>
                        <span className="text-purple-400 font-bold">
                          {performanceAnalytics.bst.inorderTraversal().length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Unique Guesses</span>
                        <span className="text-purple-400 font-bold">
                          {new Set(performanceAnalytics.bst.inorderTraversal().map(n => n.value)).size}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Time Complexity</span>
                        <span className="text-cyan-400 font-mono text-sm">O(log n)</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-xl">
                    <h5 className="font-semibold text-white mb-3">Space Analysis</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Games Played</span>
                        <span className="text-green-400 font-bold">{analytics.totalGames}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Total Guesses</span>
                        <span className="text-green-400 font-bold">{analytics.totalGuesses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Est. Memory</span>
                        <span className="text-green-400 font-bold">
                          {(analytics.totalGuesses * 32)}B
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* DSA Complexity Explanation */}
          <div className="mt-8 glass p-6 rounded-xl">
            <h5 className="font-semibold text-white mb-4">DSA Complexity Reference</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h6 className="font-semibold text-cyan-300 mb-2">Time Complexity</h6>
                <div className="space-y-1 text-white/70">
                  <div>• BST Insert/Search: <span className="text-cyan-400 font-mono">O(log n)</span></div>
                  <div>• Binary Search Algorithm: <span className="text-cyan-400 font-mono">O(log n)</span></div>
                  <div>• Linear Guess Validation: <span className="text-cyan-400 font-mono">O(1)</span></div>
                  <div>• History Display: <span className="text-cyan-400 font-mono">O(n)</span></div>
                </div>
              </div>
              <div>
                <h6 className="font-semibold text-purple-300 mb-2">Space Complexity</h6>
                <div className="space-y-1 text-white/70">
                  <div>• Guess Storage: <span className="text-purple-400 font-mono">O(n)</span></div>
                  <div>• BST Node Storage: <span className="text-purple-400 font-mono">O(n)</span></div>
                  <div>• Algorithm Stack Space: <span className="text-purple-400 font-mono">O(log n)</span></div>
                  <div>• Analytics Tracking: <span className="text-purple-400 font-mono">O(n)</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
