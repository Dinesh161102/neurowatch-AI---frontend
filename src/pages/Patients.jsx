import { motion } from 'framer-motion';
import { Users, Activity, AlertCircle } from 'lucide-react';
import GlassCard from '@/components/medical/GlassCard';
import { patientData } from '@/data/mockData';

export default function Patients() {
  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'active': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-green-400 bg-green-500/20 border-green-500/30';
    }
  };

  return (
    <div className="p-8 space-y-8" data-testid="patients-page">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">Patient Management</h1>
          <p className="text-gray-400">Monitor and manage patient seizure history</p>
        </div>
        <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 font-bold transition"
          data-testid="add-patient-button">
          + Add Patient
        </button>
      </motion.div>

      <div className="grid gap-4">
        {patientData.map((patient, index) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hover={true}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{patient.name}</h3>
                    <p className="text-sm text-gray-400">
                      {patient.age} years • {patient.gender === 'M' ? 'Male' : 'Female'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <Activity className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-cyan-400">{patient.seizureHistory}</p>
                    <p className="text-xs text-gray-400">Total Seizures</p>
                  </div>

                  <div className="text-center">
                    <AlertCircle className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <p className="text-sm font-bold text-purple-400">{patient.lastSeizure}</p>
                    <p className="text-xs text-gray-400">Last Seizure</p>
                  </div>

                  <div className={`px-4 py-2 rounded-lg border ${getStatusColor(patient.status)}`}>
                    <p className="font-bold uppercase text-sm">{patient.status}</p>
                  </div>

                  <button className="px-6 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 text-cyan-400 font-medium transition"
                    data-testid={`view-patient-${patient.id}`}>
                    View Details
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
