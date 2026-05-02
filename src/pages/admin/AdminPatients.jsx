import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { Search, Trash2, Eye, X, User, Mail, Phone, Calendar, MapPin, Droplet, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchPatients = async () => {
    setLoading(true);
    try { const r = await api.get('/admin/users?role=patient'); setPatients(r.data.users); }
    catch { toast.error('Failed to load patients'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this patient record?')) return;
    try { await api.delete(`/admin/users/${id}`); toast.success('Patient record deactivated'); fetchPatients(); }
    catch { toast.error('Failed to update record'); }
  };

  const filtered = patients.filter(p =>
    `${p.firstName} ${p.lastName} ${p.email} ${p.phone||''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Refined Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Patient Registry</h1>
          <p className="text-slate-500 font-medium">{patients.length} Registered active health profiles</p>
        </div>
      </div>

      {/* Advanced Search Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3 px-4 py-2 text-slate-400">
          <Search className="size-5" />
          <input 
            className="w-full bg-transparent border-none outline-none font-medium text-slate-600 placeholder:text-slate-400" 
            placeholder="Search registry by name, email or phone..." 
            value={search} 
            onChange={e=>setSearch(e.target.value)} 
          />
        </div>
      </div>

      {/* Modern Data Grid */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Profile</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical markers</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registered</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center"><div className="size-10 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div><p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Accessing Registry...</p></td></tr>
              ) : filtered.length ? filtered.map((p, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={p._id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative group/avatar">
                        <div className="size-14 rounded-2xl overflow-hidden border-2 border-white shadow-xl shadow-slate-200 group-hover/avatar:scale-110 transition-transform duration-500">
                          {p.avatar ? (
                            <img src={p.avatar} alt={p.firstName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black text-xl">
                              {p.firstName?.[0]}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 size-5 bg-white rounded-full flex items-center justify-center shadow-md">
                          <div className={`size-3 rounded-full ${p.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                        </div>
                      </div>
                      <div>
                        <div className="text-[16px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                          {p.firstName} {p.lastName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-[0.05em]">{p.gender || 'Patient'}</span>
                           <span className="text-[10px] font-bold text-slate-400 tracking-tight">PID: {p._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 tracking-tight group-hover:text-emerald-600 transition-colors">
                        <Mail className="size-3.5" /> {p.email}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                        <Phone className="size-3" /> {p.phone || 'No Contact'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                      {p.bloodGroup && (
                        <span className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          <Droplet className="size-3 fill-rose-500" /> {p.bloodGroup}
                        </span>
                      )}
                      <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${p.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                        {p.isActive ? 'Clinical Active' : 'On Leave'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[13px] font-bold text-slate-500 flex items-center gap-2">
                      <Calendar className="size-3.5" />
                      {p.createdAt ? format(new Date(p.createdAt), 'dd MMM, yy') : '—'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center">
                      <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-300">
                        <ShieldAlert className="size-4" />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={()=>setSelected(p)} className="h-10 px-4 flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all shadow-md shadow-slate-100">
                        <Eye size={14}/> <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
                      </button>
                      <button onClick={()=>handleDelete(p._id)} className="size-10 flex items-center justify-center bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No records matching your search</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Profile Overlay */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-[600px] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
                 <button onClick={()=>setSelected(null)} className="absolute top-6 right-6 size-10 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-colors"><X size={20}/></button>
              </div>
              
              <div className="px-10 pb-10 -mt-12 relative z-10">
                <div className="flex items-end gap-6 mb-8">
                   <div className="size-28 rounded-[2.2rem] bg-white p-1.5 shadow-2xl -mt-16 relative z-20 border border-slate-100">
                      <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50">
                        {selected.avatar ? (
                          <img src={selected.avatar} alt={selected.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black text-4xl">
                            {selected.firstName?.[0]}
                          </div>
                        )}
                      </div>
                   </div>
                   <div className="pb-2">
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{selected.firstName} {selected.lastName}</h2>
                      <p className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em]">{selected.isActive ? 'Active Member' : 'Deactivated'}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Droplet className="size-5 text-rose-500" />
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Type</div>
                      <div className="text-sm font-black text-slate-900">{selected.bloodGroup || 'Not Recorded'}</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <ShieldAlert className="size-5 text-amber-500" />
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Alerts</div>
                      <div className="text-sm font-black text-slate-900">{selected.allergies ? 'Present' : 'None'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Mail, label: 'Email', value: selected.email },
                    { icon: Phone, label: 'Contact', value: selected.phone },
                    { icon: MapPin, label: 'Address', value: selected.address },
                    { icon: Calendar, label: 'Member Since', value: selected.createdAt ? format(new Date(selected.createdAt), 'dd MMMM, yyyy') : '—' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                      <div className="size-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <item.icon className="size-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</div>
                        <div className="text-sm font-bold text-slate-700 leading-tight">{item.value || 'Not provided'}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={()=>setSelected(null)} className="w-full mt-10 bg-slate-900 text-white font-black uppercase tracking-widest text-[12px] py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
