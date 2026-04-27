/**
 * components/common/ProductCard.jsx — Product grid card
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please sign in to add items to cart'); return; }
    if (product.countInStock === 0) return;
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error('Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white border border-stone-100 overflow-hidden
                 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]
                 hover:shadow-amber-900/5 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-stone-100">
        {!imageLoaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500
                      group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Out-of-stock overlay */}
        {product.countInStock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge bg-stone-100 text-stone-500 border border-stone-200">Sold Out</span>
          </div>
        )}

        {/* Quick-add button */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full
                        group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={adding || product.countInStock === 0}
            className="w-full py-3 bg-stone-900 text-white text-xs font-mono tracking-widest
                       uppercase hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {adding ? 'Adding…' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-[10px] font-mono tracking-widest uppercase text-stone-400 mb-1">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="font-display text-lg font-normal text-stone-900 leading-snug
                       group-hover:text-stone-600 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Rating + Price */}
        <div className="flex items-center justify-between mt-2">
          <StarRating rating={product.rating} count={product.numReviews} />
          <span className="font-mono font-medium text-stone-900">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-stone-200'}`}
            fill="currentColor" viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-[10px] text-stone-400 font-mono">({count})</span>
    </div>
  );
}
