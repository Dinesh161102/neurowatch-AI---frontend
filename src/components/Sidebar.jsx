import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Brain, Upload, LineChart, Zap, Cpu, 
  GitBranch, Layers, Target, Eye, FlaskConical,
  BarChart3, FileText, Settings, Users, Home,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Patients', path: '/patients', icon: Users },
  { name: 'Signal Upload', path: '/signal-upload', icon: Upload },
  { name: 'Brain Activity', path: '/brain-activity', icon: Brain },
  { name: 'Signal Visualizer', path: '/signal-visualizer', icon: Activity },
  { name: 'AI Analysis', path: '/ai-analysis', icon: Cpu },
  { name: 'Predictions', path: '/predictions', icon: Target },
  { name: 'Explainability', path: '/explainability', icon: Eye },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      data-testid="sidebar"
      className="fixed left-0 top-0 h-screen bg-[#050B1A]/95 backdrop-blur-xl border-r border-cyan-500/20 z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-transparent"
      initial={{ x: -300 }}
      animate={{ x: 0, width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 flex items-center justify-between border-b border-cyan-500/20">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <Brain className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-lg font-bold text-white">NeuroWatch</h1>
              <p className="text-xs text-cyan-400">AI Monitoring</p>
            </div>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-cyan-500/10 text-cyan-400 transition"
          data-testid="sidebar-toggle"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <motion.div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-300'
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-cyan-400' : ''}`} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 m-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20"
        >
          <Brain className="w-8 h-8 text-purple-400 mb-2" />
          <h3 className="text-sm font-bold text-white mb-1">AI Status</h3>
          <p className="text-xs text-gray-400">Model: Active</p>
          <p className="text-xs text-gray-400">Accuracy: 94.7%</p>
        </motion.div>
      )}
    </motion.aside>
  );
}