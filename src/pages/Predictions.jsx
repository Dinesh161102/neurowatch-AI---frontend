import { motion } from 'framer-motion';
import { Target, AlertTriangle, CheckCircle, Clock, Brain } from 'lucide-react';
import GlassCard from '@/components/medical/GlassCard';
import { currentPrediction } from '@/data/mockData';
import { predictionColors } from '@/utils/colors';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function Predictions() {
  const predictionData = [
    { name: 'Normal', value: currentPrediction.normal, color: predictionColors.normal },
    { name: 'Preictal', value: currentPrediction.preictal, color: predictionColors.preictal },
    { name: 'Seizure', value: currentPrediction.seizure, color: predictionColors.seizure },
  ];

  const getRiskIcon = () => {
    if (currentPrediction.seizure > 60) return <AlertTriangle className="w-8 h-8 text-red-400" />;
    if (currentPrediction.preictal > 30) return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
    return <CheckCircle className="w-8 h-8 text-green-400" />;
  };

  return (
    <div className="p-8 space-y-8" data-testid="predictions-page">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Multi-Class Predictions</h1>
        <p className="text-gray-400">Real-time seizure state classification and risk assessment</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard hover={false}>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-4xl font-bold text-green-400 mb-2">{currentPrediction.normal}%</h3>
            <p className="text-gray-400 font-medium">Normal State</p>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-yellow-400" />
            </div>
            <h3 className="text-4xl font-bold text-yellow-400 mb-2">{currentPrediction.preictal}%</h3>
            <p className="text-gray-400 font-medium">Preictal State</p>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-4xl font-bold text-red-400 mb-2">{currentPrediction.seizure}%</h3>
            <p className="text-gray-400 font-medium">Seizure State</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-cyan-400" />
            Prediction Distribution
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={predictionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {predictionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard hover={false}>
            <h3 className="text-xl font-bold mb-4">Prediction Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-cyan-400" />
                  <span className="font-medium">Confidence Score</span>
                </div>
                <span className="text-2xl font-bold text-cyan-400">{currentPrediction.confidence}%</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <span className="font-medium">Processing Time</span>
                </div>
                <span className="text-2xl font-bold text-purple-400">{currentPrediction.processingTime}ms</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center gap-3">
                  {getRiskIcon()}
                  <span className="font-medium">Risk Level</span>
                </div>
                <span className="text-2xl font-bold text-red-400 uppercase">{currentPrediction.riskLevel}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-cyan-400" />
              Dominant Channels
            </h3>
            <div className="flex gap-3">
              {currentPrediction.dominantChannels.map((channel) => (
                <motion.div
                  key={channel}
                  className="flex-1 text-center p-4 bg-cyan-500/20 border border-cyan-500/50 rounded-lg"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(0, 217, 255, 0)',
                      '0 0 20px rgba(0, 217, 255, 0.8)',
                      '0 0 0px rgba(0, 217, 255, 0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-2xl font-bold text-cyan-400 font-mono">{channel}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <h3 className="text-xl font-bold mb-4">Prediction Gauges</h3>
          <div className="space-y-6">
            {predictionData.map((pred) => (
              <div key={pred.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{pred.name}</span>
                  <span className="font-bold" style={{ color: pred.color }}>{pred.value}%</span>
                </div>
                <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: pred.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pred.value}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            AI Explanation Summary
          </h3>
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <h4 className="font-medium text-purple-300 mb-2">Key Drivers for Seizure Classification</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>Elevated gamma band activity (30-50 Hz) in channels T3, T4 strongly pushed model towards Seizure prediction (+35% AI impact).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-purple-400 shrink-0" />
                <span>PPG Heart Rate Variability decrease detected, providing supporting evidence (+12% AI impact).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-red-400 shrink-0" />
                <span>Reduced Alpha wave synchronization in occipital regions confirmed ictal state.</span>
              </li>
            </ul>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
