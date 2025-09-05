import { motion } from 'framer-motion'
import Documentation from './components/Documentation'
import HiLoGame from './components/HiLoGame'
import { GamepadIcon, Coffee } from 'lucide-react'

// Animated background component
function AnimatedBackground() {
  return (
    <div className="fixed" style={{
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      background: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 25%, #be185d 50%, #1e1b4b 100%)',
      overflow: 'hidden'
    }}>
      {/* Floating orbs */}
      <motion.div
        className="absolute opacity-70"
        style={{
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(219, 39, 119, 0.4))',
          filter: 'blur(40px)'
        }}
        animate={{
          x: [0, 150, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      <motion.div
        className="absolute opacity-60"
        style={{
          top: '60%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(59, 130, 246, 0.4))',
          filter: 'blur(50px)'
        }}
        animate={{
          x: [0, -120, 0],
          y: [0, 80, 0],
          scale: [1, 0.8, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      <motion.div
        className="absolute opacity-50"
        style={{
          bottom: '20%',
          left: '30%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(34, 197, 94, 0.3))',
          filter: 'blur(35px)'
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -60, 0],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      <motion.div
        className="absolute opacity-40"
        style={{
          top: '40%',
          left: '70%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(251, 191, 36, 0.3))',
          filter: 'blur(30px)'
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 12,
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
          <HiLoGame />
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
            <div className="flex flex-col gap-6 items-center" style={{ '@media (min-width: 640px)': { flexDirection: 'row', justifyContent: 'center' } }}>
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
                  borderRadius: '50%',
                  display: 'none',
                  '@media (min-width: 640px)': { display: 'block' }
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
