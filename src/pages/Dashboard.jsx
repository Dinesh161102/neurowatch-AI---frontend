import { motion } from 'framer-motion';
import { Users, Activity, Target, TrendingUp, Brain } from 'lucide-react';
import StatCard from '@/components/medical/StatCard';
import GlassCard from '@/components/medical/GlassCard';
import EEGWave from '@/components/animations/EEGWave';
import Brain3D from '@/components/three/Brain3D';
import { dashboardStats, predictionData, systemHealth } from '@/data/mockData';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { neuroColors } from '@/utils/colors';

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8" data-testid="dashboard-page">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">Neural Monitoring Dashboard</h1>
          <p className="text-gray-400">Real-time epileptic seizure detection and analysis</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 font-medium">System Online</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Patients"
          value={dashboardStats.totalPatients}
          icon={Users}
          color="cyan"
          trend="+12 this month"
        />
        <StatCard
          title="EEG Analyses"
          value={dashboardStats.eegAnalyses.toLocaleString()}
          icon={Activity}
          color="purple"
          trend="+248 today"
        />
        <StatCard
          title="Seizures Detected"
          value={dashboardStats.seizuresDetected}
          icon={Target}
          color="red"
          trend="3 in last 24h"
        />
        <StatCard
          title="Accuracy"
          value={`${dashboardStats.detectionAccuracy}%`}
          icon={TrendingUp}
          color="green"
          trend="Cross-validated"
        />
        <StatCard
          title="Active Sessions"
          value={dashboardStats.activeMonitoring}
          icon={Brain}
          color="cyan"
          trend="Live monitoring"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2" hover={false}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            Prediction Trends (24h)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={predictionData}>
              <defs>
                <linearGradient id="normalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F5A0" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00F5A0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="preictalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFB703" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FFB703" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="seizureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF006E" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF006E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(5, 11, 26, 0.9)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="normal" stroke="#00F5A0" fillOpacity={1} fill="url(#normalGradient)" />
              <Area type="monotone" dataKey="preictal" stroke="#FFB703" fillOpacity={1} fill="url(#preictalGradient)" />
              <Area type="monotone" dataKey="seizure" stroke="#FF006E" fillOpacity={1} fill="url(#seizureGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Live Brain Status
          </h3>
          <div className="relative h-[300px] overflow-hidden rounded-xl">
    <Brain3D
        showControls={false}
        mode="widget"
    />
</div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            Real-Time EEG Monitor
          </h3>
          <div className="space-y-4">
            {['F3', 'C3', 'P3', 'O1'].map((channel) => (
              <EEGWave key={channel} channel={channel} className="h-20" />
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-xl font-bold mb-4">System Health</h3>
          <div className="space-y-4">
            {Object.entries(systemHealth).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-cyan-500/20">
                <div>
                  <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-sm text-gray-400">{value.latency}ms latency</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{value.uptime}</span>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
