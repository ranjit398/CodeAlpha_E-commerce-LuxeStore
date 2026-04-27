/**
 * context/CartContext.jsx — Global cart state with backend sync
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart]       = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [] });
  }, [user]);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (err) {
      console.error('Cart fetch error:', err);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const { data } = await api.post('/cart', { productId, quantity });
    setCart(data);
    return data;
  }, []);

  const updateItem = useCallback(async (itemId, quantity) => {
    const { data } = await api.put(`/cart/${itemId}`, { quantity });
    setCart(data);
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const { data } = await api.delete(`/cart/${itemId}`);
    setCart(data);
  }, []);

  const clearCart = useCallback(async () => {
    await api.delete('/cart');
    setCart({ items: [] });
  }, []);

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart, cartLoading, cartCount, cartTotal,
      addToCart, updateItem, removeItem, clearCart, fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
