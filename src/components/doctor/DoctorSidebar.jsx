import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { CalendarDays, Pill, Users, ChevronRight, Activity } from 'lucide-react';

const links = [
  { label: 'Appointments',  icon: CalendarDays, to: '/doctor' },
  { label: 'Prescriptions', icon: Pill,         to: '/doctor/prescriptions' },
  { label: 'Patients',      icon: Users,        to: '/doctor/patients' },
];

export default function DoctorSidebar() {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuth();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 z-40 hidden md:flex flex-col bg-gradient-to-b from-slate-900 via-teal-950 to-slate-900 shadow-2xl pt-16">
      {/* Doctor Card */}
      <div className="p-5">
        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center gap-3">
          <div className="size-11 rounded-xl overflow-hidden border-2 border-teal-400/40 shadow-md shrink-0">
            <img
              alt="avatar"
              className="w-full h-full object-cover"
              src={user?.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=75&fm=webp"}
            />
          </div>
          <div className="min-w-0">
            <p className="text-white font-black text-sm truncate">Dr. {user?.firstName} {user?.lastName}</p>
            <p className="text-teal-300 text-[10px] font-bold uppercase tracking-widest">{user?.specialization || 'Consultant'}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-1 mt-2">
        <p className="text-teal-400/60 text-[9px] font-black uppercase tracking-[0.25em] px-3 mb-3">Navigation</p>
        {links.map((link, i) => {
          const isActive = path === link.to;
          return (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl no-underline transition-all duration-200 group ${
                  isActive
                    ? 'bg-white text-teal-700 shadow-lg shadow-black/20'
                    : 'text-teal-100 hover:bg-white/15 hover:text-white'
                }`}
              >
                <link.icon className={`size-5 transition-transform group-hover:scale-110 ${isActive ? 'text-teal-600' : ''}`} />
                <span className="font-bold text-[13px]">{link.label}</span>
                {isActive && <ChevronRight className="size-4 ml-auto text-teal-500" />}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Status Footer */}
      <div className="p-5 border-t border-white/10">
        <div className="p-3 bg-teal-900/40 rounded-xl border border-teal-500/20 flex items-center gap-3">
          <Activity className="size-4 text-teal-400 shrink-0" />
          <div>
            <p className="text-teal-300 text-[10px] font-black uppercase tracking-widest">System Secure</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="size-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              <p className="text-teal-400/70 text-[9px] font-bold">All services online</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
