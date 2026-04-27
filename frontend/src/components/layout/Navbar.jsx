/**
 * components/layout/Navbar.jsx — Top navigation bar
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-luxury' : 'bg-white'
      }`}
    >
      <div className="section-wrapper">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl font-light tracking-[0.15em] text-stone-900 group-hover:text-stone-600 transition-colors">
              LUXE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-150 transition-transform" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-body tracking-wide transition-colors duration-200 ${
                  location.pathname === to
                    ? 'text-stone-900 font-medium'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {/* Cart */}
            <Link
              to="/cart"
              className="relative btn-ghost rounded-none p-2"
              aria-label="Cart"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-stone-900 text-white
                                 text-[10px] font-mono font-medium rounded-full
                                 flex items-center justify-center animate-fade-in">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="btn-ghost rounded-none hidden md:flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-stone-900 text-white text-xs font-medium
                                  flex items-center justify-center font-mono">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronIcon className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-stone-100
                                  shadow-luxury-lg py-1 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-500 font-mono">{user.email}</p>
                      {user.role === 'admin' && (
                        <p className="text-xs text-amber-600 font-mono font-semibold mt-1">ADMIN</p>
                      )}
                    </div>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900">
                      My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <>
                        <div className="border-t border-stone-100 my-1" />
                        <Link to="/admin" className="block px-4 py-2 text-sm text-amber-600 font-semibold hover:bg-amber-50">
                          Admin Dashboard
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost rounded-none text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-xs py-2 px-5">Join</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden btn-ghost rounded-none p-2"
              aria-label="Toggle menu"
            >
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 animate-slide-in">
          <div className="section-wrapper py-4 flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="py-2.5 text-sm text-stone-600 hover:text-stone-900 font-body"
              >
                {label}
              </Link>
            ))}
            <div className="divider !my-3" />
            {user ? (
              <>
                <p className="text-xs text-stone-500 font-mono py-1">{user.name}</p>
                <Link to="/orders" className="py-2.5 text-sm text-stone-600 hover:text-stone-900">My Orders</Link>
                <button onClick={handleLogout} className="text-left py-2.5 text-sm text-stone-600 hover:text-stone-900">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-1">
                <Link to="/login" className="btn-secondary flex-1 text-center text-sm py-2.5">Sign In</Link>
                <Link to="/register" className="btn-primary flex-1 text-center text-sm py-2.5">Join</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ── Inline Icons ──────────────────────────────────────────────────────────────
const CartIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75M7.5 14.25L5.106 5.272M7.5 14.25h9.375M17.25 14.25l1.5-6.75H5.106" />
    <circle cx="9" cy="19.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="18" cy="19.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
  </svg>
);
