import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Pill, 
  Activity, 
  ArrowRight, 
  User, 
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  HeartPulse
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GreetingSection = ({ name }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : hour < 21 ? "Good Evening" : "Good Night";
  
  return (
    <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl">
      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <span className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px]">Patient Portal Active</span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {greeting}, <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{name}</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-md mt-4 leading-relaxed">
            Your clinical overview is synchronized. Manage your upcoming consultations and medical records with ease.
          </p>
        </motion.div>
      </div>
      
      {/* Background Abstract Shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <HeartPulse className="absolute right-12 top-1/2 -translate-y-1/2 size-48 text-white/5 pointer-events-none rotate-12" />
    </div>
  );
};

const NextScheduleCard = ({ refreshTrigger }) => {
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNext = async () => {
      try {
        const res = await api.get('/patients/me/appointments');
        const appointments = res.data.appointments || [];
        const confirmed = appointments.find(a => a.status === 'confirmed' || a.status === 'pending');
        setNextAppointment(confirmed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNext();
  }, [refreshTrigger]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 flex flex-col h-full group hover:border-emerald-500 transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="size-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
          <Clock className="size-6" />
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Encounter</div>
      </div>
      
      <div className="flex-1">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-100 rounded-lg w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
          </div>
        ) : nextAppointment ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-3xl font-black text-slate-900 mb-1 leading-tight">
              {format(new Date(nextAppointment.appointmentDate), 'MMM dd')}
            </h3>
            <p className="text-lg font-bold text-emerald-600 mb-4">{nextAppointment.appointmentTime}</p>
            
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="size-10 rounded-xl overflow-hidden bg-slate-200 border-2 border-white shadow-sm shrink-0">
                 <img src={nextAppointment.doctor?.avatar || "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&w=100&q=80"} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-black text-slate-900 truncate">Dr. {nextAppointment.doctor?.lastName}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">{nextAppointment.doctor?.specialization}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <Link to="/patient/book" className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 group/empty no-underline">
            <p className="text-slate-400 font-bold text-sm leading-relaxed group-hover/empty:text-emerald-600">
              No upcoming visits. <br/>
              <span className="text-[10px] text-emerald-500 uppercase tracking-widest mt-2 block opacity-0 group-hover/empty:opacity-100 transition-opacity">Schedule Now</span>
            </p>
          </Link>
        )}
      </div>

      <Link to="/patient/appointments" className="mt-8 flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 transition-all no-underline shadow-lg shadow-slate-200 active:scale-95">
        <span className="text-xs font-black uppercase tracking-widest ml-2">Clinical History</span>
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get('/patients/me/prescriptions');
        setPrescriptions(res.data.prescriptions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-8">
      {/* 1. Dynamic Greeting Hero */}
      <GreetingSection name={user?.firstName} />

      {/* 2. Primary Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Booking Card */}
        <div className="lg:col-span-8 group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-emerald-500 transition-all duration-500 overflow-hidden shadow-xl shadow-slate-200/50">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full -mr-20 -mt-20 blur-[100px] group-hover:bg-emerald-100/50 transition-colors pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
              <div className="size-14 rounded-[1.2rem] bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <Calendar className="size-7" />
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
                <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Live Scheduling</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Book Clinical Consultation</h2>
            <p className="text-slate-500 text-base font-medium max-w-md mb-8 leading-relaxed">
              Schedule your next visit with our senior specialists. Real-time availability tracking.
            </p>
            
            <Link 
              to="/patient/book"
              className="inline-flex items-center gap-3 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-[12px] px-10 py-4 rounded-xl hover:bg-slate-900 transition-all shadow-2xl shadow-emerald-200 no-underline active:scale-95 group/btn"
            >
              Start Booking
              <ArrowRight className="size-4 group-hover/btn:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Schedule Sidebar */}
        <div className="lg:col-span-4">
          <NextScheduleCard />
        </div>

        {/* 3. Medical Regimen Tracking */}
        <div className="lg:col-span-12 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 group hover:border-emerald-500 transition-all duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
            <div className="flex items-center gap-6">
              <div className="size-14 rounded-[1.2rem] bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Pill className="size-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Regimen</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Activity className="size-3.5 text-emerald-500" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">{prescriptions.length} Prescribed Medications</p>
                </div>
              </div>
            </div>
            <Link to="/patient/prescriptions" className="inline-flex items-center gap-3 bg-slate-50 text-slate-900 font-black uppercase tracking-[0.2em] text-[11px] px-8 py-4 rounded-2xl border border-slate-100 hover:bg-slate-900 hover:text-white transition-all no-underline active:scale-95">
              Extended Ledger
              <ChevronRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-28 bg-slate-50 rounded-[2rem] animate-pulse"></div>)
            ) : prescriptions.length > 0 ? (
              prescriptions.flatMap(p => p.medicines || []).slice(0, 3).map((m, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group/pill relative flex items-center gap-5 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-emerald-500 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
                >
                  <div className="size-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0 border border-slate-50 group-hover/pill:bg-emerald-600 group-hover/pill:text-white transition-all duration-500">
                    <Activity className="size-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-slate-900 text-[16px] truncate tracking-tight">{m.name}</h4>
                    <p className="text-slate-500 font-bold text-[12px] uppercase tracking-wide mt-1">{m.dosage} • {m.frequency}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <ShieldCheck className="size-12 text-slate-300 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active medical regimens recorded.</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Quick Tips / System Health (Bonus Professional Section) */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[3rem] p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-2">Digital Health Records</h4>
                <p className="text-emerald-100 font-medium text-sm leading-relaxed opacity-80">All your medical history is encrypted and securely stored. Access them anytime for second opinions.</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <ShieldCheck className="size-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
                </div>
              </div>
              <Stethoscope className="absolute -right-8 -bottom-8 size-48 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
           </div>

           <div className="bg-slate-100 rounded-[3rem] p-8 text-slate-900 flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-black mb-2">Wellness Insights</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">Stay updated with the latest clinical advice personalized for your active regimen.</p>
              </div>
              <div className="mt-8 flex gap-2">
                 {[1,2,3,4,5].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>)}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
