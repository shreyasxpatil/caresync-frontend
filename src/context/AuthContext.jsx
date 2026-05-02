import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('caresync_token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      localStorage.removeItem('caresync_token');
      localStorage.removeItem('caresync_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    setError(null);
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('caresync_token', data.token);
    localStorage.setItem('caresync_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    setError(null);
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('caresync_token', data.token);
    localStorage.setItem('caresync_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('caresync_token');
    localStorage.removeItem('caresync_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  // Handle Google OAuth token from URL
  // IMPORTANT: Returns a Promise — GoogleCallback.jsx awaits this before navigating
  const handleGoogleCallback = useCallback((token, role) => {
    localStorage.setItem('caresync_token', token);
    setLoading(true);
    return loadUser(); // Return the promise so caller can .then()/.catch()
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{
      user, loading, error, setError,
      login, register, logout, updateUser, handleGoogleCallback,
      isAdmin: user?.role === 'admin',
      isDoctor: user?.role === 'doctor',
      isPatient: user?.role === 'patient',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
