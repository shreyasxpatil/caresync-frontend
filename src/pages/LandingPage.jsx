import { Link } from 'react-router-dom';
import { Heart, Calendar, Shield, Activity, Users, Star, ChevronRight, Stethoscope, FileText, Phone } from 'lucide-react';

const SPECIALIZATIONS = [
  { name: 'Cardiology', icon: '❤️', desc: 'Heart & cardiovascular care' },
  { name: 'Neurology', icon: '🧠', desc: 'Brain & nervous system' },
  { name: 'Dermatology', icon: '✨', desc: 'Skin, hair & nail care' },
  { name: 'Orthopedics', icon: '🦴', desc: 'Bones, joints & muscles' },
  { name: 'Pediatrics', icon: '👶', desc: 'Child health & development' },
  { name: 'General Medicine', icon: '🩺', desc: 'Comprehensive primary care' },
];

const STATS = [
  { value: '5,000+', label: 'Patients Served' },
  { value: '50+', label: 'Expert Doctors' },
  { value: '15+', label: 'Specializations' },
  { value: '99%', label: 'Satisfaction Rate' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', height: 64 }}>
        <div className="container flex items-center justify-between" style={{ height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={20} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800 }}>CareSync</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/login"><button className="btn btn-secondary">Sign In</button></Link>
            <Link to="/register"><button className="btn btn-primary">Get Started</button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, background: 'var(--primary)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.06 }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, background: 'var(--secondary)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.06 }} />
        <div className="container text-center">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 999, padding: '6px 16px', marginBottom: 24, fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', display: 'inline-block' }} />
            Now serving 5,000+ patients across India
          </div>
          <h1 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.1, marginBottom: 20, maxWidth: 800, margin: '0 auto 20px' }}>
            Modern Healthcare,{' '}
            <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Simplified
            </span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.8 }}>
            Book appointments with top specialists, access your medical records, and manage your healthcare journey — all in one secure platform.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <button className="btn btn-primary btn-lg" style={{ fontSize: 16, padding: '14px 32px' }}>
                Book Appointment <ChevronRight size={18} />
              </button>
            </Link>
            <Link to="/login">
              <button className="btn btn-secondary btn-lg" style={{ fontSize: 16, padding: '14px 32px' }}>
                Doctor / Admin Login
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '40px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Everything you need</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>A complete hospital management system for patients, doctors, and administrators</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { icon: <Calendar size={28} />, color: 'blue', title: 'Smart Appointments', desc: 'Book, reschedule, or cancel appointments with ease. Get real-time availability of doctors.' },
              { icon: <FileText size={28} />, color: 'green', title: 'Digital Prescriptions', desc: 'Access your prescriptions anywhere. Doctors can issue digital prescriptions instantly.' },
              { icon: <Shield size={28} />, color: 'purple', title: 'Secure Health Records', desc: 'Your medical history is encrypted and accessible only to authorized personnel.' },
              { icon: <Users size={28} />, color: 'yellow', title: 'Multi-role System', desc: 'Separate dashboards for patients, doctors, and admins with appropriate permissions.' },
              { icon: <Activity size={28} />, color: 'red', title: 'Real-time Updates', desc: 'Get instant notifications on appointment status changes and prescription updates.' },
              { icon: <Stethoscope size={28} />, color: 'blue', title: '50+ Specialists', desc: 'Access to cardiologists, neurologists, dermatologists, and more top doctors.' },
            ].map(f => (
              <div key={f.title} className="card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className={`stat-icon ${f.color}`} style={{ width: 52, height: 52, borderRadius: 12 }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Our Specializations</h2>
            <p style={{ color: 'var(--text-muted)' }}>Expert care across all major medical fields</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {SPECIALIZATIONS.map(s => (
              <div key={s.name} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 36 }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0' }}>
        <div className="container text-center">
          <div style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(99,102,241,0.1))', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 24, padding: '60px 40px' }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Ready to get started?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
              Join thousands of patients who trust CareSync for their healthcare needs.
            </p>
            <Link to="/register">
              <button className="btn btn-primary btn-lg" style={{ fontSize: 16, padding: '16px 40px' }}>
                Create Free Account <ChevronRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        <div className="container">
          <p>© 2024 CareSync Hospital Management System. Built with ❤️ for better healthcare.</p>
        </div>
      </footer>
    </div>
  );
}
