import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      className={`backdrop-blur-lg bg-white/5 border border-cyan-500/20 rounded-xl p-6 shadow-2xl ${
        hover ? 'hover:border-cyan-500/40 hover:bg-white/10' : ''
      } ${className}`}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}