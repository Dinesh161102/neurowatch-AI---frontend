import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Zap, Brain, Database, Cpu, Search, Layers, 
  GitMerge, Target, Eye, ShieldCheck, BarChart4, Play, 
  CheckCircle2, ChevronRight, Server
} from 'lucide-react';

const pipelineStages = [
  { id: 1, title: 'EEG + PPG Acquisition', desc: 'Real-time multi-modal biosignal collection from patient sensors.', icon: Database, inputs: ['Patient Biosensors'], outputs: ['Raw Multi-channel Signals'] },
  { id: 2, title: 'Preprocessing', desc: 'Noise reduction, artifact removal, and bandpass filtering.', icon: Activity, inputs: ['Raw Signals'], outputs: ['Clean Signals'] },
  { id: 3, title: 'Segmentation & Labeling', desc: 'Windowing signals into distinct 2-second epochs.', icon: Layers, inputs: ['Clean Signals'], outputs: ['Signal Epochs (2s)'] },
  { id: 4, title: 'Temporal Neural Network', desc: 'Initial spatio-temporal feature extraction with Attention.', icon: Cpu, inputs: ['Signal Epochs'], outputs: ['Baseline Weights'] },
  { id: 5, title: 'Explainability Analysis', desc: 'Extracting feature importance to identify key regions.', icon: Search, inputs: ['Baseline Weights'], outputs: ['Channel Importance Scores'] },
  { id: 6, title: 'Channel Selection (23 → 8)', desc: 'Optimizing inputs by pruning redundant EEG channels.', icon: GitMerge, inputs: ['Importance Scores'], outputs: ['8 Core Channels'] },
  { id: 7, title: 'Retraining with 8 Channels', desc: 'Training the optimized model on the reduced channel set.', icon: Server, inputs: ['8 Core Channels'], outputs: ['Optimized Model'] },
  { id: 8, title: 'Adaptive EEG-PPG Fusion', desc: 'Dynamic weighting of modalities based on signal quality.', icon: Zap, inputs: ['EEG Features', 'PPG Features'], outputs: ['Fused Feature Vector'] },
  { id: 9, title: 'Prediction Generation', desc: 'Classifying brain state: Normal, Preictal, or Seizure.', icon: Target, inputs: ['Fused Features'], outputs: ['Class Predictions', 'Confidence'] },
  { id: 10, title: 'Explainability Output', desc: 'Generating attention heatmaps and interpretability summaries.', icon: Eye, inputs: ['Predictions'], outputs: ['Visual Explanations'] },
  { id: 11, title: 'LOSO Validation', desc: 'Leave-One-Subject-Out cross-patient clinical validation.', icon: ShieldCheck, inputs: ['Optimized Model', 'Test Cohort'], outputs: ['Cross-Patient Scores'] },
  { id: 12, title: 'Performance Evaluation', desc: 'Calculating final clinical metrics (Accuracy, Sensitivity, AUC).', icon: BarChart4, inputs: ['Cross-Patient Scores'], outputs: ['Final Clinical Report'] }
];

export default function AIAnalysis() {
  const [activeStage, setActiveStage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play the pipeline animation
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStage(prev => (prev % pipelineStages.length) + 1);
      }, 3000); // Progress every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-[#050B1A] text-white p-8 pl-10 md:pl-8 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center gap-3">
            <Brain className="w-8 h-8 text-cyan-400" />
            AI Analysis Pipeline
          </h1>
          <p className="text-gray-400 mt-2">Comprehensive 12-stage neuroscience machine learning workflow.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30 transition-all font-medium"
          >
            {isPlaying ? (
              <><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"/> Pause Pipeline</>
            ) : (
              <><Play className="w-4 h-4"/> Resume Pipeline</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle: The Vertical Pipeline */}
        <div className="lg:col-span-2 bg-[#0A1128] border border-cyan-900/30 rounded-2xl p-8 relative overflow-hidden">
          {/* Holographic background grid */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-screen" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-0">
            {pipelineStages.map((stage, index) => {
              const isActive = stage.id === activeStage;
              const isPast = stage.id < activeStage;
              const Icon = stage.icon;
              
              return (
                <div key={stage.id} className="relative flex items-start group">
                  
                  {/* Vertical Line Connecting Nodes */}
                  {index !== pipelineStages.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-[-14px] w-0.5 bg-slate-800/80">
                      {/* Flowing animated particle if active or past */}
                      {(isPast || isActive) && (
                        <motion.div 
                          className="w-0.5 h-full bg-gradient-to-b from-cyan-400 to-purple-500"
                          initial={{ scaleY: 0, originY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 1 }}
                        />
                      )}
                      {/* Neural Impulse Particle */}
                      {isPlaying && isActive && (
                        <motion.div
                          className="absolute top-0 left-[-3px] w-2 h-4 rounded-full bg-cyan-300 shadow-[0_0_10px_3px_rgba(34,211,238,0.8)]"
                          animate={{ y: [0, 80] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </div>
                  )}

                  {/* Stage Node */}
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 bg-[#0A1128] shrink-0 mt-2 cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: isActive ? '#22d3ee' : isPast ? '#a855f7' : '#1e293b',
                      boxShadow: isActive ? '0 0 20px rgba(34,211,238,0.4)' : 'none'
                    }}
                    onClick={() => setActiveStage(stage.id)}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : isPast ? 'text-purple-400' : 'text-slate-600'}`} />
                  </div>

                  {/* Stage Content */}
                  <div className={`ml-6 p-5 rounded-xl border transition-all duration-300 w-full mb-6 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-900/40 to-[#0A1128] border-cyan-500/50 shadow-lg shadow-cyan-900/20' 
                      : isPast 
                        ? 'bg-[#0f172a]/50 border-purple-900/30' 
                        : 'bg-[#0f172a]/30 border-slate-800/50 opacity-60'
                  }`}
                  onClick={() => setActiveStage(stage.id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className={`font-bold text-lg ${isActive ? 'text-cyan-300' : isPast ? 'text-gray-300' : 'text-slate-500'}`}>
                        <span className="text-xs font-mono mr-2 opacity-60">STG.{stage.id.toString().padStart(2, '0')}</span>
                        {stage.title}
                      </h3>
                      {isPast && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-4">{stage.desc}</p>
                    
                    {isActive && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-col sm:flex-row gap-4 pt-3 border-t border-cyan-900/30"
                      >
                        <div className="flex-1">
                          <span className="text-[10px] uppercase tracking-wider text-cyan-500 font-bold block mb-1">Inputs</span>
                          <div className="flex gap-2 flex-wrap">
                            {stage.inputs.map((inp, i) => (
                              <span key={i} className="text-xs bg-slate-800/80 text-cyan-100 px-2 py-1 rounded border border-cyan-900/50">{inp}</span>
                            ))}
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center text-cyan-600">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] uppercase tracking-wider text-purple-500 font-bold block mb-1">Outputs</span>
                          <div className="flex gap-2 flex-wrap">
                            {stage.outputs.map((out, i) => (
                              <span key={i} className="text-xs bg-slate-800/80 text-purple-100 px-2 py-1 rounded border border-purple-900/50">{out}</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Validation & Performance Cards */}
        <div className="space-y-6">
          <div className="bg-[#0A1128] border border-cyan-900/30 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="w-24 h-24 text-cyan-400" />
             </div>
             <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
               LOSO Validation
             </h3>
             <p className="text-xs text-cyan-400 mb-6">Leave-One-Subject-Out Cross Validation</p>
             
             <div className="space-y-4 relative z-10">
               {['Patient 1 (Test)', 'Patient 2 (Test)', 'Patient 3 (Test)'].map((p, i) => (
                 <div key={i} className="bg-[#0f172a] rounded-lg p-3 border border-slate-800">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-sm font-medium text-gray-300">{p}</span>
                     <span className="text-xs text-cyan-400 bg-cyan-900/30 px-2 py-0.5 rounded">Fold {i+1}</span>
                   </div>
                   <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1">
                     <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full" style={{ width: `${92 - i*1.5}%` }}></div>
                   </div>
                   <div className="flex justify-end">
                     <span className="text-[10px] text-gray-500">{(92 - i*1.5).toFixed(1)}% Acc</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="bg-[#0A1128] border border-cyan-900/30 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <BarChart4 className="w-24 h-24 text-purple-400" />
             </div>
             <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
               Performance Evaluation
             </h3>
             <p className="text-xs text-purple-400 mb-6">Final Pipeline Metrics</p>
             
             <div className="grid grid-cols-2 gap-4 relative z-10">
               <div className="bg-gradient-to-br from-cyan-900/20 to-transparent border border-cyan-800/30 rounded-xl p-4 text-center">
                 <div className="text-2xl font-bold text-cyan-400 mb-1">94.7%</div>
                 <div className="text-xs text-gray-400 uppercase tracking-wider">Accuracy</div>
               </div>
               <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-800/30 rounded-xl p-4 text-center">
                 <div className="text-2xl font-bold text-purple-400 mb-1">93.2%</div>
                 <div className="text-xs text-gray-400 uppercase tracking-wider">Sensitivity</div>
               </div>
               <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-800/30 rounded-xl p-4 text-center">
                 <div className="text-2xl font-bold text-blue-400 mb-1">96.1%</div>
                 <div className="text-xs text-gray-400 uppercase tracking-wider">Specificity</div>
               </div>
               <div className="bg-gradient-to-br from-emerald-900/20 to-transparent border border-emerald-800/30 rounded-xl p-4 text-center">
                 <div className="text-2xl font-bold text-emerald-400 mb-1">0.96</div>
                 <div className="text-xs text-gray-400 uppercase tracking-wider">ROC AUC</div>
               </div>
             </div>

             <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
               <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                 <Target className="w-4 h-4 text-cyan-500" />
                 Model Confidence Score
               </div>
               <div className="flex items-end gap-2">
                 <span className="text-3xl font-bold text-white">High</span>
                 <span className="text-sm text-emerald-400 mb-1">Ready for clinical use</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
