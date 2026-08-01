import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock } from 'lucide-react';
import Brain3D from '@/components/three/Brain3D';
import NeuralParticles from '@/components/animations/NeuralParticles';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050B1A] text-white overflow-hidden flex items-center justify-center">
      <NeuralParticles />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="h-[500px] relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl" />
            <Brain3D />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-8 shadow-2xl"
            data-testid="login-card"
          >
            <div className="flex items-center gap-3 mb-8">
              <Brain className="w-10 h-10 text-cyan-400" />
              <div>
                <h1 className="text-2xl font-bold">NeuroWatch AI</h1>
                <p className="text-sm text-cyan-400">Medical AI Platform</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-400 mb-8">Sign in to access the neuroscience monitoring platform</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 transition"
                    placeholder="doctor@neurowatch.ai"
                    data-testid="login-email-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 transition"
                    placeholder="Enter your password"
                    data-testid="login-password-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-cyan-500/30" />
                  <span className="text-sm text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 font-bold transition shadow-lg shadow-cyan-500/50"
                data-testid="login-submit-button"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-3 rounded-lg border-2 border-cyan-500 hover:bg-cyan-500/10 font-bold transition"
                data-testid="demo-login-button"
              >
                Demo Login
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Don't have an account?{' '}
              <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium transition">
                Contact Admin
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}