/**
 * pages/LoginPage.jsx — Sign in / Sign up with tab toggle
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage({ mode = 'login' }) {
  const { login, register, loading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';
  const [tab, setTab] = useState(mode);

  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const errs = {};
    if (tab === 'register' && !form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        await register(form.name, form.email, form.password);
        toast.success('Account created!');
      }
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="page-enter min-h-screen flex">

      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-950 relative overflow-hidden
                      flex-col items-center justify-center p-16">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `radial-gradient(circle at 30% 70%, #78716c 0%, transparent 60%)` }} />
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-12">
            <span className="font-display text-4xl tracking-[0.2em] text-white">LUXE</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <blockquote className="font-display text-3xl font-light text-stone-300 leading-relaxed max-w-sm">
            "Quality is never an accident; it is always the result of intelligent effort."
          </blockquote>
          <p className="font-mono text-xs text-stone-600 mt-6 tracking-widest">— John Ruskin</p>
        </div>

        {/* Decorative circles */}
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full border border-stone-800 translate-x-1/2 translate-y-1/2 opacity-30" />
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full border border-stone-800 -translate-x-1/2 -translate-y-1/2 opacity-30" />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-24 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <span className="font-display text-2xl tracking-[0.15em] text-stone-900">LUXE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          </div>

          {/* Tab switcher */}
          <div className="flex border border-stone-200 mb-8 p-1 bg-stone-50">
            {[
              { key: 'login',    label: 'Sign In' },
              { key: 'register', label: 'Create Account' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setTab(key); setErrors({}); }}
                className={`flex-1 py-2.5 text-sm font-body font-medium transition-all duration-200 ${
                  tab === key ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <h1 className="font-display text-3xl text-stone-900 mb-2">
            {tab === 'login' ? 'Welcome back' : 'Join LuxeStore'}
          </h1>
          <p className="text-stone-500 text-sm font-body mb-8">
            {tab === 'login'
              ? 'Sign in to access your account and orders'
              : 'Create an account to start shopping'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Name (register only) */}
            {tab === 'register' && (
              <div className="animate-slide-in">
                <label className="block text-xs font-mono text-stone-500 uppercase tracking-wide mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                  autoComplete="name"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1 font-mono">{errors.name}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-mono text-stone-500 uppercase tracking-wide mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                autoComplete="email"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 font-mono">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono text-stone-500 uppercase tracking-wide mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 font-mono">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {tab === 'login' ? 'Signing in…' : 'Creating account…'}
                </span>
              ) : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-8 font-body">
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setErrors({}); }}
              className="text-stone-900 font-medium hover:underline underline-offset-2"
            >
              {tab === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const EyeIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
    <path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
  </svg>
);
