import { motion } from 'framer-motion';
import { Eye, Brain, TrendingUp } from 'lucide-react';
import GlassCard from '@/components/medical/GlassCard';
import { shapExplanation, aiExplanation, channelImportance } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Explainability() {
  return (
    <div className="p-8 space-y-8" data-testid="explainability-page">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Explainable AI</h1>
        <p className="text-gray-400">Transparent and interpretable seizure predictions</p>
      </motion.div>

      <GlassCard hover={false} className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
        <div className="flex items-start gap-4">
          <div className="p-4 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
            <Eye className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3">AI Explanation</h3>
            <p className="text-gray-300 leading-relaxed">{aiExplanation}</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            AI Feature Importance
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={shapExplanation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="feature" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(5, 11, 26, 0.9)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="importance" fill="#00D9FF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-xl font-bold mb-6">Feature Breakdown</h3>
          <div className="space-y-4">
            {shapExplanation.map((feature, index) => (
              <motion.div
                key={feature.feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-[#0A1628]/50 rounded-lg border border-cyan-500/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      feature.type === 'eeg' ? 'bg-cyan-400' : 'bg-purple-400'
                    }`} />
                    <span className="font-medium">{feature.feature}</span>
                  </div>
                  <span className="font-bold text-cyan-400">{feature.importance}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      feature.type === 'eeg' ? 'bg-cyan-400' : 'bg-purple-400'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${feature.importance}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          Brain Topography - AI Overlay
        </h3>
        <div className="relative w-full h-96 bg-[#0A1628]/50 rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <ellipse cx="150" cy="150" rx="120" ry="135" fill="none" stroke="#00D9FF" strokeWidth="2" />
            
            {channelImportance.map((ch, index) => {
              const x = 150 + (ch.position.x * 120);
              const y = 150 - (ch.position.y * 135);
              const size = ch.importance / 3;
              
              return (
                <g key={ch.channel}>
                  <circle
                    cx={x}
                    cy={y}
                    r={size}
                    fill="#FF006E"
                    opacity={ch.importance / 100}
                    className="animate-pulse"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={size + 5}
                    fill="none"
                    stroke="#00D9FF"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y - size - 10}
                    textAnchor="middle"
                    fill="#00D9FF"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {ch.channel}
                  </text>
                  <text
                    x={x}
                    y={y + size + 20}
                    textAnchor="middle"
                    fill="#9CA3AF"
                    fontSize="10"
                  >
                    {ch.importance}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="text-center text-gray-400 mt-4">
          Circle size and opacity represent feature importance values
        </p>
      </GlassCard>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard hover={false}>
          <h3 className="text-lg font-bold mb-3">EEG Contribution</h3>
          <div className="text-center">
            <p className="text-5xl font-bold text-cyan-400 mb-2">72%</p>
            <p className="text-gray-400">Total EEG Weight</p>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-lg font-bold mb-3">PPG Contribution</h3>
          <div className="text-center">
            <p className="text-5xl font-bold text-purple-400 mb-2">28%</p>
            <p className="text-gray-400">Total PPG Weight</p>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-lg font-bold mb-3">Prediction Confidence</h3>
          <div className="text-center">
            <p className="text-5xl font-bold text-green-400 mb-2">94.8%</p>
            <p className="text-gray-400">Model Certainty</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
