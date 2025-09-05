import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Brain, TrendingUp, Target, Cpu, Zap, 
  GitBranch, Activity, Layers, Sparkles, ChevronRight,
  Award, Clock, Radar
} from 'lucide-react';

const AdvancedAnalytics = ({ 
  gameHistory, 
  currentGuess, 
  analytics, 
  aiRecommendations, 
  patternAnalysis,
  performanceMetrics 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Visualize BST structure
  const renderBSTVisualization = (bstData) => {
    if (!bstData || bstData.length === 0) {
      return (
        <div className="text-center py-8 opacity-60">
          <GitBranch size={48} className="mx-auto mb-4" />
          <p>No BST data available yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 font-semibold text-white">
          <GitBranch size={20} />
          Binary Search Tree - Guess Frequency Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {bstData.slice(0, 9).map((node, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-4 rounded-xl border border-white/20"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(168, 85, 247, ${0.1 + (node.frequency * 0.1)}), 
                  rgba(34, 211, 238, ${0.1 + (node.frequency * 0.1)}))`
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-white">{node.value}</span>
                <div className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"
                    style={{ opacity: Math.min(node.frequency / 5, 1) }}
                  />
                  <span className="text-sm text-white/60">×{node.frequency}</span>
                </div>
              </div>
              <div className="text-xs text-white/50">
                Used {node.frequency} time{node.frequency !== 1 ? 's' : ''}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Visualize AI Strategy Comparison
  const renderAIStrategies = () => {
    if (!aiRecommendations || aiRecommendations.length === 0) {
      return (
        <div className="text-center py-8 opacity-60">
          <Brain size={48} className="mx-auto mb-4" />
          <p>No AI strategy data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h4 className="flex items-center gap-2 font-semibold text-white">
          <Brain size={20} />
          AI Strategy Engine Analysis
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiRecommendations.map((strategy, index) => (
            <motion.div
              key={strategy.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="glass p-6 rounded-xl border border-white/20"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(168, 85, 247, 0.15), 
                  rgba(34, 211, 238, 0.15))`
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h5 className="font-bold text-white capitalize mb-1">
                    {strategy.name.replace(/([A-Z])/g, ' $1').trim()}
                  </h5>
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-purple-400" />
                    <span className="text-lg font-bold text-white">{strategy.guess}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60 mb-1">Confidence</div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${strategy.confidence * 100}%` }}
                        transition={{ delay: index * 0.3 + 0.5 }}
                        className="h-full bg-gradient-to-r from-purple-400 to-cyan-400"
                      />
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {(strategy.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-white/70 mb-3">
                {strategy.reasoning}
              </p>

              {strategy.expectedGuesses && (
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Clock size={12} />
                  Expected guesses: {strategy.expectedGuesses}
                </div>
              )}

              {strategy.detectedPatterns && (
                <div className="mt-3 p-3 rounded-lg bg-white/10">
                  <div className="text-xs text-white/60 mb-2">Detected Patterns:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Avg Jump: {strategy.detectedPatterns.averageJump?.toFixed(1)}</div>
                    <div>Trend: {strategy.detectedPatterns.trendDirection}</div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {aiRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="glass p-4 rounded-xl border border-green-500/30 bg-green-500/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-green-400" />
              <span className="font-semibold text-white">Recommended Strategy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">
                {aiRecommendations[0].name}: {aiRecommendations[0].guess}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-sm text-green-400">
                  {(aiRecommendations[0].confidence * 100).toFixed(0)}% confidence
                </span>
                <ChevronRight size={16} className="text-green-400" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Performance Metrics Visualization
  const renderPerformanceMetrics = () => {
    if (!performanceMetrics) {
      return (
        <div className="text-center py-8 opacity-60">
          <Activity size={48} className="mx-auto mb-4" />
          <p>No performance data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h4 className="flex items-center gap-2 font-semibold text-white">
          <Activity size={20} />
          Advanced Performance Analytics
        </h4>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              label: 'Skill Level', 
              value: performanceMetrics.skillLevel,
              icon: Award,
              color: 'from-yellow-400 to-orange-500'
            },
            { 
              label: 'Avg Attempts', 
              value: performanceMetrics.averageAttempts?.toFixed(1),
              icon: Target,
              color: 'from-blue-400 to-cyan-500'
            },
            { 
              label: 'Best Score', 
              value: performanceMetrics.bestPerformance,
              icon: Zap,
              color: 'from-green-400 to-emerald-500'
            },
            { 
              label: 'Total Games', 
              value: performanceMetrics.totalGames,
              icon: BarChart3,
              color: 'from-purple-400 to-pink-500'
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-4 rounded-xl border border-white/20 text-center"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center mx-auto mb-3`}>
                <metric.icon size={24} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {metric.value || 'N/A'}
              </div>
              <div className="text-sm text-white/60">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Efficiency Trend */}
        {performanceMetrics.efficiencyTrend && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-4 rounded-xl border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h5 className="flex items-center gap-2 font-semibold text-white">
                <TrendingUp size={20} />
                Performance Trend
              </h5>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                performanceMetrics.efficiencyTrend === 'improving' 
                  ? 'bg-green-500/20 text-green-400' 
                  : performanceMetrics.efficiencyTrend === 'declining'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {performanceMetrics.efficiencyTrend.replace('_', ' ')}
              </span>
            </div>
          </motion.div>
        )}

        {/* Pattern Analysis */}
        {performanceMetrics.commonPatterns && performanceMetrics.commonPatterns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass p-4 rounded-xl border border-white/20"
          >
            <h5 className="flex items-center gap-2 font-semibold text-white mb-4">
              <Layers size={20} />
              Common Guess Patterns
            </h5>
            <div className="flex flex-wrap gap-2">
              {performanceMetrics.commonPatterns.map((pattern, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/20"
                >
                  <span className="text-sm text-white">
                    {pattern.pattern} 
                    <span className="ml-2 text-white/60">×{pattern.frequency}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Game Theory Visualization
  const renderGameTheory = () => {
    return (
      <div className="space-y-6">
        <h4 className="flex items-center gap-2 font-semibold text-white">
          <Radar size={20} />
          Game Theory Analysis
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Minimax Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-xl border border-white/20"
          >
            <h5 className="font-bold text-white mb-4">Minimax Strategy</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Optimal Move:</span>
                <span className="text-xl font-bold text-white">50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Expected Depth:</span>
                <span className="font-semibold text-white">6.64</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Strategy:</span>
                <span className="text-green-400">Optimal</span>
              </div>
            </div>
          </motion.div>

          {/* Decision Tree Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-xl border border-white/20"
          >
            <h5 className="font-bold text-white mb-4">Decision Tree Analysis</h5>
            <div className="space-y-2">
              {[
                { range: '1-100', move: '50', depth: 0 },
                { range: '51-100', move: '75', depth: 1 },
                { range: '1-49', move: '25', depth: 1 },
                { range: '76-100', move: '88', depth: 2 }
              ].map((node, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
                  style={{ marginLeft: `${node.depth * 20}px` }}
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400" />
                  <span className="text-sm text-white/60">{node.range}</span>
                  <ChevronRight size={14} className="text-white/40" />
                  <span className="text-sm font-semibold text-white">{node.move}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'ai', label: 'AI Strategies', icon: Brain },
    { id: 'patterns', label: 'Data Structures', icon: GitBranch },
    { id: 'performance', label: 'Analytics', icon: Activity },
    { id: 'theory', label: 'Game Theory', icon: Radar }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {renderPerformanceMetrics()}
            {renderAIStrategies()}
          </div>
        );
      case 'ai':
        return renderAIStrategies();
      case 'patterns':
        return renderBSTVisualization(analytics?.bstData);
      case 'performance':
        return renderPerformanceMetrics();
      case 'theory':
        return renderGameTheory();
      default:
        return renderPerformanceMetrics();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h3
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #22d3ee)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Advanced DSA Analytics
        </motion.h3>
        <p className="text-white/60 text-lg">
          Real-time analysis using Binary Search Trees, Heaps, Tries, and AI Algorithms
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                : 'glass border border-white/20 text-white/70 hover:text-white'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="glass p-8 rounded-2xl border border-white/20"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {renderTabContent()}
      </motion.div>
    </motion.div>
  );
};

export default AdvancedAnalytics;
