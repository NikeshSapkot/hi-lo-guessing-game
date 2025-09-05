import React from 'react'

function TestApp() {
  return (
    <div style={{ padding: '2rem', background: '#1e1b4b', color: 'white', minHeight: '100vh' }}>
      <h1>Test App - React is Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <button 
        onClick={() => alert('Button clicked!')}
        style={{
          padding: '1rem 2rem',
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          color: 'white',
          border: 'none',
          borderRadius: '1rem',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 600
        }}
      >
        Test Button
      </button>
    </div>
  )
}

export default TestApp
