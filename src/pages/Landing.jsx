import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Activity, Zap, Target, Shield, Eye } from 'lucide-react';
import Brain3D from '@/components/three/Brain3D';
import NeuralParticles from '@/components/animations/NeuralParticles';
import GlassCard from '@/components/medical/GlassCard';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Real-Time Brain Monitoring',
      description: 'Continuous EEG and PPG signal analysis for seizure detection'
    },
    {
      icon: Activity,
      title: 'Multi-Class Detection',
      description: 'Classify Normal, Preictal, and Seizure states with 94.7% accuracy'
    },
    {
      icon: Zap,
      title: 'Adaptive EEG-PPG Fusion',
      description: 'Dynamic weight allocation between neural and cardiovascular signals'
    },
    {
      icon: Target,
      title: 'Channel Selection',
      description: 'Reduced from 23 to 8 channels using advanced AI feature selection'
    },
    {
      icon: Eye,
      title: 'Explainable AI',
      description: 'AI-based interpretability for transparent clinical decisions'
    },
    {
      icon: Shield,
      title: 'Cross-Patient Validation',
      description: 'LOSO validation ensures generalization across diverse patients'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050B1A] text-white overflow-hidden">
      <NeuralParticles />
      
      <div className="relative z-10">
        <nav className="fixed top-0 w-full backdrop-blur-xl bg-[#050B1A]/80 border-b border-cyan-500/20 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold">NeuroWatch AI</span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 font-medium transition"
              data-testid="nav-login-button"
            >
              Login
            </button>
          </div>
        </nav>

        <section className="min-h-screen flex items-center justify-center pt-20 px-6">
          <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                AI-Powered
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  Explainable
                </span>
                Epileptic Seizure Detection
              </h1>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Combining Neuroscience, Deep Learning and Explainable AI for Real-Time Brain Monitoring
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 font-bold text-lg transition shadow-lg shadow-cyan-500/50"
                  data-testid="hero-get-started-button"
                >
                  Get Started
                </button>
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 rounded-xl border-2 border-cyan-500 hover:bg-cyan-500/10 font-bold text-lg transition"
                  data-testid="learn-more-button"
                >
                  Learn More
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="h-[560px] sm:h-[640px] lg:h-[700px] xl:h-[760px] relative overflow-visible"
            >
              <Brain3D />
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Key Features</h2>
              <p className="text-xl text-gray-400">Advanced neuroscience AI capabilities</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard>
                    <feature.icon className="w-12 h-12 text-cyan-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>



        <footer className="py-8 px-6 border-t border-cyan-500/20">
          <div className="max-w-7xl mx-auto text-center text-gray-400">
            <p>© 2026 NeuroWatch AI. Advanced Neuroscience Monitoring Platform.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}