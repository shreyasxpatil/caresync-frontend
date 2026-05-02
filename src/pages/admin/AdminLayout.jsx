import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Layout, 
  User, 
  Users, 
  Calendar, 
  MessageSquare, 
  LogOut, 
  Bell, 
  Search,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: Layout },
    { label: 'Doctor List', path: '/admin/doctors', icon: User },
    { label: 'Patient List', path: '/admin/patients', icon: Users },
    { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { label: 'Queries', path: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Modern Sidebar */}
      <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50 transition-all duration-300">
        <div className="p-8 border-b border-slate-50">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="size-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <span className="font-heading font-black text-2xl text-slate-900 tracking-tighter">CareSync</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <div className="px-4 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Main Menu</span>
          </div>
          {menuItems.map((item) => {
            const isActive = path === item.path;
            return (
              <Link 
                key={item.label}
                to={item.path} 
                className={`group flex items-center justify-between px-4 py-3.5 rounded-xl no-underline transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`size-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'} transition-colors`} />
                  <span className="font-bold text-[14px]">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="size-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-[14px]"
          >
            <LogOut className="size-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[280px] min-h-screen flex flex-col">
        {/* State-of-the-Art Header */}
        <header className="h-24 px-10 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 w-[400px]">
            <Search className="size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick search records..." 
              className="bg-transparent border-none outline-none text-sm font-medium w-full text-slate-600 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative size-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <Bell className="size-5 text-slate-600" />
              <span className="absolute top-2 right-2 size-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{user?.firstName} {user?.lastName}</div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Administrator</div>
              </div>
              <div className="size-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-lg shadow-md">
                {user?.firstName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="p-10 flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
