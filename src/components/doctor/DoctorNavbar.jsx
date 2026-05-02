import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DoctorNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-white border-b border-border-structural shadow-[0_4px_12px_rgba(26,46,37,0.08)]">
      <div className="text-2xl font-bold text-primary font-serif italic no-underline">
        CareSync
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-background transition-colors duration-200 cursor-pointer rounded-full">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-border-structural">
          <div className="text-right">
            <p className="text-sm font-bold text-text-primary font-body-base">Dr. {user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-label">{user?.specialization || 'Consultant'}</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-primary/20">
            <img 
              alt="Doctor avatar" 
              className="w-full h-full object-cover" 
              loading="lazy"
              src={user?.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=75&fm=webp"} 
            />
          </div>
        </div>
        <button 
          onClick={logout} 
          className="ml-4 px-5 py-2 backdrop-blur-md bg-white/30 border border-slate-200/40 shadow-lg hover:bg-white/40 transition-all text-red-600 font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
