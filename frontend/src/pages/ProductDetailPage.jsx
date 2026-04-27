/**
 * pages/ProductDetailPage.jsx — Single product view
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import { PageLoader } from '../components/common/Spinner';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding]     = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch { /* handled below */ }
      finally { setLoading(false); }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please sign in first'); return; }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`Added ${quantity} × ${product.name} to cart`);
    } catch {
      toast.error('Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="pt-24"><PageLoader /></div>;
  if (!product) return (
    <div className="pt-24 text-center py-24">
      <p className="font-display text-3xl text-stone-300">Product not found</p>
      <Link to="/products" className="btn-primary mt-6 inline-flex">Back to Shop</Link>
    </div>
  );

  const inStock = product.countInStock > 0;

  return (
    <div className="page-enter pt-24">
      <div className="section-wrapper py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-stone-400 mb-10">
          <Link to="/" className="hover:text-stone-700">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-stone-700">Shop</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-stone-700">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-stone-700 truncate max-w-[150px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Image ── */}
          <div className="relative">
            <div className="aspect-square overflow-hidden bg-stone-100">
              {!imgLoaded && <div className="absolute inset-0 skeleton" />}
              <img
                src={product.image}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500
                            ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
            {/* Category tag */}
            <div className="absolute top-4 left-4">
              <span className="badge bg-white/90 text-stone-600 border border-stone-200 backdrop-blur-sm">
                {product.category}
              </span>
            </div>
          </div>

          {/* ── Info ── */}
          <div className="flex flex-col justify-center">

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-xs font-mono text-stone-500">
                {inStock ? `${product.countInStock} in stock` : 'Out of stock'}
              </span>
            </div>

            <h1 className="font-display text-4xl lg:text-5xl text-stone-900 font-light leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className={`w-4 h-4 ${s <= Math.round(Number(product.rating)) ? 'text-amber-400' : 'text-stone-200'}`}
                    fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm text-stone-500 font-mono">
                {Number(product.rating).toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <span className="font-mono text-4xl font-medium text-stone-900">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Description */}
            <p className="text-stone-600 font-body leading-relaxed mb-8 text-base">
              {product.description}
            </p>

            <div className="divider !mt-0" />

            {/* Quantity selector */}
            {inStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">Qty</span>
                <div className="flex items-center gap-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="qty-btn"
                    disabled={quantity <= 1}
                  >−</button>
                  <span className="w-12 h-8 flex items-center justify-center
                                   border-y border-stone-200 font-mono text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.countInStock, q + 1))}
                    className="qty-btn"
                    disabled={quantity >= product.countInStock}
                  >+</button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock || adding}
              className="btn-primary w-full py-4 text-sm"
            >
              {adding ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding…
                </>
              ) : inStock ? (
                <>
                  <CartIcon className="w-4 h-4" />
                  Add to Cart — {formatPrice(product.price * quantity)}
                </>
              ) : 'Out of Stock'}
            </button>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-stone-100">
              {[
                { icon: '🚚', label: 'Free shipping', sub: 'over ₹8000' },
                { icon: '↩️', label: 'Easy returns', sub: '30-day policy' },
                { icon: '🔒', label: 'Secure checkout', sub: 'SSL encrypted' },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="text-center">
                  <p className="text-xl mb-1">{icon}</p>
                  <p className="text-xs font-medium text-stone-700">{label}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            </div>
          </div>

          <RelatedProducts category={product.category} excludeId={product.id} />
        </div>
      </div>
    );
  }

function RelatedProducts({ category, excludeId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/products?category=${category}&limit=4`);
        setProducts(data.products.filter(p => p.id !== excludeId).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category, excludeId]);

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section className="mt-24 pt-24 border-t border-stone-100">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-2">You might also like</p>
          <h2 className="font-display text-3xl text-stone-900">Related Pieces</h2>
        </div>
        <Link to={`/products?category=${category}`} className="text-sm text-stone-500 hover:text-stone-900 transition-colors font-body">
          View All {category} →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="animate-fade-up">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden bg-stone-100 mb-4 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
           <span className="badge bg-white/90 text-[10px] uppercase tracking-wider text-stone-600">
             {product.category}
           </span>
        </div>
      </div>
      <h3 className="font-display text-lg text-stone-900 mb-1 group-hover:text-stone-600 transition-colors truncate">
        {product.name}
      </h3>
      <p className="font-mono text-sm text-stone-500">{formatPrice(product.price)}</p>
    </Link>
  );
};

const CartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75M7.5 14.25L5.106 5.272M7.5 14.25h9.375M17.25 14.25l1.5-6.75H5.106"/>
    <circle cx="9" cy="19.5" r="1" fill="currentColor" stroke="none"/>
    <circle cx="18" cy="19.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
