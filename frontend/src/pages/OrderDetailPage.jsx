/**
 * pages/OrderDetailPage.jsx — Single order confirmation & detail view
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { formatPrice, formatDate, getStatusColor } from '../utils/helpers';
import { PageLoader } from '../components/common/Spinner';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === '1';
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-24"><PageLoader /></div>;
  if (!order) return (
    <div className="pt-24 text-center py-24">
      <p className="font-display text-3xl text-stone-300">Order not found</p>
      <Link to="/orders" className="btn-primary mt-6 inline-flex">My Orders</Link>
    </div>
  );

  return (
    <div className="page-enter pt-24">
      <div className="section-wrapper py-12 max-w-4xl">

        {/* Success banner */}
        {isSuccess && (
          <div className="mb-10 p-6 bg-green-50 border border-green-200 animate-fade-in flex items-start gap-4">
            <span className="text-3xl">🎉</span>
            <div>
              <h2 className="font-display text-2xl text-green-800 mb-1">Order Placed!</h2>
              <p className="text-green-700 text-sm font-body">
                Your order has been confirmed. We'll start processing it right away.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-stone-400 mb-2">Order</p>
            <h1 className="font-display text-4xl text-stone-900">
              #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-stone-500 font-mono mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`badge border px-4 py-2 text-sm self-start ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        {/* Order Status Timeline */}
        <div className="mb-10 p-6 bg-white border border-stone-200 rounded-lg">
          <h3 className="font-display text-lg text-stone-900 mb-6">Order Progress</h3>
          <div className="flex items-center justify-between">
            {['pending', 'processing', 'shipped', 'delivered'].map((status, idx) => {
              const statusIndex = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status);
              const isCompleted = ['pending', 'processing', 'shipped', 'delivered'].indexOf(status) <= statusIndex;
              const isCancelled = order.status === 'cancelled';
              return (
                <div key={status} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-2 transition-all ${
                    isCancelled ? 'bg-red-100 text-red-700' :
                    isCompleted ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {isCancelled ? '✗' :
                     status === 'pending' ? '⏳' :
                     status === 'processing' ? '⚙️' :
                     status === 'shipped' ? '📦' : '✓'}
                  </div>
                  <p className="text-xs font-mono text-center capitalize">{status}</p>
                  {idx < 3 && (
                    <div className={`absolute w-24 h-1 mt-6 ml-12 ${
                      isCancelled ? 'bg-red-200' :
                      isCompleted ? 'bg-green-200' : 'bg-stone-200'
                    }`} style={{ marginLeft: `${100 * (idx + 1) / 4}px` }}></div>
                  )}
                </div>
              );
            })}
          </div>
          {order.status === 'cancelled' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              This order has been cancelled.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Items */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl text-stone-900 mb-5">Items Ordered</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i}
                  className="flex gap-4 items-center p-4 border border-stone-100 bg-white
                             opacity-0-start animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}>
                  <img src={item.image} alt={item.name}
                    className="w-16 h-16 object-cover bg-stone-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product}`}
                      className="font-display text-lg text-stone-900 hover:text-stone-600 transition-colors truncate block">
                      {item.name}
                    </Link>
                    <p className="text-xs font-mono text-stone-400">×{item.quantity}</p>
                  </div>
                  <span className="font-mono font-medium text-stone-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary column */}
          <div className="space-y-6">

            {/* Pricing breakdown */}
            <div className="bg-stone-50 border border-stone-200 p-5">
              <h3 className="font-display text-xl text-stone-900 mb-4">Summary</h3>
              <div className="space-y-2 text-sm">
                {[
                  ['Subtotal', formatPrice(order.itemsTotal)],
                  ['Shipping', order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)],
                  ['Tax', formatPrice(order.taxPrice)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-stone-600">{label}</span>
                    <span className={`font-mono ${value === 'Free' ? 'text-green-600' : ''}`}>{value}</span>
                  </div>
                ))}
                <div className="border-t border-stone-300 pt-2 flex justify-between font-medium">
                  <span className="font-body text-stone-900">Total</span>
                  <span className="font-mono text-lg text-stone-900">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Shipping info */}
            <div className="bg-stone-50 border border-stone-200 p-5">
              <h3 className="font-display text-xl text-stone-900 mb-4">Shipping To</h3>
              <div className="text-sm text-stone-600 font-body space-y-1">
                <p className="font-medium text-stone-800">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-stone-50 border border-stone-200 p-5">
              <h3 className="font-display text-xl text-stone-900 mb-3">Payment</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600">{order.paymentMethod}</span>
                <span className={`badge border ${order.isPaid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <Link to="/orders" className="btn-secondary px-8 py-3">← All Orders</Link>
          <Link to="/products" className="btn-ghost">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
