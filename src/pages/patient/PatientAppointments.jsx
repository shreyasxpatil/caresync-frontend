import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, XCircle, FileText } from 'lucide-react';
import GlobalLoader from '../../components/GlobalLoader';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const r = await api.get('/patients/appointments');
      setAppointments(r.data.appointments || []);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.put(`/patients/appointments/${id}/cancel`, { cancelReason: 'Cancelled by You' });
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (err) { 
      toast.error('Failed to cancel appointment'); 
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">Pending</span>;
      case 'confirmed': return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">Confirmed</span>;
      case 'completed': return <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">Completed</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100">Cancelled</span>;
      default: return <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">Unknown</span>;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Appointments</h1>
          <p className="text-slate-500 font-medium mt-1">Track and manage your upcoming encounters.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        {loading ? (
          <GlobalLoader text="Loading Encounters..." />
        ) : appointments.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-100 m-8 rounded-[2rem]">
             <FileText className="size-12 text-slate-300 mb-4" />
             <p className="text-slate-500 font-bold">No appointments found</p>
             <p className="text-slate-400 text-sm mt-1">You haven't scheduled any consultations yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.map((row, idx) => {
                  const isCancellable = ['pending', 'confirmed'].includes(row.status);
                  
                  return (
                    <motion.tr 
                      key={row._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      {/* Doctor Info */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                           <div className="size-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                             <img src={row.doctor?.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80"} className="w-full h-full object-cover" alt="" />
                           </div>
                           <div>
                             <p className="font-bold text-slate-900 text-[15px]">Dr. {row.doctor?.lastName}</p>
                             <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">{row.doctor?.specialization}</p>
                           </div>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1.5">
                           <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
                             <Calendar size={14} className="text-slate-400" />
                             {row.appointmentDate ? new Date(row.appointmentDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBD'}
                           </div>
                           <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                             <Clock size={14} className="text-slate-300" />
                             {row.appointmentTime}
                           </div>
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="px-8 py-5">
                        <span className="font-black text-slate-900">₹{row.doctor?.consultationFee || 500}</span>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-5">
                        {getStatusBadge(row.status)}
                      </td>

                      {/* Action */}
                      <td className="px-8 py-5 text-right">
                        {isCancellable ? (
                          <button 
                            onClick={() => handleCancel(row._id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-rose-600 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all text-xs font-bold uppercase tracking-widest cursor-pointer"
                          >
                            <XCircle size={14} /> Cancel
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Locked</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
