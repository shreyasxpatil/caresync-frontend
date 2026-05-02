import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'https://caresync-backend-ufha.onrender.com/api';
const GOOGLE_AUTH_URL = `${API_BASE.replace('/api', '')}/api/auth/google`;

export default function PatientLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if(user.role !== 'patient') throw new Error('Not a patient account');
      navigate('/patient');
    } catch(err) {
      alert('Login Failed: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-body d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top auth-nav">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <h4><i className="fa fa-user-plus"></i> GLOBAL HOSPITALS</h4>
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item"><Link className="nav-link" to="/">HOME</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/">ABOUT US</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/">CONTACT</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-7 text-center text-white">
            <div style={{ animation: 'mover 1s infinite alternate' }}>
              <i className="fa fa-ambulance fa-5x mb-4"></i>
            </div>
            <h4>We are here for you!</h4>
          </div>

          <div className="col-md-4">
            <div className="card patient-login-card p-4 shadow">
              <center>
                <i className="fa fa-hospital-o fa-3x text-primary mb-3"></i>
                <h3 className="mb-4">Patient Login</h3>
                
                <a href={GOOGLE_AUTH_URL} className="text-decoration-none w-100 d-block mb-3">
                  <button type="button" className="google-btn">
                    <i className="fa fa-google mr-2"></i> Sign in with Google
                  </button>
                </a>

                <form className="form-group" onSubmit={handleLogin}>
                  <div className="text-left">
                    <label>Email-ID</label>
                    <input type="email" className="form-control mb-3" placeholder="enter email ID" value={email} onChange={e=>setEmail(e.target.value)} required/>
                    <label>Password</label>
                    <input type="password" className="form-control mb-4" placeholder="enter password" value={password} onChange={e=>setPassword(e.target.value)} required/>
                  </div>
                  <input type="submit" value={loading ? "Logging in..." : "Login"} className="btn btn-primary w-100" disabled={loading}/>
                </form>
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
