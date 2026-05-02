import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const { handleGoogleCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const role = params.get('role');
    const error = params.get('error');

    if (error || !token) {
      toast.error('Google sign-in failed. Please try again.');
      navigate('/');
      return;
    }

    // FIXED: await the full user load before navigating.
    // The old code used setTimeout(500ms) which was not long enough for the
    // /api/auth/me fetch to return. PrivateRoute saw user=null and bounced us back.
    handleGoogleCallback(token, role)
      .then(() => {
        toast.success('Signed in with Google!');
        if (role === 'admin') navigate('/admin', { replace: true });
        else if (role === 'doctor') navigate('/doctor', { replace: true });
        else navigate('/patient', { replace: true });
      })
      .catch(() => {
        toast.error('Failed to load your account. Please log in again.');
        navigate('/');
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0f172a',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{
        width: 48,
        height: 48,
        border: '4px solid #334155',
        borderTop: '4px solid #38bdf8',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#94a3b8', fontFamily: 'sans-serif', margin: 0 }}>
        Completing Google sign-in...
      </p>
    </div>
  );
}
