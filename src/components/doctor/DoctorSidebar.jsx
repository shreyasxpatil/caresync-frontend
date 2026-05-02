import { Link, useLocation } from 'react-router-dom';

export default function DoctorSidebar() {
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { label: 'Appointments', icon: 'calendar_today', to: '/doctor' },
    { label: 'Prescriptions', icon: 'medication', to: '/doctor/prescriptions' },
    { label: 'Patients', icon: 'group', to: '/doctor/patients' }
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 border-r border-border-structural bg-surface-container-lowest flex flex-col pt-20 px-4 space-y-2 z-40 hidden md:flex shadow-sm">
      <div className="mb-8 px-4">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-label mb-2">Navigation</p>
      </div>
      
      {links.map((link) => {
        const isActive = path === link.to;
        return (
          <Link 
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-150 cursor-pointer no-underline ${
              isActive 
                ? 'bg-primary text-white shadow-md' 
                : 'text-slate-600 hover:text-primary hover:bg-background'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>{link.icon}</span>
            <span className="font-sans text-sm font-semibold uppercase tracking-wider">{link.label}</span>
          </Link>
        );
      })}

      <div className="mt-auto pb-8 px-4 border-t border-border-structural pt-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-xs font-label text-slate-500">System Secure & Online</p>
        </div>
      </div>
    </aside>
  );
}
