/**
 * pages/CartPage.jsx — Shopping cart with quantity controls
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import { PageLoader } from '../components/common/Spinner';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, cartTotal, cartLoading, updateItem, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);

  if (!user) {
    return (
      <div className="pt-24 page-enter">
        <div className="section-wrapper py-24 text-center">
          <p className="font-display text-5xl text-stone-200 mb-6">Your cart</p>
          <p className="text-stone-500 mb-8 font-body">Sign in to view and manage your cart</p>
          <Link to="/login" className="btn-primary px-10 py-4">Sign In</Link>
        </div>
      </div>
    );
  }

  if (cartLoading) return <div className="pt-24"><PageLoader /></div>;

  const items = cart.items || [];
  const shipping = cartTotal > 8000 ? 0 : cartTotal > 0 ? 199 : 0;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shipping + tax;

  const handleQuantityChange = async (itemId, newQty) => {
    setUpdatingId(itemId);
    try {
      await updateItem(itemId, newQty);
    } catch { toast.error('Could not update quantity'); }
    finally { setUpdatingId(null); }
  };

  const handleRemove = async (itemId, name) => {
    try {
      await removeItem(itemId);
      toast.success(`${name} removed`);
    } catch { toast.error('Could not remove item'); }
  };

  return (
    <div className="page-enter pt-24">
      <div className="section-wrapper py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-stone-400 mb-2">Your selection</p>
          <h1 className="font-display text-5xl text-stone-900">
            Cart
            {items.length > 0 && (
              <span className="font-mono text-2xl text-stone-400 ml-3">({items.length})</span>
            )}
          </h1>
          {items.length > 0 && (
            <button
              onClick={() => { if (window.confirm('Clear all items?')) clearCart(); }}
              className="text-xs font-mono text-stone-400 hover:text-red-500 mt-2 flex items-center gap-1 transition-colors"
            >
              <TrashIcon className="w-3 h-3" /> Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24 border border-dashed border-stone-200">
            <p className="font-display text-4xl text-stone-200 mb-4">Empty</p>
            <p className="text-stone-400 text-sm mb-8 font-body">Your cart is waiting to be filled</p>
            <Link to="/products" className="btn-primary px-10 py-3.5">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── Items list ── */}
            <div className="lg:col-span-2 space-y-0">
              {/* Header row */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-6
                              pb-3 border-b border-stone-200 text-[10px] font-mono
                              tracking-widest uppercase text-stone-400">
                <span>Product</span>
                <span className="text-right">Price</span>
                <span className="text-center w-28">Quantity</span>
                <span className="text-right">Subtotal</span>
              </div>

              {items.map((item) => {
                const prod = item.product;
                const isUpdating = updatingId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-4 sm:gap-6
                                py-6 border-b border-stone-100 items-center
                                transition-opacity ${isUpdating ? 'opacity-50' : 'opacity-100'}`}
                  >
                    {/* Product info */}
                    <div className="flex gap-4 items-center">
                      <Link to={`/products/${prod.id}`}
                        className="w-20 h-20 overflow-hidden bg-stone-100 flex-shrink-0">
                        <img src={prod.image} alt={prod.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </Link>
                      <div>
                        <Link to={`/products/${prod.id}`}
                          className="font-display text-lg text-stone-900 hover:text-stone-600 transition-colors">
                          {prod.name}
                        </Link>
                        <p className="text-xs font-mono text-stone-400 mt-0.5">{prod.category}</p>
                        {/* Mobile price */}
                        <p className="sm:hidden font-mono text-sm text-stone-700 mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    {/* Price (desktop) */}
                    <span className="hidden sm:block font-mono text-sm text-stone-700 text-right">
                      {formatPrice(item.price)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-0 w-28">
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isUpdating}
                      >−</button>
                      <span className="flex-1 h-8 flex items-center justify-center
                                       border-y border-stone-200 font-mono text-sm">
                        {item.quantity}
                      </span>
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={isUpdating}
                      >+</button>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item.id, prod.name)}
                        className="ml-3 text-stone-300 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="font-mono text-sm font-medium text-stone-900 sm:text-right">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                );
              })}

              <div className="pt-4">
                <Link to="/products" className="btn-ghost text-sm text-stone-500">
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* ── Order summary ── */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-stone-50 border border-stone-200 p-6">
                <h2 className="font-display text-2xl text-stone-900 mb-6">Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600 font-body">Subtotal</span>
                    <span className="font-mono">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600 font-body">Shipping</span>
                    <span className="font-mono">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600 font-body">Tax (8%)</span>
                    <span className="font-mono">{formatPrice(tax)}</span>
                  </div>

                  {shipping > 0 && (
                    <p className="text-[11px] text-stone-400 font-mono bg-amber-50 px-3 py-2 border border-amber-100">
                      Add {formatPrice(8000 - cartTotal)} more for free shipping
                    </p>
                  )}

                  <div className="border-t border-stone-300 pt-3 flex justify-between font-medium">
                    <span className="font-body text-stone-900">Total</span>
                    <span className="font-mono text-lg text-stone-900">{formatPrice(orderTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-primary w-full mt-6 py-4"
                >
                  Proceed to Checkout
                </button>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <LockIcon className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-[11px] text-stone-400 font-mono">Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
  </svg>
);
