import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../data/products';

export const CategoryPage = ({ categoryId = 'all', navigate }) => {
  const [activeCategory, setActiveCategory] = useState(categoryId || 'all');
  const [sortBy, setSortBy] = useState('popular');
  const [filterCutType, setFilterCutType] = useState('all');

  const currentCategoryInfo = CATEGORIES.find((c) => c.id === activeCategory);

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Cut type filter
    if (filterCutType === 'curry') {
      list = list.filter((p) => p.name.toLowerCase().includes('curry'));
    } else if (filterCutType === 'boneless') {
      list = list.filter((p) => p.name.toLowerCase().includes('boneless'));
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.weights[0].price - b.weights[0].price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.weights[0].price - a.weights[0].price);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => b.weights[0].discount - a.weights[0].discount);
    } else {
      // Popular (rating * reviewCount)
      list.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
    }

    return list;
  }, [activeCategory, filterCutType, sortBy]);

  return (
    <div className="category-page animate-fade-in">
      <div className="app-container">
        {/* 1. PROMOTIONAL BANNER (Immediately below minimal header) */}
        <div
          className="category-promo-banner"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(7, 84, 55, 0.94) 0%, rgba(7, 84, 55, 0.82) 44%, rgba(0, 0, 0, 0.25) 100%), url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80')`
          }}
        >
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

        {/* 4. FILTER / SORT: All Types | Curry Cut | Boneless & Sort: Most Popular */}
        <div className="controls-bar">
          <div className="cut-type-filters">
            <button
              className={`filter-btn-pill ${filterCutType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCutType('all')}
            >
              All Types
            </button>
            <button
              className={`filter-btn-pill ${filterCutType === 'curry' ? 'active' : ''}`}
              onClick={() => setFilterCutType('curry')}
            >
              Curry Cut
            </button>
            <button
              className={`filter-btn-pill ${filterCutType === 'boneless' ? 'active' : ''}`}
              onClick={() => setFilterCutType('boneless')}
            >
              Boneless
            </button>
          </div>

          <div className="sort-dropdown-wrap">
            <ArrowUpDown size={15} className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        {/* 5. PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div className="empty-category-view">
            <h3>No products found</h3>
            <p>Try switching categories or clearing active filters.</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setActiveCategory('all');
                setFilterCutType('all');
              }}
            >
              Reset Filters
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
          padding-top: 14px;
          padding-bottom: 36px;
        }

        .category-intro-section {
          margin-bottom: 14px;
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

        .controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 22px;
          padding: 12px 16px;
          background: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }

        .cut-type-filters {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-btn-pill {
          padding: 5px 12px;
          border-radius: var(--radius-pill);
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--bg-main);
          color: var(--text-muted);
          border: 1px solid transparent;
          transition: all var(--transition-fast);
        }

        .filter-btn-pill:hover {
          color: var(--text-dark);
        }

        .filter-btn-pill.active {
          background: var(--surface-light-green);
          color: var(--primary-green);
          font-weight: 700;
          border-color: var(--secondary-green);
        }

        .sort-dropdown-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sort-icon {
          position: absolute;
          left: 10px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .sort-select {
          padding: 6px 12px 6px 32px;
          border-radius: var(--radius-pill);
          border: 1.5px solid var(--border-color);
          background: var(--bg-main);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-dark);
          cursor: pointer;
        }

        .sort-select:focus {
          border-color: var(--primary-green);
          outline: none;
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

        /* Single Promotional Banner */
        .category-promo-banner {
          position: relative;
          border-radius: var(--radius-lg);
          background-size: cover;
          background-position: center right;
          background-repeat: no-repeat;
          padding: 22px 20px;
          margin-bottom: 14px;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          min-height: 140px;
          display: flex;
          align-items: center;
        }

        @media (min-width: 768px) {
          .category-promo-banner {
            padding: 30px 36px;
            min-height: 165px;
          }
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

        @media (max-width: 640px) {
          .controls-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .sort-dropdown-wrap {
            width: 100%;
          }
          .sort-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
