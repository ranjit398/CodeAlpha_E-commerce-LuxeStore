/**
 * components/common/AdminRoute.jsx — Route protection for admin only
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-900" />
      </div>
    );
  }

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
