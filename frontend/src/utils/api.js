/**
 * utils/api.js — Axios instance with auth token injection
 */

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('luxe_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Token expired — clear storage
      localStorage.removeItem('luxe_token');
      localStorage.removeItem('luxe_user');
    }
    return Promise.reject(err);
  }
);

export default api;
