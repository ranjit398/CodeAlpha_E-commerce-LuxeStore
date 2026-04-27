/**
 * pages/ProductsPage.jsx — Browseable product catalog with filters
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import { PageLoader } from '../components/common/Spinner';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Accessories', 'Home'];
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]  = useState([]);
  const [loading, setLoading]    = useState(true);
  const [total, setTotal]        = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const category = searchParams.get('category') || 'All';
  const sort     = searchParams.get('sort')     || 'newest';
  const search   = searchParams.get('search')   || '';
  const page     = Number(searchParams.get('page') || 1);

  const [searchInput, setSearchInput] = useState(search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort, page, limit: 8 });
      if (category !== 'All') params.set('category', category);
      if (search) params.set('search', search);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, sort, search, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'All') next.set(key, value);
    else next.delete(key);
    next.delete('page'); // reset page on filter change
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  return (
    <div className="page-enter pt-24">
      <div className="section-wrapper py-12">

        {/* ── Page Header ── */}
        <div className="mb-10">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-stone-400 mb-2">LuxeStore</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="font-display text-5xl text-stone-900">
              {category === 'All' ? 'All Products' : category}
            </h1>
            <p className="text-sm text-stone-500 font-mono">{total} items</p>
          </div>
        </div>

        {/* ── Filters Bar ── */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10 pb-8 border-b border-stone-200">

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products…"
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary px-4 py-2">
              <SearchIcon className="w-4 h-4" />
            </button>
          </form>

          {/* Category tabs */}
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => updateParam('category', cat)}
                className={`px-4 py-2 text-xs font-mono tracking-wide transition-all duration-200 ${
                  category === cat
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-900 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="input-field max-w-[200px] cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* ── Products Grid ── */}
        {loading ? (
          <PageLoader />
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl text-stone-300 mb-4">No products found</p>
            <p className="text-stone-400 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <div
                key={product.id}
                className="opacity-0-start animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <button
              onClick={() => updateParam('page', page - 1)}
              disabled={page === 1}
              className="btn-secondary py-2 px-4 disabled:opacity-30"
            >
              ← Prev
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => updateParam('page', p)}
                  className={`w-10 h-10 text-sm font-mono transition-all ${
                    p === page
                      ? 'bg-stone-900 text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => updateParam('page', page + 1)}
              disabled={page === totalPages}
              className="btn-secondary py-2 px-4 disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
