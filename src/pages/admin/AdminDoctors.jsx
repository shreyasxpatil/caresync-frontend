import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, X, Edit2, Trash2, Search, User, Mail, Phone, MapPin, Briefcase, GraduationCap, DollarSign, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalLoader from '../../components/GlobalLoader';

const INITIAL_FORM = {
  firstName:'', lastName:'', email:'', password:'', phone:'', gender:'',
  specialization:'', qualifications:'', experience:'', consultationFee:'',
  availableDays:[], availableTimeStart:'09:00', availableTimeEnd:'17:00',
};

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const SPECS = ['Cardiologist','Dermatologist','Neurologist','Orthopedic','Pediatrician','General Physician','ENT Specialist','Ophthalmologist','Psychiatrist','Gynecologist'];

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchDoctors = async () => {
    setLoading(true);
    try { const r = await api.get('/admin/users?role=doctor'); setDoctors(r.data.users); }
    catch { toast.error('Failed to load doctors'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleDayToggle = (day) => {
    setForm(f => ({ ...f, availableDays: f.availableDays.includes(day) ? f.availableDays.filter(d => d !== day) : [...f.availableDays, day] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) { await api.put(`/admin/users/${editId}`, form); toast.success('Doctor updated!'); }
      else { await api.post('/admin/doctors', form); toast.success('Doctor created!'); }
      setShowModal(false); setForm(INITIAL_FORM); setEditId(null);
      fetchDoctors();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving doctor'); }
    finally { setSaving(false); }
  };

  const handleEdit = (doc) => {
    setForm({ firstName:doc.firstName, lastName:doc.lastName, email:doc.email, password:'', phone:doc.phone||'', gender:doc.gender||'', specialization:doc.specialization||'', qualifications:doc.qualifications||'', experience:doc.experience||'', consultationFee:doc.consultationFee||'', availableDays:doc.availableDays||[], availableTimeStart:doc.availableTimeStart||'09:00', availableTimeEnd:doc.availableTimeEnd||'17:00' });
    setEditId(doc._id); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this doctor?')) return;
    try { await api.delete(`/admin/users/${id}`); toast.success('Doctor deactivated'); fetchDoctors(); }
    catch { toast.error('Failed to deactivate'); }
  };

  const filtered = doctors.filter(d => `${d.firstName} ${d.lastName} ${d.email} ${d.specialization}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Refined Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Medical Directory</h1>
          <p className="text-slate-500 font-medium">{doctors.length} Board-certified specialists registered</p>
        </div>
        <button 
          onClick={() => { setForm(INITIAL_FORM); setEditId(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all w-full md:w-auto justify-center"
        >
          <Plus className="size-4" />
          Add Specialist
        </button>
      </div>

      {/* Advanced Search Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3 px-4 py-2 text-slate-400">
          <Search className="size-5" />
          <input 
            className="w-full bg-transparent border-none outline-none font-medium text-slate-600 placeholder:text-slate-400" 
            placeholder="Filter by name, specialty, or email..." 
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
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Practitioner</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Specialty</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Experience</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Consultation</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6}><GlobalLoader text="Querying Directory..." /></td></tr>
              ) : filtered.length ? filtered.map((d, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={d._id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-50">
                        {d.firstName?.[0]}{d.lastName?.[0]}
                      </div>
                      <div>
                        <div className="text-[15px] font-black text-slate-900 uppercase tracking-tight">Dr. {d.firstName} {d.lastName}</div>
                        <div className="text-[12px] font-medium text-slate-500">{d.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                      {d.specialization||'General'}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-700 text-sm">
                    {d.experience ? `${d.experience} Years` : '—'}
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 text-sm italic">
                    {d.consultationFee ? `₹${d.consultationFee}` : 'FREE'}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className={`size-3 rounded-full mx-auto ${d.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-3">
                      <button onClick={()=>handleEdit(d)} className="size-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"><Edit2 size={16}/></button>
                      <button onClick={()=>handleDelete(d._id)} className="size-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No practitioners matched your filter</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-[800px] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editId ? 'Modify Credentials' : 'Onboard New Specialist'}</h2>
                  <p className="text-sm font-medium text-slate-500 italic">Enter clinical and professional background information</p>
                </div>
                <button onClick={()=>setShowModal(false)} className="size-12 flex items-center justify-center bg-white rounded-2xl hover:bg-slate-100 transition-colors shadow-sm"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
                {/* Personal Section */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600">
                     <User className="size-4" /> Personal Information
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} required />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} required />
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} {...(!editId&&{required:true})} placeholder={editId ? '••••••••' : 'Set password'} />
                     </div>
                   </div>
                </div>

                {/* Professional Section */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600">
                     <Briefcase className="size-4" /> Professional Background
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Clinical Specialty</label>
                       <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none appearance-none" value={form.specialization} onChange={e=>setForm({...form,specialization:e.target.value})} required>
                         <option value="">Select Specialty</option>
                         {SPECS.map(s=><option key={s}>{s}</option>)}
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Academic Qualifications</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" value={form.qualifications} onChange={e=>setForm({...form,qualifications:e.target.value})} placeholder="e.g. MBBS, MD (Cardiology)" />
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Years of Practice</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" type="number" value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Consultation Fee (₹)</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" type="number" value={form.consultationFee} onChange={e=>setForm({...form,consultationFee:e.target.value})} />
                     </div>
                   </div>
                </div>

                {/* Availability Section */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600">
                     <Clock className="size-4" /> Duty Scheduling
                   </div>
                   <div className="space-y-3">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Active Duty Days</label>
                     <div className="flex flex-wrap gap-2">
                       {DAYS.map(day=>(
                         <button type="button" key={day} onClick={()=>handleDayToggle(day)}
                           className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${
                             form.availableDays.includes(day) 
                               ? 'bg-emerald-600 text-white border-emerald-600' 
                               : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                           }`}
                         >
                           {day.slice(0,3)}
                         </button>
                       ))}
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                     <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Shift Start</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" type="time" value={form.availableTimeStart} onChange={e=>setForm({...form,availableTimeStart:e.target.value})} />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Shift End</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" type="time" value={form.availableTimeEnd} onChange={e=>setForm({...form,availableTimeEnd:e.target.value})} />
                     </div>
                   </div>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <button type="button" className="flex-1 bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-[12px] py-4 rounded-2xl hover:bg-slate-200 transition-all" onClick={()=>setShowModal(false)}>Cancel</button>
                  <button type="submit" className="flex-[2] bg-emerald-600 text-white font-black uppercase tracking-widest text-[12px] py-4 rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all disabled:opacity-50" disabled={saving}>
                    {saving ? 'Processing...' : editId ? 'Commit Changes' : 'Initialize Specialist'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
