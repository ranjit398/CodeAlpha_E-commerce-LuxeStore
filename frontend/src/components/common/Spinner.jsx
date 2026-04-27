/**
 * components/common/Spinner.jsx
 */

import React from 'react';

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin`} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
