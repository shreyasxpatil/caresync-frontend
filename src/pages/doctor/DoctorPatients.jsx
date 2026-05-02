import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { 
  Users, 
  Phone, 
  Droplet, 
  Search, 
  ArrowUpRight, 
  MoreHorizontal, 
  History, 
  FileEdit,
  ShieldAlert,
  Mail,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PatientHistoryPanel from '../../components/doctor/PatientHistoryPanel';

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/doctors/me/patients')
      .then(r => setPatients(r.data.patients || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p => 
    `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openHistory = (patient) => {
    setSelectedPatient(patient);
    setIsPanelOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="size-12 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">Synchronizing Patient Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Clinical Network</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Users className="size-4 text-emerald-600" />
            Managing {patients.length} active patient profiles under your care
          </p>
        </div>
        
        <div className="relative group min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium text-slate-600 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Patients Grid */}
      {filtered.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={p._id}
                className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
              >
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-[4rem] -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" />
                
                <div className="relative z-10 space-y-6">
                  {/* Top Bar: Avatar & Identity */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-16 rounded-[1.5rem] overflow-hidden border-2 border-white shadow-xl shadow-slate-100 relative group/avatar">
                        {p.avatar ? (
                          <img src={p.avatar} alt={p.firstName} className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black text-xl">
                            {p.firstName?.[0]}{p.lastName?.[0]}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{p.firstName} {p.lastName}</h3>
                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mt-1 bg-emerald-50 px-2 py-0.5 rounded w-fit">{p.gender || 'Patient'}</p>
                      </div>
                    </div>
                    <button className="size-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                      <MoreHorizontal className="size-5" />
                    </button>
                  </div>

                  {/* Clinical Indicators */}
                  <div className="flex items-center gap-3">
                    {p.bloodGroup && (
                      <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl border border-rose-100 text-[10px] font-black uppercase tracking-widest">
                        <Droplet className="size-3 fill-rose-500" /> {p.bloodGroup}
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100 text-[10px] font-black uppercase tracking-widest">
                      <ShieldAlert className="size-3" /> No Allergies
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 py-4 border-y border-slate-50">
                    <div className="flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                      <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <Phone className="size-3.5" />
                      </div>
                      <span className="text-[13px] font-bold tracking-tight">{p.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                      <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <Mail className="size-3.5" />
                      </div>
                      <span className="text-[13px] font-bold tracking-tight truncate">{p.email}</span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => openHistory(p)}
                      className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-100 active:scale-95"
                    >
                      <History className="size-3.5" /> View History
                    </button>
                    <button 
                      onClick={() => navigate('/doctor/prescriptions', { state: { patientId: p._id } })}
                      className="size-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-md shadow-emerald-50 active:scale-95"
                      title="Quick Prescription"
                    >
                      <FileEdit className="size-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
           <div className="size-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
              <Users className="size-10 text-slate-300" />
           </div>
           <h3 className="text-xl font-black text-slate-900">No active cases found</h3>
           <p className="text-slate-400 font-medium mt-2">Adjust your search parameters or check upcoming bookings.</p>
        </div>
      )}

      {/* Global Clinical Panel Overlay */}
      <PatientHistoryPanel 
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        patient={selectedPatient}
      />
    </div>
  );
}
