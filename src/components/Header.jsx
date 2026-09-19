import React, { useState } from 'react';
import {
  Search,
  Heart,
  User,
  X
} from 'lucide-react';
import { Logo } from './Logo';
import { useWishlist } from '../context/WishlistContext';

export const Header = ({ currentRoute, navigate }) => {
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const isSearchVisible =
    currentRoute === '/' ||
    currentRoute === '' ||
    currentRoute.startsWith('/categories');

  return (
    <header className="site-header">
      {/* Main Header Bar - Scrolls naturally with page, NOT sticky */}
      <div className="main-header-row">
        <div className="app-container header-inner">
          {/* LEFT: MadurFresh Brand Logo */}
          <div
            className="brand-logo-clickable"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <Logo size="small" showTagline={false} />
          </div>

          {/* DESKTOP-ONLY: Category Navigation */}
          <nav className="desktop-nav-links desktop-only">
            <button
              className={`nav-link-item ${currentRoute === '/categories/chicken' ? 'active' : ''}`}
              onClick={() => navigate('/categories/chicken')}
            >
              Chicken
            </button>
            <button
              className={`nav-link-item ${currentRoute === '/categories/mutton' ? 'active' : ''}`}
              onClick={() => navigate('/categories/mutton')}
            >
              Mutton
            </button>
            <button
              className={`nav-link-item ${currentRoute === '/categories/seafood' ? 'active' : ''}`}
              onClick={() => navigate('/categories/seafood')}
            >
              Seafood
            </button>
            <button
              className={`nav-link-item offers-nav-item ${currentRoute === '/offers' ? 'active' : ''}`}
              onClick={() => navigate('/offers')}
            >
              Offers
            </button>
          </nav>

          {/* DESKTOP-ONLY: Search Bar */}
          <form className="desktop-search-form desktop-only" onSubmit={handleSearchSubmit}>
            <Search size={16} className="desktop-search-icon" />
            <input
              type="text"
              placeholder="Search chicken, mutton, seafood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="desktop-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* RIGHT: Wishlist & Account */}
          <div className="header-right-actions">
            <button
              className={`header-icon-btn ${currentRoute === '/wishlist' ? 'active' : ''}`}
              onClick={() => navigate('/wishlist')}
              aria-label="Wishlist"
              title="Wishlist"
            >
              <div className="icon-with-badge">
                <Heart size={20} strokeWidth={1.8} />
                {wishlistCount > 0 && <span className="header-badge">{wishlistCount}</span>}
              </div>
            </button>

            <button
              className={`header-icon-btn ${currentRoute === '/account' ? 'active' : ''}`}
              onClick={() => navigate('/account')}
              aria-label="Account"
              title="Account"
            >
              <User size={20} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE-ONLY: Clean Search Bar Below Header - On Homepage and Category pages */}
      {isSearchVisible && (
        <div className="mobile-search-section mobile-only">
          <div className="app-container">
            <form className="clean-search-bar" onSubmit={handleSearchSubmit}>
              <Search size={16} className="clean-search-icon" />
              <input
                type="text"
                placeholder="Search chicken, mutton, seafood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="clean-search-input"
                onClick={() => {
                  if (currentRoute !== '/search') navigate('/search');
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clean-search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      <style>{`
        .site-header {
          position: relative; /* Scrolls naturally with the page, NOT sticky/static */
          z-index: 100;
          background-color: var(--surface-white);
          border-bottom: 1px solid var(--border-color);
        }

        .main-header-row {
          height: var(--header-height-mobile);
          display: flex;
          align-items: center;
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .brand-logo-clickable {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        /* Desktop Nav */
        .desktop-nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link-item {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--charcoal);
          position: relative;
          padding: 6px 0;
          transition: color var(--transition-fast);
        }

        .nav-link-item:hover,
        .nav-link-item.active {
          color: var(--deep-forest-green);
        }

        .nav-link-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--deep-forest-green);
          border-radius: var(--radius-pill);
        }

        .offers-nav-item {
          color: var(--deep-forest-green);
        }

        /* Desktop Search */
        .desktop-search-form {
          position: relative;
          display: flex;
          align-items: center;
          width: 320px;
        }

        .desktop-search-icon {
          position: absolute;
          left: 14px;
          color: var(--deep-forest-green);
          pointer-events: none;
        }

        .desktop-search-input {
          width: 100%;
          padding: 8px 36px 8px 38px;
          background: var(--surface-ivory);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-pill);
          font-size: 0.85rem;
          font-weight: 500;
          transition: all var(--transition-normal);
        }

        .desktop-search-input:focus {
          background: #FFFFFF;
          border-color: var(--deep-forest-green);
          outline: none;
          box-shadow: 0 0 0 2px rgba(7, 84, 55, 0.1);
        }

        /* Right Actions: Wishlist ONLY */
        .header-right-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          color: var(--charcoal);
          border-radius: 50%;
          transition: background var(--transition-fast), color var(--transition-fast);
        }

        .header-icon-btn:hover {
          color: var(--deep-forest-green);
          background: var(--surface-soft);
        }

        .icon-with-badge {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background-color: var(--deep-forest-green);
          color: #FFFFFF;
          font-size: 0.62rem;
          font-weight: 800;
          min-width: 16px;
          height: 16px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          border: 1.5px solid #FFFFFF;
        }

        /* Mobile Search Section */
        .mobile-search-section {
          padding-bottom: 10px;
          background: var(--surface-white);
        }

        .clean-search-bar {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .clean-search-icon {
          position: absolute;
          left: 14px;
          color: var(--deep-forest-green);
          pointer-events: none;
        }

        .clean-search-input {
          width: 100%;
          height: 40px;
          padding: 8px 36px 8px 38px;
          background-color: var(--warm-ivory);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--charcoal);
          transition: border-color var(--transition-fast), background var(--transition-fast);
        }

        .clean-search-input:focus {
          background-color: #FFFFFF;
          border-color: var(--deep-forest-green);
          outline: none;
        }

        .clean-search-clear,
        .search-clear-btn {
          position: absolute;
          right: 12px;
          color: var(--text-muted);
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Responsive */
        .mobile-only {
          display: block;
        }
        .desktop-only {
          display: none;
        }

        @media (min-width: 1024px) {
          .mobile-only {
            display: none !important;
          }
          .desktop-only {
            display: flex !important;
          }
          .main-header-row {
            height: 68px;
          }
        }
      `}</style>
    </header>
  );
};
