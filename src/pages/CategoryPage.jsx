import React, { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../data/products';

export const CategoryPage = ({ categoryId = 'all', navigate }) => {
  const [activeCategory, setActiveCategory] = useState(categoryId || 'all');

  const currentCategoryInfo = CATEGORIES.find((c) => c.id === activeCategory);

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Default sort by popular
    list.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);

    return list;
  }, [activeCategory]);

  return (
    <div className="category-page animate-fade-in">
      {/* 1. FULL-WIDTH PROMOTIONAL BANNER (Starts immediately below header, touches left & right edges, zero gap) */}
      <div
        className="category-promo-banner-full"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(7, 84, 55, 0.94) 0%, rgba(7, 84, 55, 0.82) 44%, rgba(0, 0, 0, 0.25) 100%), url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80')`
        }}
      >
        <div className="app-container promo-content-wrap">
          <div className="promo-banner-content">
            <span className="promo-banner-tag">WEEKEND SPECIAL</span>
            <h2 className="promo-banner-title">Prime Cuts. Up to 21% Off.</h2>
            <button
              className="btn-promo-explore"
              onClick={() => navigate('/offers')}
            >
              <span>Explore Offers</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORY CONTENT */}
      <div className="app-container category-main-container">
        {/* 2. HORIZONTAL SCROLLING CATEGORY NAMES */}
        <div className="category-tabs-bar">
          <button
            className={`cat-tab-chip ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Cuts
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`cat-tab-chip ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 3. "ALL FRESH CUTS" HEADING + SHORT DESCRIPTION */}
        <div className="category-intro-section">
          <h1 className="cat-page-title">
            {activeCategory === 'all'
              ? 'All Fresh Cuts'
              : currentCategoryInfo?.name || 'Fresh Meat & Seafood'}
          </h1>
          <p className="cat-page-desc">
            {activeCategory === 'all'
              ? 'Browse our complete catalog of farm-fresh poultry, tender mutton, and day-catch seafood.'
              : currentCategoryInfo?.description}
          </p>
        </div>

        {/* 4. PRODUCT GRID (Filter completely removed) */}
        {filteredProducts.length === 0 ? (
          <div className="empty-category-view">
            <h3>No products found</h3>
            <p>Try switching categories to view available fresh cuts.</p>
            <button
              className="btn btn-primary"
              onClick={() => setActiveCategory('all')}
            >
              Show All Cuts
            </button>
          </div>
        ) : (
          <div className="products-grid category-products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .category-page {
          padding-top: 0 !important; /* Zero gap between header and banner */
          padding-bottom: 36px;
        }

        /* Full-width promotional banner */
        .category-promo-banner-full {
          position: relative;
          width: 100%;
          margin: 0;
          border-radius: 0; /* Touches left and right edges, no rounded container restricting width */
          background-size: cover;
          background-position: center right;
          background-repeat: no-repeat;
          padding: 22px 0;
          min-height: 140px;
          display: flex;
          align-items: center;
          box-shadow: var(--shadow-sm);
        }

        @media (min-width: 768px) {
          .category-promo-banner-full {
            padding: 30px 0;
            min-height: 165px;
          }
        }

        .promo-content-wrap {
          width: 100%;
        }

        .promo-banner-content {
          position: relative;
          z-index: 2;
          max-width: 320px;
        }

        .promo-banner-tag {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--brand-yellow);
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 4px;
        }

        .promo-banner-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.2;
          margin-bottom: 12px;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
        }

        @media (min-width: 768px) {
          .promo-banner-title {
            font-size: 1.8rem;
          }
        }

        .btn-promo-explore {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #FFFFFF;
          color: var(--deep-forest-green);
          padding: 7px 16px;
          font-size: 0.8rem;
          font-weight: 800;
          border-radius: var(--radius-sm);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
          transition: transform var(--transition-fast), background var(--transition-fast);
        }

        .btn-promo-explore:hover {
          background-color: var(--warm-ivory);
        }

        .btn-promo-explore:active {
          transform: scale(0.96);
        }

        .category-main-container {
          padding-top: 16px;
        }

        .category-tabs-bar {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          margin-bottom: 14px;
          scrollbar-width: none;
        }

        .category-tabs-bar::-webkit-scrollbar {
          display: none;
        }

        .cat-tab-chip {
          padding: 8px 18px;
          border-radius: var(--radius-pill);
          background: var(--surface-white);
          border: 1.5px solid var(--border-color);
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-dark);
          white-space: nowrap;
          transition: all var(--transition-fast);
        }

        .cat-tab-chip:hover {
          border-color: var(--primary-green);
        }

        .cat-tab-chip.active {
          background-color: var(--primary-green);
          color: #FFFFFF;
          border-color: var(--primary-green);
          box-shadow: 0 2px 8px rgba(0, 103, 56, 0.2);
        }

        .category-intro-section {
          margin-bottom: 18px;
        }

        .cat-page-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--charcoal);
          line-height: 1.2;
          margin-bottom: 4px;
        }

        .cat-page-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          max-width: 680px;
          line-height: 1.4;
        }

        .empty-category-view {
          text-align: center;
          padding: 60px 20px;
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
        }

        .empty-category-view h3 {
          font-size: 1.25rem;
          color: var(--text-dark);
          margin-bottom: 6px;
        }

        .empty-category-view p {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 18px;
        }

        /* Product Grid: 2-column on mobile, 3 on tablet, 4 on desktop */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        @media (min-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
        }

        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};
