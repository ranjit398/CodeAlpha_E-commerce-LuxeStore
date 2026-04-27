/**
 * components/layout/Footer.jsx
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-24">
      <div className="section-wrapper py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-3xl font-light tracking-[0.15em] text-stone-50">LUXE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            </div>
            <p className="text-sm leading-relaxed text-stone-500 max-w-xs">
              Curated goods for the discerning individual. Quality over quantity, always.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase text-stone-300 mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {['All Products', 'Electronics', 'Clothing', 'Accessories', 'Home'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={cat === 'All Products' ? '/products' : `/products?category=${cat}`}
                    className="text-sm text-stone-500 hover:text-stone-200 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase text-stone-300 mb-4">Account</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Sign In', to: '/login' },
                { label: 'Create Account', to: '/register' },
                { label: 'My Orders', to: '/orders' },
                { label: 'Cart', to: '/cart' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-stone-500 hover:text-stone-200 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-stone-600">
            © {new Date().getFullYear()} LuxeStore. All rights reserved.
          </p>
          <p className="text-xs text-stone-700 font-mono">
            Built with React + Node.js + MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}
