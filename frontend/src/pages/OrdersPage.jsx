/**
 * pages/OrdersPage.jsx — User's order history
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatPrice, formatDate, getStatusColor } from '../utils/helpers';
import { PageLoader } from '../components/common/Spinner';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-24"><PageLoader /></div>;

  return (
    <div className="page-enter pt-24">
      <div className="section-wrapper py-12">
        <div className="mb-10">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-stone-400 mb-2">Account</p>
          <h1 className="font-display text-5xl text-stone-900">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-stone-200">
            <p className="font-display text-4xl text-stone-200 mb-4">No orders yet</p>
            <p className="text-stone-400 text-sm mb-8">Start shopping to see your orders here</p>
            <Link to="/products" className="btn-primary px-10 py-3.5">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block card p-6 hover:border-stone-300 transition-all duration-200
                           opacity-0-start animate-fade-up group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-4 items-center">
                    {/* Product thumbnails */}
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, j) => (
                        <img key={j} src={item.image} alt={item.name}
                          className="w-12 h-12 object-cover border-2 border-white rounded-sm" />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 bg-stone-100 border-2 border-white flex items-center
                                        justify-center text-xs font-mono text-stone-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-mono text-xs text-stone-400 mb-1">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-stone-700 font-body">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className={`badge border px-3 py-1 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="font-mono font-medium text-stone-900 text-lg">
                      {formatPrice(order.totalPrice)}
                    </span>
                    <svg className="w-4 h-4 text-stone-300 group-hover:text-stone-700 transition-colors"
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
