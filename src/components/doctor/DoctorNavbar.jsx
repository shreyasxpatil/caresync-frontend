import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, LogOut } from 'lucide-react';

export default function DoctorNavbar() {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="fixed top-0 w-full z-50 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm flex justify-between items-center px-8"
    >
      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 no-underline group">
        <div className="size-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-200 group-hover:scale-110 transition-transform">
          <svg fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>
        <div>
          <span className="font-heading font-black text-lg text-slate-900 tracking-tight uppercase">CareSync</span>
          <p className="text-teal-600 text-[9px] font-bold uppercase tracking-[0.2em] -mt-0.5">Doctor Portal</p>
        </div>
      </Link>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="relative size-9 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl hover:bg-teal-50 hover:border-teal-200 transition-all cursor-pointer shadow-sm">
          <Bell className="size-4 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 size-2 bg-teal-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Dr. {user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] text-teal-600 uppercase tracking-widest font-bold">{user?.specialization || 'Consultant'}</p>
          </div>
          <div className="size-9 rounded-xl overflow-hidden border-2 border-teal-200 shadow-md shrink-0">
            <img
              alt="Doctor avatar"
              className="w-full h-full object-cover"
              loading="lazy"
              src={user?.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=75&fm=webp"}
            />
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-all font-bold text-[12px] uppercase tracking-widest cursor-pointer"
        >
          <LogOut className="size-3.5" />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </motion.header>
  );
}
