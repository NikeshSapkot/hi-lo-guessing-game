import { motion } from 'framer-motion'
import Documentation from './components/Documentation'
import SimpleHiLoGame from './components/SimpleHiLoGame'
import { GamepadIcon, Coffee } from 'lucide-react'

// Minimal animated background component
function AnimatedBackground() {
  return (
    <div className="fixed" style={{
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      overflow: 'hidden'
    }}>
      {/* Subtle geometric patterns */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" opacity="0.03">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Single subtle floating orb */}
      <motion.div
        className="absolute opacity-20"
        style={{
          top: '30%',
          right: '20%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(20px)'
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="glass relative py-8"
        style={{
          zIndex: 10,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="container text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
            className="mb-6"
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                className="relative flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-20 h-20 gradient-purple flex items-center justify-center" style={{
                  borderRadius: '1.5rem',
                  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
                }}>
                  <GamepadIcon size={40} color="white" />
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="gradient-text mb-4" style={{ fontSize: '4rem', fontWeight: 900 }}>
              Hi-Lo Challenge
            </h1>
            
            <p className="opacity-80 mb-6" style={{ fontSize: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
              A Modern Number Guessing Experience
            </p>
            
            <div className="flex items-center justify-center gap-4 opacity-70">
              <div className="flex items-center gap-2">
                <Coffee size={20} />
                <span>Built for Java Implementation</span>
              </div>
              <div style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.5)', borderRadius: '50%' }}></div>
              <span>Modern UI/UX Design</span>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container py-8 my-8">
        {/* Documentation Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center my-8"
        >
          <Documentation />
        </motion.section>

        {/* Divider */}
        <div className="flex items-center justify-center my-8 py-8">
          <motion.div
            className="glass flex items-center justify-center"
            style={{ width: '64px', height: '64px', borderRadius: '1rem' }}
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ 
              rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }}
          >
            <GamepadIcon size={32} className="opacity-80" />
          </motion.div>
        </div>

        {/* Game Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center my-8"
        >
          <SimpleHiLoGame />
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="glass mt-8"
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 10,
          position: 'relative'
        }}
      >
        <div className="container py-8 text-center">
          {/* Developer Credits */}
          <div className="py-6">
            <h3 className="gradient-text mb-6" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              Built by
            </h3>
            <div className="flex flex-col gap-6 items-center" style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="w-16 h-16 gradient-blue flex items-center justify-center mx-auto mb-2" style={{
                  borderRadius: '1rem',
                  boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
                }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>N</span>
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                  Nikesh Sapkota
                </h4>
              </motion.div>
              
              <motion.div
                style={{ 
                  width: '4px', 
                  height: '4px', 
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  borderRadius: '50%'
                }}
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="w-16 h-16 gradient-green flex items-center justify-center mx-auto mb-2" style={{
                  borderRadius: '1rem',
                  boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)'
                }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>P</span>
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                  Prashant Basyal
                </h4>
              </motion.div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="pt-6 opacity-50" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <p style={{ fontSize: '0.875rem' }}>
              © 2025 Hi-Lo Challenge Project. Built with passion for education.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default App
