import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  MessageSquare,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const STATUS_STYLE = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-100'
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="size-12 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Initializing Dashboard...</p>
      </div>
    );
  }

  const { stats, recentAppointments } = data || {};

  const statCards = [
    { label: 'Total Patients', value: stats?.totalPatients ?? 0, icon: Users, color: 'emerald', link: '/admin/patients' },
    { label: 'Total Doctors', value: stats?.totalDoctors ?? 0, icon: Stethoscope, color: 'blue', link: '/admin/doctors' },
    { label: 'Appointments', value: stats?.totalAppointments ?? 0, icon: Calendar, color: 'indigo', link: '/admin/appointments' },
    { label: 'Unread Messages', value: stats?.unreadMessages ?? 0, icon: MessageSquare, color: 'rose', link: '/admin/messages' },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">System Analytics</h1>
          <p className="text-slate-500 font-medium">Real-time clinical performance and patient flow metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl text-emerald-700 border border-emerald-100">
          <ArrowUpRight className="size-4" />
          <span className="text-sm font-black uppercase tracking-tight">+12% Growth</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link to={s.link} className="block no-underline group">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="flex flex-col gap-4">
                  <div className={`size-12 rounded-2xl flex items-center justify-center transition-colors ${
                    s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                    s.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    s.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                    'bg-rose-50 text-rose-600'
                  }`}>
                    <s.icon className="size-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">{s.label}</div>
                    <div className="text-3xl font-black text-slate-900">{s.value}</div>
                  </div>
                </div>
                {/* Subtle Background Pattern */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12">
                   <s.icon className="size-24" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments Table */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Activity className="size-5 text-emerald-600" />
              Recent Appointments
            </h2>
            <Link to="/admin/appointments" className="text-xs font-black text-emerald-600 uppercase tracking-widest no-underline hover:underline">View Ledger</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentAppointments?.length ? recentAppointments.map(a => (
                  <tr key={a._id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                          {a.patient?.firstName?.charAt(0)}{a.patient?.lastName?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 uppercase tracking-tight">{a.patient?.firstName} {a.patient?.lastName}</div>
                          <div className="text-[11px] font-medium text-slate-500">
                            {a.appointmentDate ? format(new Date(a.appointmentDate), 'dd MMM, yyyy') : 'No Date'} • {a.appointmentTime}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-700 uppercase tracking-tight">Dr. {a.doctor?.lastName}</div>
                      <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{a.doctor?.specialization}</div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${STATUS_STYLE[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No active cases</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Secondary Stats */}
        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Network Health</div>
                <div className="text-4xl font-black mb-2 tracking-tighter">99.8%</div>
                <p className="text-slate-400 text-sm font-medium mb-6">Clinical systems operating with optimal latency.</p>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '99.8%' }}
                     transition={{ duration: 1.5 }}
                     className="h-full bg-emerald-500" 
                   />
                </div>
              </div>
              <Activity className="absolute -right-8 -bottom-8 size-48 text-white/5 group-hover:scale-110 transition-transform duration-700" />
           </div>

           <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white">
              <div className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.2em] mb-4">Quick Insights</div>
              <div className="space-y-4">
                {[
                  { label: 'Completed', value: stats?.completedAppointments ?? 0, total: stats?.totalAppointments ?? 1 },
                  { label: 'Pending', value: stats?.pendingAppointments ?? 0, total: stats?.totalAppointments ?? 1 }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                      <span>{item.label}</span>
                      <span>{Math.round((item.value / item.total) * 100)}%</span>
                    </div>
                    <div className="h-1 w-full bg-emerald-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / item.total) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-white" 
                      />
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
