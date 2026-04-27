/**
 * context/AuthContext.jsx — Global auth state
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('luxe_user')); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('luxe_token', data.token);
    localStorage.setItem('luxe_user', JSON.stringify(data.user));
    setUser(data.user);
    setLoading(false);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('luxe_token', data.token);
    localStorage.setItem('luxe_user', JSON.stringify(data.user));
    setUser(data.user);
    setLoading(false);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('luxe_token');
    localStorage.removeItem('luxe_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
