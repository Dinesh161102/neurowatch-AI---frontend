import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ZoomIn, ZoomOut } from 'lucide-react';
import GlassCard from '@/components/medical/GlassCard';
import EEGWave from '@/components/animations/EEGWave';
import { selectedChannels } from '@/data/mockData';

export default function EEGVisualization() {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="p-8 space-y-8" data-testid="eeg-visualization-page">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">EEG & PPG Visualization</h1>
          <p className="text-gray-400">Multi-channel signal monitoring and analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition"
            data-testid="zoom-out-button"
          >
            <ZoomOut className="w-5 h-5 text-cyan-400" />
          </button>
          <span className="text-gray-400 font-medium">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.25))}
            className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition"
            data-testid="zoom-in-button"
          >
            <ZoomIn className="w-5 h-5 text-cyan-400" />
          </button>
        </div>
      </motion.div>

      <GlassCard hover={false}>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Selected EEG Channels (8)
        </h3>
        <div className="space-y-4">
          {selectedChannels.map((channel, index) => (
            <motion.div
              key={channel}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0A1628]/50 rounded-lg p-4 border border-cyan-500/20"
            >
              <EEGWave channel={channel} className="h-24" />
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-400" />
          PPG Signal (Photoplethysmography)
        </h3>
        <div className="bg-[#0A1628]/50 rounded-lg p-4 border border-purple-500/20">
          <EEGWave channel="PPG" className="h-32" />
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <h3 className="text-xl font-bold mb-4">Electrode Placement</h3>
          <div className="relative w-full h-96 bg-[#0A1628]/50 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <ellipse cx="100" cy="100" rx="80" ry="90" fill="none" stroke="#00D9FF" strokeWidth="2" />
              
              {[
                { name: 'F3', x: 70, y: 50 },
                { name: 'F4', x: 130, y: 50 },
                { name: 'C3', x: 60, y: 100 },
                { name: 'C4', x: 140, y: 100 },
                { name: 'P3', x: 70, y: 150 },
                { name: 'P4', x: 130, y: 150 },
                { name: 'O1', x: 85, y: 180 },
                { name: 'O2', x: 115, y: 180 },
              ].map((electrode) => (
                <g key={electrode.name}>
                  <circle
                    cx={electrode.x}
                    cy={electrode.y}
                    r="8"
                    fill="#00D9FF"
                    className="animate-pulse"
                  />
                  <text
                    x={electrode.x}
                    y={electrode.y - 15}
                    textAnchor="middle"
                    fill="#00D9FF"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {electrode.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-xl font-bold mb-4">Channel Information</h3>
          <div className="space-y-3">
            {selectedChannels.map((channel, index) => (
              <div key={channel} className="flex items-center justify-between p-3 bg-[#0A1628]/50 rounded-lg border border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="font-mono font-bold text-cyan-400">{channel}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">Frequency: {20 + index * 5}Hz</span>
                  <span className="text-sm text-gray-400">Amplitude: {50 + index * 10}μV</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
