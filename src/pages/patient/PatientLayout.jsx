import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CalendarPlus, History, Pill, UserCircle, LogOut, ChevronRight, HeartPulse, Menu, X } from 'lucide-react';

const menuItems = [
  { label: 'Dashboard',         icon: LayoutDashboard, path: '/patient' },
  { label: 'Book Appointment',  icon: CalendarPlus,    path: '/patient/book' },
  { label: 'My Appointments',   icon: History,         path: '/patient/appointments' },
  { label: 'Prescriptions',     icon: Pill,            path: '/patient/prescriptions' },
  { label: 'My Profile',        icon: UserCircle,      path: '/patient/profile' },
];

export default function PatientLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const path = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const onBookingSuccess = () => setRefreshKey(old => old + 1);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 pb-4">
        <Link to="/" className="flex items-center gap-3 no-underline group" onClick={() => setMobileOpen(false)}>
          <div className="size-10 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <HeartPulse className="size-5 text-white" />
          </div>
          <div>
            <span className="font-heading font-black text-xl text-white tracking-tight uppercase">CareSync</span>
            <p className="text-emerald-300 text-[9px] font-bold uppercase tracking-[0.2em] -mt-0.5">Patient Portal</p>
          </div>
        </Link>
      </div>

      {/* User Card */}
      <div className="mx-4 mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-300 to-teal-400 flex items-center justify-center font-black text-slate-900 text-lg shadow-md">
            {user?.firstName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest">Patient</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <p className="text-emerald-400/70 text-[9px] font-black uppercase tracking-[0.25em] px-3 mb-3">Navigation</p>
        {menuItems.map((item, i) => {
          const isActive = path === item.path;
          return (
            <motion.div key={item.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
              <Link
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl no-underline transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-white text-emerald-700 shadow-lg shadow-black/20'
                    : 'text-emerald-100 hover:bg-white/15 hover:text-white'
                }`}
              >
                <item.icon className={`size-5 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-600' : ''}`} />
                <span className="font-bold text-[13px]">{item.label}</span>
                {isActive && <ChevronRight className="size-4 ml-auto text-emerald-500" />}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition-all font-bold text-[13px] cursor-pointer"
        >
          <LogOut className="size-5" />
          Sign Out
        </button>
        <div className="flex items-center gap-2 px-4 mt-3">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <p className="text-emerald-400/70 text-[10px] font-bold uppercase tracking-widest">System Online</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 hidden md:flex flex-col fixed inset-y-0 z-50 bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-64 z-50 bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 shadow-2xl md:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16 px-6 flex items-center justify-between shadow-sm">
          <button className="md:hidden text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </button>
          <div className="hidden md:block">
            <h2 className="font-heading font-black text-slate-800 text-lg capitalize">
              {menuItems.find(m => m.path === path)?.label || 'Dashboard'}
            </h2>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Patient Portal</p>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
              <div className="size-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-white text-xs shadow">
                {user?.firstName?.charAt(0)}
              </div>
              <span className="text-slate-700 font-bold text-sm hidden sm:block">{user?.firstName}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Outlet context={{ refreshKey, onBookingSuccess }} />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
