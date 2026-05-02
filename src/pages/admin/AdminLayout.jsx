import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Stethoscope, Users, Calendar, MessageSquare,
  LogOut, ChevronRight, Bell, Search, Menu, Shield
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard',    path: '/admin',              icon: LayoutDashboard },
  { label: 'Doctor List',  path: '/admin/doctors',      icon: Stethoscope },
  { label: 'Patient List', path: '/admin/patients',     icon: Users },
  { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
  { label: 'Queries',      path: '/admin/messages',     icon: MessageSquare },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const path = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 pb-4">
        <Link to="/" className="flex items-center gap-3 no-underline group" onClick={() => setMobileOpen(false)}>
          <div className="size-10 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Shield className="size-5 text-white" />
          </div>
          <div>
            <span className="font-heading font-black text-xl text-white tracking-tight uppercase">CareSync</span>
            <p className="text-violet-300 text-[9px] font-bold uppercase tracking-[0.2em] -mt-0.5">Admin Console</p>
          </div>
        </Link>
      </div>

      {/* Admin Card */}
      <div className="mx-4 mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-violet-300 to-indigo-400 flex items-center justify-center font-black text-slate-900 text-lg shadow-md">
            {user?.firstName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-violet-300 text-[10px] font-bold uppercase tracking-widest">Administrator</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <p className="text-violet-400/70 text-[9px] font-black uppercase tracking-[0.25em] px-3 mb-3">Main Menu</p>
        {menuItems.map((item, i) => {
          const isActive = path === item.path;
          return (
            <motion.div key={item.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
              <Link
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl no-underline transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-white text-violet-700 shadow-lg shadow-black/20'
                    : 'text-violet-100 hover:bg-white/15 hover:text-white'
                }`}
              >
                <item.icon className={`size-5 transition-transform group-hover:scale-110 ${isActive ? 'text-violet-600' : ''}`} />
                <span className="font-bold text-[13px]">{item.label}</span>
                {isActive && <ChevronRight className="size-4 ml-auto text-violet-500" />}
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
          <span className="size-2 rounded-full bg-violet-400 animate-pulse"></span>
          <p className="text-violet-400/70 text-[10px] font-bold uppercase tracking-widest">Admin Online</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-72 hidden md:flex flex-col fixed inset-y-0 z-50 bg-gradient-to-b from-slate-900 via-violet-950 to-indigo-950 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-72 z-50 bg-gradient-to-b from-slate-900 via-violet-950 to-indigo-950 shadow-2xl md:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {/* Premium Header */}
        <header className="sticky top-0 z-40 h-20 px-6 md:px-10 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center gap-6 shadow-sm">
          <button className="md:hidden text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </button>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl focus-within:ring-2 focus-within:ring-violet-300 transition-all">
            <Search className="size-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Quick search records..."
              className="bg-transparent outline-none text-sm font-medium w-full text-slate-600 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Bell */}
            <button className="relative size-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl hover:bg-violet-50 hover:border-violet-200 transition-all shadow-sm">
              <Bell className="size-4 text-slate-600" />
              <span className="absolute top-2 right-2 size-2 bg-violet-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            {/* User Pill */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
              <div className="size-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow">
                {user?.firstName?.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-slate-800 font-black text-xs uppercase tracking-tight">{user?.firstName} {user?.lastName}</p>
                <p className="text-violet-600 text-[9px] font-bold uppercase tracking-widest">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10">
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
