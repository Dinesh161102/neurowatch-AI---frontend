import { motion } from 'framer-motion';
import { Database, FileText, BarChart3 } from 'lucide-react';
import GlassCard from '@/components/medical/GlassCard';
import { datasetInfo } from '@/data/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function DataAcquisition() {
  const classData = [
    { name: 'Normal', value: datasetInfo.classDistribution.normal, color: '#00F5A0' },
    { name: 'Preictal', value: datasetInfo.classDistribution.preictal, color: '#FFB703' },
    { name: 'Seizure', value: datasetInfo.classDistribution.seizure, color: '#FF006E' },
  ];

  return (
    <div className="p-8 space-y-8" data-testid="data-acquisition-page">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Data Acquisition</h1>
        <p className="text-gray-400">EEG and PPG dataset information and statistics</p>
      </motion.div>

      <GlassCard hover={false} className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
        <div className="flex items-center gap-4 mb-6">
          <Database className="w-12 h-12 text-cyan-400" />
          <div>
            <h2 className="text-2xl font-bold">{datasetInfo.name}</h2>
            <p className="text-gray-400">Primary EEG dataset for seizure detection</p>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <p className="text-4xl font-bold text-cyan-400 mb-2">{datasetInfo.patients}</p>
            <p className="text-gray-400">Patients</p>
          </div>
          <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-4xl font-bold text-purple-400 mb-2">{datasetInfo.recordings}</p>
            <p className="text-gray-400">Recordings</p>
          </div>
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-4xl font-bold text-green-400 mb-2">{datasetInfo.totalHours}</p>
            <p className="text-gray-400">Total Hours</p>
          </div>
          <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-4xl font-bold text-red-400 mb-2">{datasetInfo.seizureEvents}</p>
            <p className="text-gray-400">Seizure Events</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Class Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={classData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {classData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-xl font-bold mb-6">Dataset Details</h3>
          <div className="space-y-4">
            <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <h4 className="font-bold mb-2">EEG Channels</h4>
              <p className="text-sm text-gray-400">23 channels recorded using 10-20 international system</p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <h4 className="font-bold mb-2">Sampling Rate</h4>
              <p className="text-sm text-gray-400">256 Hz for EEG signals</p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <h4 className="font-bold mb-2">PPG Integration</h4>
              <p className="text-sm text-gray-400">Photoplethysmography signals for cardiovascular monitoring</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400" />
          Supported Datasets
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-lg border border-cyan-500/20">
            <h4 className="text-lg font-bold mb-2">CHB-MIT Scalp EEG Database</h4>
            <p className="text-sm text-gray-400 mb-4">
              Boston Children's Hospital - MIT dataset with continuous scalp EEG recordings from pediatric subjects with intractable seizures
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-cyan-500/20 rounded text-xs text-cyan-400">Primary</span>
              <span className="px-3 py-1 bg-green-500/20 rounded text-xs text-green-400">Active</span>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg border border-purple-500/20">
            <h4 className="text-lg font-bold mb-2">TUH EEG Corpus</h4>
            <p className="text-sm text-gray-400 mb-4">
              Temple University Hospital EEG Corpus - Large-scale clinical EEG database for seizure detection research
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-purple-500/20 rounded text-xs text-purple-400">Secondary</span>
              <span className="px-3 py-1 bg-gray-500/20 rounded text-xs text-gray-400">Available</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
