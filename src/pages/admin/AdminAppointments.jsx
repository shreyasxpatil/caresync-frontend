import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { Search, Filter, Calendar, Clock, User, Stethoscope, FileText, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const STATUSES = ['all','pending','confirmed','completed','cancelled'];
const STATUS_STYLE = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-100'
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const q = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const r = await api.get(`/admin/appointments${q}`);
      setAppointments(r.data.appointments);
    } catch { toast.error('Failed to load clinical ledger'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/appointments/${id}`, { status });
      toast.success('Clinical status synchronized');
      fetchAppointments();
    } catch { toast.error('Synchronization failed'); }
  };

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase();
    return `${a.patient?.firstName} ${a.patient?.lastName} ${a.doctor?.firstName} ${a.doctor?.lastName}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8">
      {/* Refined Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Clinical Ledger</h1>
          <p className="text-slate-500 font-medium">Comprehensive management of all patient encounters</p>
        </div>
      </div>

      {/* Advanced Filtering Suite */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex-1 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 w-full">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 text-slate-400">
            <Search className="size-5" />
            <input 
              className="w-full bg-transparent border-none outline-none font-medium text-slate-600 placeholder:text-slate-400" 
              placeholder="Search by patient name or attending doctor..." 
              value={search} 
              onChange={e=>setSearch(e.target.value)} 
            />
          </div>
        </div>
        <div className="bg-slate-100/50 p-1.5 rounded-2xl flex items-center gap-1 w-full lg:w-auto overflow-x-auto custom-scrollbar">
          {STATUSES.map(s => (
            <button 
              key={s} 
              onClick={()=>setStatusFilter(s)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap ${
                statusFilter === s 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Modern Appointment Grid */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Case</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Attending Provider</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Schedule</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center"><div className="size-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div><p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Compiling Records...</p></td></tr>
              ) : filtered.length ? filtered.map((a, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={a._id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <User className="size-5" />
                      </div>
                      <div>
                        <div className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{a.patient?.firstName} {a.patient?.lastName}</div>
                        <div className="text-[11px] font-medium text-slate-500 italic max-w-[150px] truncate">{a.reason || 'General Inquiry'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Stethoscope className="size-4" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-slate-700">Dr. {a.doctor?.lastName}</div>
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{a.doctor?.specialization}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-900 mb-1">
                      <Calendar className="size-3.5 text-indigo-500" />
                      {a.appointmentDate ? format(new Date(a.appointmentDate), 'dd MMM, yyyy') : '—'}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                      <Clock className="size-3.5" />
                      {a.appointmentTime}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${STATUS_STYLE[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end">
                      <div className="relative inline-block w-full max-w-[140px]">
                        <select 
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                          value={a.status} 
                          onChange={e=>handleStatusChange(a._id, e.target.value)}
                        >
                          <option value="pending">Set Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="completed">Complete</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 size-3 text-slate-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No clinical encounters match these criteria</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
