/**
 * pages/HomePage.jsx — Landing page with hero, categories, and products
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import { PageLoader } from '../components/common/Spinner';

const CATEGORIES = [
  { name: 'Electronics', emoji: '⚡', desc: 'Premium tech', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80' },
  { name: 'Clothing',    emoji: '✦',  desc: 'Refined fits', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80' },
  { name: 'Accessories', emoji: '◈',  desc: 'Curated extras', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80' },
  { name: 'Home',        emoji: '⬡',  desc: 'Living better', image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&q=80' },
  { name: 'Furniture',   emoji: '🪑', desc: 'Modern icons',  image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&q=80' },
  { name: 'Fragrance',   emoji: '✨', desc: 'Scented soul',  image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80' },
  { name: 'Footwear',    emoji: '👟', desc: 'Step forward',  image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80' },
  { name: 'Wellness',    emoji: '🌿', desc: 'Inner balance',  image: 'https://images.unsplash.com/photo-1602928294221-441f23d831fe?w=400&q=80' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products?limit=4&sort=rating');
        setFeatured(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="page-enter">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-stone-950">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #78716c 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #57534e 0%, transparent 40%)`,
          }}
        />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="section-wrapper relative z-10 py-24">
          <div className="max-w-3xl">
            {/* Pre-heading */}
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-400 mb-6 opacity-0-start animate-fade-in">
              New Collection 2025
            </p>

            {/* Main heading */}
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl text-white font-light leading-[0.95] mb-8
                           opacity-0-start animate-fade-up animate-delay-100">
              Refined
              <br />
              <em className="text-stone-400">Essentials</em>
              <br />
              for Modern
              <br />
              Living
            </h1>

            <p className="text-stone-400 text-lg font-body font-light max-w-md leading-relaxed mb-10
                          opacity-0-start animate-fade-up animate-delay-200">
              Thoughtfully curated products that blend form and function. Only the best makes the cut.
            </p>

            <div className="flex flex-wrap gap-4 opacity-0-start animate-fade-up animate-delay-300">
              <button
                onClick={() => navigate('/products')}
                className="btn-primary bg-white text-stone-900 hover:bg-stone-100 px-10 py-4 text-sm"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/products?sort=newest')}
                className="btn-secondary border-stone-700 text-stone-400 hover:border-stone-400 hover:text-white hover:bg-transparent px-8 py-4"
              >
                New Arrivals
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-16 pt-8 border-t border-stone-800
                            opacity-0-start animate-fade-up animate-delay-400">
              {[['500+', 'Products'], ['4.8★', 'Avg Rating'], ['Free', 'Over ₹8000']].map(([val, label]) => (
                <div key={label}>
                  <p className="font-mono text-xl font-medium text-white">{val}</p>
                  <p className="text-xs text-stone-600 mt-0.5 tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] font-mono text-stone-600 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-stone-600 to-transparent" />
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-stone-50">
        <div className="section-wrapper">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-stone-400 mb-3">Browse by</p>
              <h2 className="font-display text-4xl text-stone-900">Categories</h2>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-2 text-sm text-stone-500
                                            hover:text-stone-900 transition-colors font-body">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className={`group relative overflow-hidden aspect-square bg-stone-200
                            opacity-0-start animate-fade-up`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover
                             transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] font-mono tracking-widest text-stone-400 mb-1">{cat.desc}</p>
                  <h3 className="font-display text-xl text-white font-light">{cat.name}</h3>
                </div>
                <div className="absolute top-4 right-4 text-2xl opacity-70">{cat.emoji}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="section-wrapper">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-stone-400 mb-3">Handpicked</p>
              <h2 className="font-display text-4xl text-stone-900">Top Rated</h2>
            </div>
            <Link to="/products?sort=rating"
              className="hidden sm:flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors font-body">
              See All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <PageLoader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product, i) => (
                <div key={product.id}
                  className="opacity-0-start animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Banner ───────────────────────────────────────────────────────── */}
      <section className="py-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-stone-900 p-12 lg:p-20 flex flex-col lg:flex-row
                          items-center justify-between gap-8">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)`,
                backgroundSize: '20px 20px',
              }}
            />
            <div className="relative z-10 text-center lg:text-left">
              <p className="font-mono text-xs text-amber-400 tracking-widest uppercase mb-3">Limited time</p>
              <h2 className="font-display text-4xl lg:text-5xl text-white font-light mb-3">
                Free Shipping
              </h2>
              <p className="text-stone-400 font-body text-lg">On all orders over ₹8000</p>
            </div>
            <div className="relative z-10">
              <Link to="/products" className="btn-primary bg-white text-stone-900 hover:bg-stone-100 px-10 py-4">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);
