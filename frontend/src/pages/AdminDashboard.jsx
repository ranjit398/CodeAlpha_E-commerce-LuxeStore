/**
 * pages/AdminDashboard.jsx — Admin panel home with stats
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { PageLoader } from '../components/common/Spinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <PageLoader />;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, link: '/admin/users', color: 'bg-blue-100' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, link: '/admin/orders', color: 'bg-green-100' },
    { label: 'Total Revenue', value: `₹${(parseFloat(stats?.totalRevenue) || 0).toFixed(2)}`, link: '/admin/orders', color: 'bg-purple-100' },
    { label: 'Total Products', value: stats?.totalProducts || 0, link: '/admin/products', color: 'bg-yellow-100' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="section-wrapper py-16">
        <div className="mb-14">
          <h1 className="font-display text-5xl text-stone-900 mb-3">Admin Dashboard</h1>
          <p className="text-stone-600 text-lg">Manage users, orders, and products</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {cards.map((card) => (
            <Link
              key={card.label}
              to={card.link}
              className={`${card.color} p-8 rounded-lg border border-stone-200 hover:shadow-lg transition-all transform hover:scale-105`}
            >
              <p className="text-stone-600 text-sm font-mono mb-3 uppercase tracking-wide">{card.label}</p>
              <p className="text-4xl font-display text-stone-900 font-light">{card.value}</p>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-stone-200 rounded-lg p-10 shadow-sm">
          <h2 className="font-display text-3xl text-stone-900 mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/admin/users"
              className="p-6 border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-stone-400 transition-all"
            >
              <h3 className="font-display text-xl text-stone-900 mb-2">👥 View Users</h3>
              <p className="text-stone-600 text-sm">See all registered users and their activity</p>
            </Link>
            <Link
              to="/admin/orders"
              className="p-6 border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-stone-400 transition-all"
            >
              <h3 className="font-display text-xl text-stone-900 mb-2">📦 View Orders</h3>
              <p className="text-stone-600 text-sm">See all placed orders and details</p>
            </Link>
            <Link
              to="/products"
              className="p-6 border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-stone-400 transition-all"
            >
              <h3 className="font-display text-xl text-stone-900 mb-2">🛍️ Manage Products</h3>
              <p className="text-stone-600 text-sm">Coming soon</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
