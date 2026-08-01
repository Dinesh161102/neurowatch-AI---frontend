import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

export default function StatCard({ title, value, icon: Icon, trend, color = 'cyan' }) {
  const colorClasses = {
    cyan: 'text-cyan-400 border-cyan-500/30',
    purple: 'text-purple-400 border-purple-500/30',
    green: 'text-green-400 border-green-500/30',
    red: 'text-red-400 border-red-500/30',
  };

  return (
    <GlassCard data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <motion.p
            className={`text-3xl font-bold ${colorClasses[color]}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {value}
          </motion.p>
          {trend && (
            <p className="text-xs text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg border ${colorClasses[color]} bg-gradient-to-br from-${color}-500/10 to-transparent`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </GlassCard>
  );
}