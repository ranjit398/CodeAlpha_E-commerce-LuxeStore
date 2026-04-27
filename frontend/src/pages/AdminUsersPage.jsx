/**
 * pages/AdminUsersPage.jsx — View all users with login status and delete ability
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { PageLoader } from '../components/common/Spinner';

const formatDate = (date) => new Date(date).toLocaleDateString();
const formatTime = (date) => new Date(date).toLocaleTimeString();

const formatLastLogin = (lastLoginAt) => {
  if (!lastLoginAt) return 'Never';
  const date = new Date(lastLoginAt);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (hours < 1) return 'Now';
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return `${formatDate(lastLoginAt)} ${formatTime(lastLoginAt)}`;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        setUsers(data.users);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    try {
      setDeleting(userId);
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      setConfirmDelete(null);
      toast.success(`User "${userName}" deleted successfully`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="section-wrapper py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-stone-500 hover:text-stone-900 text-sm mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="font-display text-4xl text-stone-900">Users</h1>
            <p className="text-stone-600 mt-1">Total: {users.length} registered users</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-100 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-mono text-stone-600">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-mono text-stone-600">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-mono text-stone-600">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-mono text-stone-600">Last Login</th>
                  <th className="px-6 py-4 text-left text-sm font-mono text-stone-600">Orders</th>
                  <th className="px-6 py-4 text-left text-sm font-mono text-stone-600">Total Spent</th>
                  <th className="px-6 py-4 text-left text-sm font-mono text-stone-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const totalSpent = user.orders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);
                  const isExpanded = expandedUser === user.id;
                  const isAdminUser = user.role === 'admin';
                  return (
                    <React.Fragment key={user.id}>
                      <tr className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4 font-display text-stone-900">{user.name} {isAdminUser && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded ml-2">ADMIN</span>}</td>
                        <td className="px-6 py-4 text-stone-600 text-sm">{user.email}</td>
                        <td className="px-6 py-4 text-stone-600 text-sm">{formatDate(user.createdAt)}</td>
                        <td className="px-6 py-4 text-stone-600 text-sm">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-mono ${
                            !user.lastLoginAt ? 'bg-red-50 text-red-700' :
                            new Date() - new Date(user.lastLoginAt) < 3600000 ? 'bg-green-50 text-green-700' :
                            'bg-yellow-50 text-yellow-700'
                          }`}>
                            {formatLastLogin(user.lastLoginAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-stone-900 font-mono font-bold">{user.orders.length}</td>
                        <td className="px-6 py-4 text-stone-900 font-mono">₹{parseFloat(totalSpent).toFixed(2)}</td>
                        <td className="px-6 py-4 space-x-2 flex items-center">
                          <button
                            onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                            className="text-blue-600 hover:text-blue-900 text-sm font-mono"
                          >
                            {isExpanded ? 'Hide' : 'View'}
                          </button>
                          {!isAdminUser && (
                            <>
                              {confirmDelete === user.id ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                    disabled={deleting === user.id}
                                    className="text-red-600 hover:text-red-900 text-xs font-mono font-bold disabled:opacity-50"
                                  >
                                    {deleting === user.id ? 'Deleting...' : 'Confirm'}
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="text-stone-600 hover:text-stone-900 text-xs font-mono"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDelete(user.id)}
                                  className="text-red-600 hover:text-red-900 text-sm font-mono"
                                >
                                  Delete
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                      {isExpanded && user.orders.length > 0 && (
                        <tr className="bg-stone-50 border-b border-stone-100">
                          <td colSpan="7" className="px-6 py-6">
                            <div>
                              <h4 className="font-display text-sm text-stone-900 mb-4">Orders:</h4>
                              <div className="space-y-3">
                                {user.orders.map((order) => (
                                  <div key={order.id} className="border border-stone-200 rounded p-3 bg-white">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-mono text-sm text-stone-600">#{order.id.slice(-8).toUpperCase()}</p>
                                        <p className="text-sm text-stone-900 mt-1">
                                          {formatDate(order.createdAt)} {formatTime(order.createdAt)}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-mono font-bold text-stone-900">₹{parseFloat(order.totalPrice).toFixed(2)}</p>
                                        <span className={`text-xs font-mono px-2 py-1 rounded-full ${
                                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                          'bg-green-100 text-green-700'
                                        }`}>
                                          {order.status}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="text-center py-12 text-stone-400">
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
