import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Sidebar({ navItems, role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const initials = user ? `${user.firstName?.[0]}${user.lastName?.[0]}` : 'U';

  const roleColors = { admin: 'var(--secondary)', doctor: 'var(--primary)', patient: 'var(--accent)' };
  const roleColor = roleColors[user?.role] || 'var(--primary)';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Heart size={18} color="#fff" fill="#fff" />
        </div>
        <div>
          <div className="sidebar-title">CareSync</div>
          <div className="sidebar-subtitle">{role} Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.section}>
            {section.section && <div className="nav-section-label">{section.section}</div>}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-mini">
          <div className="user-avatar relative overflow-hidden bg-slate-200 shrink-0" style={{ background: `linear-gradient(135deg, ${roleColor}, var(--secondary))` }}>
            {user?.avatar ? <img src={user.avatar} alt={initials} loading="lazy" className="w-full h-full object-cover relative z-10" /> : <span className="relative z-10">{initials}</span>}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 4, display: 'flex' }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
