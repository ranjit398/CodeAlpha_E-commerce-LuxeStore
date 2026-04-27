/**
 * utils/helpers.js — Formatting and utility functions
 */

/** Format a number as INR currency */
export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

/** Truncate text to a max length */
export const truncate = (str, max = 80) =>
  str.length <= max ? str : str.slice(0, max) + '…';

/** Get status badge color classes */
export const getStatusColor = (status) => {
  const map = {
    pending:    'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped:    'bg-purple-50 text-purple-700 border-purple-200',
    delivered:  'bg-green-50 text-green-700 border-green-200',
    cancelled:  'bg-red-50 text-red-700 border-red-200',
  };
  return map[status] || 'bg-stone-100 text-stone-600 border-stone-200';
};

/** Render star rating as a string */
export const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return { full, half, empty: 5 - full - (half ? 1 : 0) };
};

/** Format a date string */
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
