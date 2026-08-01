import { motion } from 'framer-motion';
import { Brain, Zap, Activity, AlertCircle } from 'lucide-react';
import GlassCard from '@/components/medical/GlassCard';
import Brain3D from '@/components/three/Brain3D';
import { channelImportance } from '@/data/mockData';

export default function BrainActivity() {
  const brainRegions = [
    { name: 'Frontal Lobe', activity: 85, color: 'cyan', channels: ['F3', 'F4'] },
    { name: 'Central Region', activity: 72, color: 'purple', channels: ['C3', 'C4'] },
    { name: 'Parietal Lobe', activity: 58, color: 'green', channels: ['P3', 'P4'] },
    { name: 'Occipital Lobe', activity: 45, color: 'blue', channels: ['O1', 'O2'] },
  ];

  return (
    <div className="p-8 space-y-8" data-testid="brain-activity-page">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Interactive Brain Activity</h1>
        <p className="text-gray-400">Real-time neural activity monitoring and visualization</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2" hover={false}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Brain className="w-6 h-6 text-cyan-400" />
              3D Brain Visualization
            </h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Seizure Activity</span>
            </div>
          </div>
          <div className="h-[600px] relative">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-purple-500/10 blur-3xl" />
            <Brain3D activity={0.8} seizureRegion="frontal" />
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard hover={false}>
            <h3 className="text-xl font-bold mb-4">Neural Activity Level</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Overall</span>
                  <span className="text-cyan-400 font-bold">78%</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Frontal Lobe</span>
                  <span className="text-red-400 font-bold">92%</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-400" />
              Electrical Impulses
            </h3>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  style={{ transformOrigin: 'left' }}
                />
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <h3 className="text-xl font-bold mb-4">Active Channels</h3>
            <div className="grid grid-cols-4 gap-2">
              {channelImportance.map((ch) => (
                <motion.div
                  key={ch.channel}
                  className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-center font-mono text-sm font-bold text-cyan-400"
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(0, 217, 255, 0)',
                      '0 0 20px rgba(0, 217, 255, 0.5)',
                      '0 0 0px rgba(0, 217, 255, 0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                >
                  {ch.channel}
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard hover={false}>
        <h3 className="text-xl font-bold mb-6">Brain Region Activity</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {brainRegions.map((region) => (
            <div key={region.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold">{region.name}</h4>
                <span className={`text-${region.color}-400 font-bold`}>{region.activity}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r from-${region.color}-500 to-${region.color}-300`}
                  initial={{ width: 0 }}
                  animate={{ width: `${region.activity}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <div className="flex gap-2">
                {region.channels.map((ch) => (
                  <span key={ch} className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400 font-mono">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
