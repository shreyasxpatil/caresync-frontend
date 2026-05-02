import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function PatientLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const path = location.pathname;
  
  const [refreshKey, setRefreshKey] = useState(0);
  const onBookingSuccess = () => setRefreshKey(old => old + 1);

  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/patient' },
    { label: 'Book Appointment', icon: 'calendar_add_on', path: '/patient/book' },
    { label: 'Appointment History', icon: 'history', path: '/patient/appointments' },
    { label: 'Prescriptions', icon: 'prescriptions', path: '/patient/prescriptions' },
  ];

  return (
    <div className="bg-background min-h-screen text-text-main">
      {/* Top Navigation */}
      <header className="bg-white border-b border-border-structural fixed top-0 left-0 right-0 h-16 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="size-8 text-primary group-hover:scale-110 transition-transform">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.85.85 2.23.85 3.08 0L15 8"></path>
              </svg>
            </div>
            <span className="font-heading font-black text-xl text-primary tracking-tighter uppercase">CareSync</span>
          </Link>
        </div>
        
        <button 
          onClick={logout} 
          className="backdrop-blur-md bg-white/30 border border-slate-200/40 shadow-lg hover:bg-white/40 transition-all text-red-600 font-bold rounded-xl uppercase tracking-widest text-[12px] px-6 py-2 cursor-pointer"
        >
          Logout
        </button>
      </header>

      <div className="flex pt-16">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-border-structural fixed left-0 top-16 bottom-0 z-40 hidden md:block p-6">
          <div className="mb-10 px-2">
            <h2 className="text-primary font-heading font-bold text-lg leading-tight uppercase tracking-wide">Patient Portal</h2>
            <p className="text-muted font-sans text-[11px] font-bold uppercase tracking-widest mt-1 opacity-70">Clinical Access</p>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-sm transition-all no-underline ${
                  path === item.path 
                    ? 'bg-primary text-white shadow-clinical' 
                    : 'text-muted hover:bg-background-light hover:text-primary hover:translate-x-1'
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] ${path === item.path ? 'fill-current' : ''}`}>
                  {item.icon}
                </span>
                <span className="font-sans text-[13px] font-bold tracking-tight">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-6 md:p-8 min-h-[calc(100vh-64px)]">
          <div className="max-w-[1100px] mx-auto">
            <Outlet context={{ refreshKey, onBookingSuccess }} />
          </div>
        </main>
      </div>
    </div>
  );
}
