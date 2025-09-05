import { motion } from 'framer-motion'
import { FileText, Code, AlertTriangle, Coffee, Cpu, Settings } from 'lucide-react'

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.3,
      duration: 1,
      ease: "easeOut",
      type: "spring",
      bounce: 0.3
    }
  })
}

const iconVariants = {
  hover: {
    scale: 1.2,
    rotate: 360,
    transition: { duration: 0.8, ease: "easeInOut" }
  }
}

const requirements = [
  "Random number generation (1-100) using Java's Random class",
  "Input validation with Scanner and exception handling",
  "Implement sentinel value (0) for graceful exit",
  "Loop-based guess counting and feedback system",
  "Method-based replay functionality",
  "Object-oriented design with proper encapsulation"
]

const javaAlgorithm = [
  { 
    title: "Class Initialization", 
    desc: "Create HiLoGame class with Random, Scanner objects and instance variables",
    code: "Random rand = new Random();"
  },
  { 
    title: "Game Logic Method", 
    desc: "Implement playGame() method with while loop for user input and comparison",
    code: "while (guess != targetNumber && guess != 0)"
  },
  { 
    title: "Input Validation", 
    desc: "Use try-catch blocks for handling invalid input and NumberFormatException",
    code: "try { guess = Integer.parseInt(input); }"
  },
  { 
    title: "Main Method", 
    desc: "Driver method to instantiate game object and handle replay logic",
    code: "public static void main(String[] args)"
  }
]

const javaImplementation = [
  { title: "Scanner Input Handling", desc: "Managing user input streams and validation in Java console applications" },
  { title: "Exception Management", desc: "Proper try-catch blocks for NumberFormatException and InputMismatchException" },
  { title: "Method Decomposition", desc: "Breaking down game logic into reusable, testable methods" },
  { title: "Object State Management", desc: "Maintaining game state using instance variables and proper encapsulation" },
  { title: "Memory Management", desc: "Efficient use of Java objects and garbage collection considerations" }
]

export default function Documentation() {
  return (
    <div style={{ maxWidth: '1536px', margin: '0 auto' }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="text-center my-20"
      >
        <motion.h2
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="gradient-text mb-8"
          style={{ fontSize: '5rem', fontWeight: 900, lineHeight: '1.1' }}
        >
          Java Implementation
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          viewport={{ once: true }}
          className="opacity-70 mb-8"
          style={{ fontSize: '2rem', maxWidth: '1000px', margin: '0 auto', fontWeight: 300 }}
        >
          Professional-grade Hi-Lo game architecture designed for Java development
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 opacity-50"
        >
          <Coffee size={24} />
          <span style={{ fontSize: '1.25rem', fontWeight: 500 }}>Object-Oriented Design</span>
          <div style={{ width: '8px', height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '1.25rem', fontWeight: 500 }}>Enterprise Ready</span>
        </motion.div>
      </motion.div>
      
      {/* Cards Grid */}
      <div className="documentation-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', justifyItems: 'center', marginBottom: '4rem', padding: '2rem' }}>
        {/* Java Requirements Card */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          whileHover={{ 
            y: -15, 
            scale: 1.05,
            transition: { duration: 0.4 } 
          }}
          className="group relative"
          style={{ width: '100%', maxWidth: '384px' }}
        >
          <div 
            className="absolute" 
            style={{
              inset: '-4px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
              borderRadius: '1.5rem',
              filter: 'blur(16px)',
              opacity: 0.4,
              transition: 'opacity 1s ease',
              zIndex: -1
            }}
          />
          <div 
            className="glass relative p-10 hover:brightness-110 transition-all"
            style={{
              borderRadius: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.7s ease'
            }}
          >
            <div className="text-center mb-8">
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                className="gradient-blue flex items-center justify-center mx-auto mb-6"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '1.5rem',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                <Coffee size={40} color="white" />
              </motion.div>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>Java Requirements</h3>
              <div 
                className="mx-auto"
                style={{
                  width: '64px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #60a5fa, #22d3ee)',
                  borderRadius: '50px'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {requirements.map((req, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 group/item"
                >
                  <motion.div
                    whileHover={{ scale: 1.3, rotate: 180 }}
                    style={{
                      width: '12px',
                      height: '12px',
                      background: 'linear-gradient(135deg, #60a5fa, #22d3ee)',
                      borderRadius: '50%',
                      marginTop: '8px',
                      flexShrink: 0,
                      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <p 
                    className="group-hover/item:opacity-100 transition-opacity"
                    style={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      fontSize: '1.125rem', 
                      lineHeight: '1.75',
                      opacity: 0.8
                    }}
                  >{req}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Java Algorithm Card */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          whileHover={{ 
            y: -15, 
            scale: 1.05,
            transition: { duration: 0.4 } 
          }}
          className="group relative"
          style={{ width: '100%', maxWidth: '384px' }}
        >
          <div 
            className="absolute" 
            style={{
              inset: '-4px',
              background: 'linear-gradient(135deg, #10b981, #34d399, #14b8a6)',
              borderRadius: '1.5rem',
              filter: 'blur(16px)',
              opacity: 0.4,
              transition: 'opacity 1s ease',
              zIndex: -1
            }}
          />
          <div 
            className="glass relative p-10 hover:brightness-110 transition-all"
            style={{
              borderRadius: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.7s ease'
            }}
          >
            <div className="text-center mb-8">
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                className="gradient-green flex items-center justify-center mx-auto mb-6"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '1.5rem',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                <Code size={40} color="white" />
              </motion.div>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>Java Algorithm</h3>
              <div 
                className="mx-auto"
                style={{
                  width: '64px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #10b981, #34d399)',
                  borderRadius: '50px'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {javaAlgorithm.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="glass p-5 cursor-pointer group/step hover:brightness-110"
                  style={{
                    borderRadius: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.4s ease'
                  }}
                >
                  <p 
                    className="group-hover/step:opacity-90 transition-opacity mb-3"
                    style={{ 
                      fontWeight: 'bold', 
                      color: '#86efac', 
                      fontSize: '1.125rem'
                    }}
                  >{step.title}</p>
                  <p 
                    style={{ 
                      color: 'rgba(255,255,255,0.7)', 
                      fontSize: '1rem', 
                      lineHeight: '1.75', 
                      marginBottom: '0.75rem' 
                    }}
                  >{step.desc}</p>
                  <div 
                    style={{
                      background: 'rgba(15, 23, 42, 0.5)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      border: '1px solid rgba(51, 65, 85, 0.5)'
                    }}
                  >
                    <code style={{ color: '#86efac', fontSize: '0.875rem', fontFamily: 'monospace' }}>{step.code}</code>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Java Implementation Card */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          whileHover={{ 
            y: -15, 
            scale: 1.05,
            transition: { duration: 0.4 } 
          }}
          className="group relative"
          style={{ width: '100%', maxWidth: '384px' }}
        >
          <div 
            className="absolute" 
            style={{
              inset: '-4px',
              background: 'linear-gradient(135deg, #f97316, #ef4444, #ec4899)',
              borderRadius: '1.5rem',
              filter: 'blur(16px)',
              opacity: 0.4,
              transition: 'opacity 1s ease',
              zIndex: -1
            }}
          />
          <div 
            className="glass relative p-10 hover:brightness-110 transition-all"
            style={{
              borderRadius: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.7s ease'
            }}
          >
            <div className="text-center mb-8">
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #fb923c, #ef4444, #f472b6)',
                  borderRadius: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                <Settings size={40} color="white" />
              </motion.div>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>Implementation</h3>
              <div 
                className="mx-auto"
                style={{
                  width: '64px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #fb923c, #ef4444)',
                  borderRadius: '50px'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {javaImplementation.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.12, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                  className="glass p-4 cursor-pointer group/impl hover:brightness-110"
                  style={{
                    borderRadius: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.4s ease'
                  }}
                >
                  <p 
                    className="group-hover/impl:opacity-90 transition-opacity mb-2"
                    style={{ 
                      fontWeight: 'bold', 
                      color: '#fdba74', 
                      fontSize: '1rem'
                    }}
                  >{item.title}</p>
                  <p 
                    style={{ 
                      color: 'rgba(255,255,255,0.6)', 
                      fontSize: '0.875rem', 
                      lineHeight: '1.75' 
                    }}
                  >{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Java Code Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        viewport={{ once: true }}
        className="text-center my-20"
      >
        <h3 className="gradient-text mb-8" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
          Ready for Java Implementation
        </h3>
        <div 
          className="glass mx-auto p-8"
          style={{
            maxWidth: '1000px',
            borderRadius: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', fontSize: '0.875rem' }}>HiLoGame.java</span>
              <div className="flex gap-2">
                <div style={{ width: '12px', height: '12px', background: '#f87171', borderRadius: '50%' }} />
                <div style={{ width: '12px', height: '12px', background: '#fbbf24', borderRadius: '50%' }} />
                <div style={{ width: '12px', height: '12px', background: '#34d399', borderRadius: '50%' }} />
              </div>
            </div>
            <code style={{ color: '#86efac', fontFamily: 'monospace', fontSize: '1rem', lineHeight: '1.75' }}>
              <div style={{ color: '#60a5fa', display: 'inline' }}>public class</div> <span style={{ color: '#fde047' }}>HiLoGame</span> {'{'}<br/>
              &nbsp;&nbsp;<span style={{ color: '#9ca3af' }}>// Perfect for CS educational projects</span><br/>
              &nbsp;&nbsp;<span style={{ color: '#60a5fa' }}>private</span> <span style={{ color: '#a78bfa' }}>Random</span> rand;<br/>
              &nbsp;&nbsp;<span style={{ color: '#60a5fa' }}>private</span> <span style={{ color: '#a78bfa' }}>Scanner</span> scanner;<br/>
              &nbsp;&nbsp;<span style={{ color: '#60a5fa' }}>private</span> <span style={{ color: '#a78bfa' }}>int</span> targetNumber;<br/>
              {'}'}
            </code>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
