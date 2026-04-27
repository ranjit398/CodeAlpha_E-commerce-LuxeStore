import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { PageLoader } from '../components/common/Spinner';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const formatDateTime = (date) =>
  new Date(date).toLocaleString();

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data.orders);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdating(id);
      const { data } = await api.patch(`/admin/orders/${id}`, { status });

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? data.order : o))
      );

      toast.success(`Updated to ${status}`);
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-8">
          <Link to="/admin" className="text-sm text-stone-500 hover:text-black">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-2">Admin Orders</h1>
          <p className="text-stone-500 text-sm">{orders.length} total orders</p>
        </div>

        {/* EMPTY */}
        {orders.length === 0 && (
          <div className="bg-white p-6 text-center border rounded">
            No orders found
          </div>
        )}

        {/* ORDERS */}
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen = expandedOrder === order.id;

            return (
              <div key={order.id} className="bg-white border rounded shadow-sm">

                {/* TOP BAR */}
                <div
                  onClick={() => setExpandedOrder(isOpen ? null : order.id)}
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                >
                  <div>
                    <p className="text-xs text-gray-500">
                      #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm font-medium">
                      {order.user.name}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{order.totalPrice}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.items.length} items
                    </p>
                  </div>
                </div>

                {/* DETAILS */}
                {isOpen && (
                  <div className="border-t p-4 space-y-4">

                    {/* STATUS */}
                    <div className="flex gap-2 flex-wrap">
                      {ORDER_STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(order.id, s)}
                          disabled={updating === order.id}
                          className={`px-3 py-1 text-xs rounded border ${
                            order.status === s
                              ? 'bg-black text-white'
                              : 'bg-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {/* USER INFO */}
                    <div className="text-sm text-gray-600">
                      <p><b>User:</b> {order.user.email}</p>
                      <p><b>Date:</b> {formatDateTime(order.createdAt)}</p>
                      <p><b>Payment:</b> {order.paymentMethod}</p>
                    </div>

                    {/* ITEMS */}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm border p-2 rounded"
                        >
                          <span>{item.name} × {item.quantity}</span>
                          <span>₹{item.price}</span>
                        </div>
                      ))}
                    </div>

                    {/* TOTAL */}
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>₹{order.totalPrice}</span>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}