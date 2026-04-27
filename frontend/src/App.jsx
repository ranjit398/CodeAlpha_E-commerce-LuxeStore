/**
 * App.jsx — Root component with routing, providers, and page transitions
 */

import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import HomePage          from './pages/HomePage';
import ProductsPage      from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage          from './pages/CartPage';
import CheckoutPage      from './pages/CheckoutPage';
import LoginPage         from './pages/LoginPage';
import OrdersPage        from './pages/OrdersPage';
import OrderDetailPage   from './pages/OrderDetailPage';
import AdminDashboard    from './pages/AdminDashboard';
import AdminUsersPage    from './pages/AdminUsersPage';
import AdminOrdersPage   from './pages/AdminOrdersPage';

/* ── Animated page wrapper ─────────────────────────────────────────────────── */
function AnimatedPage({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div ref={ref}>{children}</div>;
}

/* ── Scroll-to-top on route change ─────────────────────────────────────────── */
function ScrollRestorer() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

/* ── Layout wrapper (navbar + footer) ─────────────────────────────────────── */
function Layout({ children }) {
  const { pathname } = useLocation();
  const noFooter = ['/login', '/register', '/checkout', '/admin', '/admin/users', '/admin/orders'];
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <AnimatedPage key={pathname}>{children}</AnimatedPage>
      </main>
      {!noFooter.includes(pathname) && <Footer />}
    </>
  );
}

/* ── Route definitions ─────────────────────────────────────────────────────── */
function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/products"      element={<ProductsPage />} />
        <Route path="/products/:id"  element={<ProductDetailPage />} />
        <Route path="/cart"          element={<CartPage />} />
        <Route path="/login"         element={<LoginPage mode="login" />} />
        <Route path="/register"      element={<LoginPage mode="register" />} />

        {/* Protected routes */}
        <Route path="/checkout" element={
          <ProtectedRoute><CheckoutPage /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><OrdersPage /></ProtectedRoute>
        } />
        <Route path="/orders/:id" element={
          <ProtectedRoute><OrderDetailPage /></ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute><AdminUsersPage /></AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute><AdminOrdersPage /></AdminRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

/* ── Root App ──────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CartProvider>
          <ScrollRestorer />
          <AppRoutes />

          {/* Toast notifications */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1c1917',
                color: '#fafaf9',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                borderRadius: '0',
                padding: '12px 16px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              },
              success: {
                iconTheme: { primary: '#4ade80', secondary: '#1c1917' },
              },
              error: {
                iconTheme: { primary: '#f87171', secondary: '#1c1917' },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
