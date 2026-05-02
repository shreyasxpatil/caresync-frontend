import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Heart, Shield, Calendar, Activity } from 'lucide-react';

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL?.replace('/api', '')}/api/auth/google`;

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError('Please fill in all fields');
    setLoading(true); setError('');
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.firstName}!`);
      const from = location.state?.from?.pathname;
      if (from) return navigate(from, { replace: true });
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'doctor') navigate('/doctor');
      else navigate('/patient');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="auth-left-content fade-in">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <Heart size={24} color="#fff" fill="#fff" />
            </div>
            <div>
              <div className="auth-brand-name">CareSync</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Hospital Management</div>
            </div>
          </div>
          <h1 className="auth-hero-title">
            Healthcare at<br />your <span>fingertips</span>
          </h1>
          <p className="auth-hero-desc">
            Manage your health journey with ease. Book appointments, access prescriptions, and connect with top specialists — all in one place.
          </p>
          <div className="auth-features">
            {[
              { icon: <Calendar size={20} />, color: 'blue', title: 'Easy Appointments', desc: 'Book with any doctor in seconds' },
              { icon: <Shield size={20} />, color: 'green', title: 'Secure Records', desc: 'Your health data, always safe' },
              { icon: <Activity size={20} />, color: 'purple', title: 'Live Monitoring', desc: 'Track your health in real-time' },
            ].map(f => (
              <div key={f.title} className="auth-feature">
                <div className={`auth-feature-icon stat-icon ${f.color}`}>{f.icon}</div>
                <div>
                  <div className="auth-feature-title">{f.title}</div>
                  <div className="auth-feature-text">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-box fade-in">
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-sub">Sign in to your CareSync account</p>

          {/* Google Sign In */}
          <a href={GOOGLE_AUTH_URL}>
            <button className="btn btn-google" type="button">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </a>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or sign in with email</span>
            <div className="auth-divider-line" />
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className="form-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="doctor@caresync.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>

          {/* Demo credentials */}
          <div style={{ marginTop: 24, padding: 14, background: 'var(--bg-dark)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Demo Credentials</p>
            {[
              { role: 'Admin', email: 'admin@care.com', pwd: 'admin', color: 'var(--secondary)' },
              { role: 'Doctor', email: 'arun.sharma@caresync.com', pwd: 'Doctor@123', color: 'var(--primary)' },
            ].map(d => (
              <div key={d.role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: d.color, fontWeight: 600 }}>{d.role}:</span>
                <button
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: 11 }}
                  onClick={() => { setForm({ email: d.email, password: d.pwd }); toast.success(`${d.role} credentials filled!`); }}
                >
                  Use {d.role}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
