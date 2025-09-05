import { useState, useEffect } from 'react'
import { Play, RotateCcw, Trophy, Target } from 'lucide-react'

export default function SimpleHiLoGame() {
  const [gameState, setGameState] = useState('waiting') // waiting, playing, won, quit
  const [targetNumber, setTargetNumber] = useState(null)
  const [currentGuess, setCurrentGuess] = useState('')
  const [guessCount, setGuessCount] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [guessHistory, setGuessHistory] = useState([])

  const startNewGame = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1
    setTargetNumber(newTarget)
    setGameState('playing')
    setCurrentGuess('')
    setGuessCount(0)
    setFeedback('I\'m thinking of a number between 1 and 100!')
    setGuessHistory([])
  }

  const makeGuess = () => {
    const guess = parseInt(currentGuess)
    
    // Validate input
    if (isNaN(guess)) {
      setFeedback('Please enter a valid number!')
      return
    }

    // Check for quit condition
    if (guess === 0) {
      setGameState('quit')
      setFeedback(`You chose to quit! The number was ${targetNumber}.`)
      return
    }

    // Range validation
    if (guess < 1 || guess > 100) {
      setFeedback('Please enter a number between 1 and 100 (or 0 to quit).')
      return
    }

    const newCount = guessCount + 1
    const newHistory = [...guessHistory, { guess, count: newCount }]
    setGuessCount(newCount)
    setGuessHistory(newHistory)

    // Check if guess is correct
    if (guess === targetNumber) {
      setGameState('won')
      setFeedback(`🎉 Congratulations! You guessed ${targetNumber} correctly in ${newCount} ${newCount === 1 ? 'guess' : 'guesses'}!`)
    } else if (guess < targetNumber) {
      setFeedback(`📈 Too low! Try a higher number. (Guess #${newCount})`)
    } else {
      setFeedback(`📉 Too high! Try a lower number. (Guess #${newCount})`)
    }

    setCurrentGuess('')
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {gameState === 'waiting' && (
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
    </div>
  )
}
