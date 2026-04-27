/**
 * pages/CheckoutPage.jsx — Order placement form
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  fullName: '', address: '', city: '', postalCode: '', country: 'India',
  paymentMethod: 'Card',
};

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm]       = useState(INITIAL_FORM);
  const [errors, setErrors]   = useState({});
  const [placing, setPlacing] = useState(false);
  const [step, setStep]       = useState(1); // 1 = shipping, 2 = payment

  const items = cart.items || [];
  const shipping = cartTotal > 8000 ? 0 : 199;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateShipping = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Required';
    if (!form.address.trim()) errs.address = 'Required';
    if (!form.city.trim()) errs.city = 'Required';
    if (!form.postalCode.trim()) errs.postalCode = 'Required';
    if (!form.country.trim()) errs.country = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateShipping()) { setStep(1); return; }
    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
      });
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.id}?success=1`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page-enter pt-24">
      <div className="section-wrapper py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-stone-400 mb-2">Final step</p>
          <h1 className="font-display text-5xl text-stone-900">Checkout</h1>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-4 mb-10">
          {['Shipping', 'Payment'].map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => i === 0 && setStep(1)}
                className={`flex items-center gap-2 text-sm font-mono ${step === i + 1 ? 'text-stone-900' : 'text-stone-400'}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                  ${step === i + 1 ? 'bg-stone-900 text-white' :
                    step > i + 1 ? 'bg-green-500 text-white' : 'border border-stone-300 text-stone-400'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </span>
                {s}
              </button>
              {i < 1 && <div className={`flex-1 h-px max-w-[60px] ${step > 1 ? 'bg-stone-900' : 'bg-stone-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Form ── */}
          <div className="lg:col-span-2">

            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="font-display text-2xl text-stone-900 mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-stone-500 uppercase tracking-wide mb-2">
                      Full Name
                    </label>
                    <input name="fullName" value={form.fullName} onChange={handleChange}
                      className={`input-field ${errors.fullName ? 'border-red-400' : ''}`}
                      placeholder="Jane Smith" />
                    {errors.fullName && <p className="text-xs text-red-500 mt-1 font-mono">{errors.fullName}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-stone-500 uppercase tracking-wide mb-2">
                      Street Address
                    </label>
                    <input name="address" value={form.address} onChange={handleChange}
                      className={`input-field ${errors.address ? 'border-red-400' : ''}`}
                      placeholder="123 Main Street, Apt 4B" />
                    {errors.address && <p className="text-xs text-red-500 mt-1 font-mono">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-stone-500 uppercase tracking-wide mb-2">City</label>
                    <input name="city" value={form.city} onChange={handleChange}
                      className={`input-field ${errors.city ? 'border-red-400' : ''}`}
                      placeholder="Mumbai" />
                    {errors.city && <p className="text-xs text-red-500 mt-1 font-mono">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-stone-500 uppercase tracking-wide mb-2">
                      Postal Code
                    </label>
                    <input name="postalCode" value={form.postalCode} onChange={handleChange}
                      className={`input-field ${errors.postalCode ? 'border-red-400' : ''}`}
                      placeholder="400001" />
                    {errors.postalCode && <p className="text-xs text-red-500 mt-1 font-mono">{errors.postalCode}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-stone-500 uppercase tracking-wide mb-2">Country</label>
                    <input name="country" value={form.country} onChange={handleChange}
                      className={`input-field ${errors.country ? 'border-red-400' : ''}`}
                      placeholder="India" />
                    {errors.country && <p className="text-xs text-red-500 mt-1 font-mono">{errors.country}</p>}
                  </div>
                </div>

                <button onClick={() => { if (validateShipping()) setStep(2); }}
                  className="btn-primary mt-8 px-10 py-4">
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="font-display text-2xl text-stone-900 mb-6">Payment Method</h2>

                <div className="space-y-3 mb-8">
                  {[
                    { value: 'Card',   label: 'Credit / Debit Card', icon: '💳' },
                    { value: 'PayPal', label: 'PayPal',               icon: '🅿️' },
                    { value: 'Cash',   label: 'Cash on Delivery',     icon: '💵' },
                  ].map(({ value, label, icon }) => (
                    <label key={value}
                      className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${
                        form.paymentMethod === value
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-400'
                      }`}>
                      <input type="radio" name="paymentMethod" value={value}
                        checked={form.paymentMethod === value}
                        onChange={handleChange}
                        className="accent-stone-900 w-4 h-4" />
                      <span className="text-xl">{icon}</span>
                      <span className="font-body text-stone-800">{label}</span>
                    </label>
                  ))}
                </div>

                {/* Simulated card fields */}
                {form.paymentMethod === 'Card' && (
                  <div className="space-y-4 p-5 bg-stone-50 border border-stone-200 mb-8">
                    <p className="text-xs font-mono text-stone-500 uppercase tracking-wider">
                      Demo — No real payment processed
                    </p>
                    <input className="input-field" placeholder="Card number: 4242 4242 4242 4242" disabled />
                    <div className="grid grid-cols-2 gap-4">
                      <input className="input-field" placeholder="MM/YY" disabled />
                      <input className="input-field" placeholder="CVV" disabled />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="btn-secondary px-8 py-4">← Back</button>
                  <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary flex-1 py-4">
                    {placing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Placing Order…
                      </>
                    ) : `Place Order — ${formatPrice(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-stone-50 border border-stone-200 p-6">
              <h3 className="font-display text-xl text-stone-900 mb-5">Order Review</h3>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.product.image} alt={item.product.name}
                      className="w-12 h-12 object-cover bg-stone-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body text-stone-800 truncate">{item.product.name}</p>
                      <p className="text-xs font-mono text-stone-400">×{item.quantity}</p>
                    </div>
                    <span className="font-mono text-sm text-stone-700 flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-mono">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Shipping</span>
                  <span className="font-mono">{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Tax</span>
                  <span className="font-mono">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-stone-300">
                  <span className="font-body text-stone-900">Total</span>
                  <span className="font-mono text-base text-stone-900">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
