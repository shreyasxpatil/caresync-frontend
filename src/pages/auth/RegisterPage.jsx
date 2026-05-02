import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Heart } from 'lucide-react';

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL?.replace('/api', '')}/api/auth/google`;

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', gender: '', phone: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true); setError('');
    try {
      const user = await register({ ...form, role: 'patient' });
      toast.success('Account created! Welcome to CareSync 🎉');
      navigate('/patient');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div className="auth-left-content fade-in">
          <div className="auth-brand">
            <div className="auth-brand-icon"><Heart size={24} color="#fff" fill="#fff" /></div>
            <div>
              <div className="auth-brand-name">CareSync</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Hospital Management</div>
            </div>
          </div>
          <h1 className="auth-hero-title">Join <span>CareSync</span><br />today</h1>
          <p className="auth-hero-desc">Create your patient account and get instant access to appointment booking, digital prescriptions, and your complete medical history.</p>
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['✓ Book appointments instantly', '✓ View digital prescriptions', '✓ Track medical history', '✓ Connect with specialists'].map(f => (
              <div key={f} style={{ fontSize: 15, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span>
                {f.replace('✓ ', '')}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right" style={{ width: 520 }}>
        <div className="auth-form-box fade-in">
          <h2 className="auth-form-title">Create account</h2>
          <p className="auth-form-sub">Register as a patient — free forever</p>

          <a href={GOOGLE_AUTH_URL}>
            <button className="btn btn-google" type="button">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
          </a>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or register with email</span>
            <div className="auth-divider-line" />
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Rahul" required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Sharma" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="rahul@example.com" required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="7821938067" />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-input" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required style={{ paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" required />
            </div>
            <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Patient Account'}
            </button>
          </form>

          <div className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></div>
        </div>
      </div>
    </div>
  );
}
