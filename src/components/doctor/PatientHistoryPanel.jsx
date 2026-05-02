import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function PatientHistoryPanel({ isOpen, onClose, patient }) {
  const navigate = useNavigate();

  const handleGeneratePrescription = () => {
    navigate('/doctor/prescriptions', { state: { patientId: patient?._id } });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[55] cursor-pointer"
          />
          
          {/* Sliding Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full md:w-[420px] bg-white z-[60] shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-border-structural flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-border-structural flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                  <img 
                    alt={patient?.firstName || "Patient"} 
                    className="w-full h-full object-cover bg-background" 
                    loading="lazy"
                    src={patient?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=75&fm=webp"} 
                  />
                </div>
                <div>
                  <h2 className="font-headline-md text-headline-md text-text-primary">
                    {patient?.firstName} {patient?.lastName}
                  </h2>
                  <p className="text-xs font-label text-slate-500">{patient?.gender || 'Unknown'} • {patient?.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : '--'} Years Old</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 hide-scrollbar">
              
              {/* Chronic Conditions (Stub) */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-label mb-4">Chronic Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-100 italic font-serif">Asthma</span>
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">Mild Hypertension</span>
                </div>
              </div>

              {/* Recent Vitals Bento Style (Stub) */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-label mb-4">Recent Vitals (Last 24h)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background border border-border-structural rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase tracking-tight">Blood Pressure</p>
                    <p className="text-xl font-bold text-text-primary mt-1">128/84</p>
                    <p className="text-[10px] text-emerald-600 font-bold">Stable</p>
                  </div>
                  <div className="p-4 bg-background border border-border-structural rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase tracking-tight">Heart Rate</p>
                    <p className="text-xl font-bold text-text-primary mt-1">72 <span className="text-xs font-normal text-slate-400">bpm</span></p>
                    <p className="text-[10px] text-emerald-600 font-bold">Normal</p>
                  </div>
                  <div className="p-4 bg-background border border-border-structural rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase tracking-tight">Temp</p>
                    <p className="text-xl font-bold text-text-primary mt-1">98.6<span className="text-xs font-normal text-slate-400">°F</span></p>
                    <p className="text-[10px] text-emerald-600 font-bold">Optimal</p>
                  </div>
                  <div className="p-4 bg-background border border-border-structural rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase tracking-tight">SpO2</p>
                    <p className="text-xl font-bold text-text-primary mt-1">99<span className="text-xs font-normal text-slate-400">%</span></p>
                    <p className="text-[10px] text-emerald-600 font-bold">Excellent</p>
                  </div>
                </div>
              </div>

              {/* Clinical Notes Area (Stub) */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-label mb-4">Doctor's Private Notes</h4>
                <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "Patient reports increased fatigue over the last 3 days. Albuterol usage has slightly increased. Need to review pulmonary function test results from last month."
                  </p>
                </div>
              </div>

            </div>

            {/* Sticky Footer Action */}
            <div className="p-8 border-t border-border-structural bg-white">
              <button 
                onClick={handleGeneratePrescription}
                className="w-full bg-primary text-white py-4 rounded-lg font-button text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-95 shadow-md active:translate-y-0.5 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">edit_document</span>
                Generate Prescription
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
