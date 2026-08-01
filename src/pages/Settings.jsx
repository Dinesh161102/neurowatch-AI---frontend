import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, User } from 'lucide-react';
import GlassCard from '@/components/medical/GlassCard';

export default function Settings() {
  return (
    <div className="p-8 space-y-8" data-testid="settings-page">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Configure your NeuroWatch AI platform</p>
      </motion.div>

      <div className="grid gap-6">
        <GlassCard hover={false}>
          <div className="flex items-center gap-4 mb-6">
            <User className="w-8 h-8 text-cyan-400" />
            <h3 className="text-xl font-bold">User Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
              <input type="text" className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white" placeholder="Dr. John Smith" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <input type="email" className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white" placeholder="doctor@neurowatch.ai" />
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center gap-4 mb-6">
            <Bell className="w-8 h-8 text-purple-400" />
            <h3 className="text-xl font-bold">Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Seizure Detection Alerts', enabled: true },
              { label: 'System Status Updates', enabled: true },
              { label: 'Email Notifications', enabled: false },
              { label: 'SMS Alerts', enabled: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 bg-[#0A1628]/50 rounded-lg border border-cyan-500/20">
                <span className="text-gray-300">{item.label}</span>
                <button className={`w-12 h-6 rounded-full transition ${
                  item.enabled ? 'bg-cyan-500' : 'bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition transform ${
                    item.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-8 h-8 text-green-400" />
            <h3 className="text-xl font-bold">Security</h3>
          </div>
          <div className="space-y-4">
            <button className="w-full px-6 py-3 bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 rounded-lg text-cyan-400 font-medium transition text-left">
              Change Password
            </button>
            <button className="w-full px-6 py-3 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 rounded-lg text-purple-400 font-medium transition text-left">
              Two-Factor Authentication
            </button>
            <button className="w-full px-6 py-3 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 rounded-lg text-red-400 font-medium transition text-left">
              Session Management
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
