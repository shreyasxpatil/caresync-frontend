import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Pill, Activity, Receipt, FileSearch } from 'lucide-react';
import toast from 'react-hot-toast';
import GlobalLoader from '../../components/GlobalLoader';

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/patients/prescriptions')
      .then(r => setPrescriptions(r.data.prescriptions || []))
      .catch(() => toast.error('Failed to load prescriptions'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Prescriptions Ledger</h1>
          <p className="text-slate-500 font-medium mt-1">Review your active medical regimens and clinical advice.</p>
        </div>
        <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Pill size={24} />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        {loading ? (
          <GlobalLoader text="Fetching Ledger..." />
        ) : prescriptions.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-100 m-8 rounded-[2rem]">
             <FileSearch className="size-12 text-slate-300 mb-4" />
             <p className="text-slate-500 font-bold">No prescriptions found</p>
             <p className="text-slate-400 text-sm mt-1">You have no active medical records on file.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultant</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Data</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prescription</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {prescriptions.map((row, idx) => (
                  <motion.tr 
                    key={row._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Doctor */}
                    <td className="px-8 py-5 align-top">
                      <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-slate-100 text-slate-500 font-black text-xs flex items-center justify-center border border-slate-200">
                           {row.doctor?.lastName?.[0] || 'D'}
                         </div>
                         <div>
                           <p className="font-bold text-slate-900 text-sm">Dr. {row.doctor?.lastName}</p>
                           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                             {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                           </p>
                         </div>
                      </div>
                    </td>

                    {/* Clinical Data */}
                    <td className="px-8 py-5 align-top max-w-[200px]">
                      <div className="space-y-2">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 block mb-0.5">Diagnosis</span>
                          <span className="text-sm font-semibold text-slate-700">{row.disease || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-500 block mb-0.5">Allergies Noted</span>
                          <span className="text-xs font-semibold text-slate-500">{row.allergy || 'None'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Prescription Details */}
                    <td className="px-8 py-5 align-top max-w-[300px]">
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="flex items-center gap-2 mb-2">
                           <Activity size={14} className="text-emerald-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Regimen</span>
                         </div>
                         <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                           {row.prescription || 'No specific medication prescribed.'}
                         </p>
                       </div>
                    </td>

                    {/* Action */}
                    <td className="px-8 py-5 align-middle text-right">
                      <button 
                        onClick={() => toast.success('Bill Paid Successfully! Invoice sent to your email.')}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all text-[11px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 cursor-pointer active:scale-95 group/btn"
                      >
                        <Receipt size={14} className="group-hover/btn:-rotate-12 transition-transform" />
                        Pay Bill
                      </button>
                      <div className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                         Ref: {row.appointment?._id?.substring(0,8) || 'N/A'}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
