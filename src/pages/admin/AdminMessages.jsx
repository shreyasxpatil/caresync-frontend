import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Mail, CheckCircle, Clock, User, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try { const r = await api.get('/admin/messages'); setMessages(r.data.messages); }
    catch { toast.error('Failed to sync communications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/admin/messages/${id}/read`);
      toast.success('Query marked as processed');
      fetchMessages();
      setSelected(null);
    } catch { toast.error('Update failed'); }
  };

  const unreadCount = messages.filter(m=>!m.isRead).length;

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6">
      {/* Refined Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Message Center</h1>
          <p className="text-slate-500 font-medium">Monitoring {messages.length} incoming patient and public inquiries</p>
        </div>
        {unreadCount > 0 && (
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest">{unreadCount} New Inquiries</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Inbox List */}
        <div className="w-[400px] flex flex-col gap-3 overflow-y-auto pr-4 custom-scrollbar">
          {loading ? (
             <div className="space-y-4">
               {[1,2,3].map(i => (
                 <div key={i} className="h-32 bg-slate-50 rounded-3xl animate-pulse border border-slate-100" />
               ))}
             </div>
          ) : messages.length ? messages.map((m, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={m._id} 
              onClick={()=>setSelected(m)}
              className={`p-6 rounded-[2rem] border transition-all cursor-pointer relative group ${
                selected?._id === m._id 
                  ? 'bg-white border-emerald-200 shadow-xl shadow-emerald-50 ring-2 ring-emerald-500/5' 
                  : !m.isRead 
                    ? 'bg-white border-slate-100 shadow-md hover:border-emerald-100' 
                    : 'bg-slate-50/50 border-transparent opacity-70 hover:opacity-100 hover:bg-white hover:border-slate-100'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="text-[13px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[180px]">{m.name}</div>
                {!m.isRead && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest">New</span>
                )}
              </div>
              <div className="text-[12px] font-bold text-emerald-600 mb-2 truncate uppercase tracking-wide">{m.subject}</div>
              <div className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed mb-4">{m.message}</div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
                 <Clock className="size-3" />
                 {format(new Date(m.createdAt), 'dd MMM • HH:mm')}
              </div>
            </motion.div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 grayscale opacity-50">
               <Mail size={64} strokeWidth={1} />
               <p className="font-black uppercase tracking-[0.2em] text-xs">No Messages Found</p>
            </div>
          )}
        </div>

        {/* Reading Pane */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div 
                key={selected._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white h-full rounded-[3rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden"
              >
                <div className="p-10 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex items-center gap-3 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    <MessageCircle className="size-4" /> Message Detail
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">{selected.subject}</h2>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <User className="size-4 text-slate-400" />
                       <span className="text-sm font-bold text-slate-700">{selected.name}</span>
                    </div>
                    <div className="flex items-center gap-2 pl-6 border-l border-slate-200">
                       <Mail className="size-4 text-slate-400" />
                       <span className="text-sm font-medium text-slate-500 italic">{selected.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                   <div className="max-w-[800px]">
                      <p className="text-lg text-slate-700 leading-loose whitespace-pre-wrap font-medium">{selected.message}</p>
                   </div>
                </div>

                <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between gap-6">
                   <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-600 shadow-sm">
                        <ShieldCheck className="size-5" />
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 leading-tight">Secure clinical communication<br/>Processed via CareSync Bridge</div>
                   </div>
                   {!selected.isRead && (
                     <button 
                       onClick={()=>handleMarkRead(selected._id)}
                       className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
                     >
                       Mark as Processed
                       <ArrowRight className="size-4" />
                     </button>
                   )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4">
                 <div className="size-20 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <Mail size={32} strokeWidth={1.5} />
                 </div>
                 <p className="font-black uppercase tracking-[0.2em] text-[11px]">Select a query to begin processing</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
