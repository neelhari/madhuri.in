import React, { useState } from 'react';
import {
  Search,
  Heart,
  User,
  X,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  PhoneCall,
  Home,
  LayoutGrid,
  Leaf,
  ExternalLink
} from 'lucide-react';
import { Logo } from './Logo';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const Header = ({ currentRoute, navigate, onOpenWholesale }) => {
  const { wishlistCount } = useWishlist();
  const { itemCount, subtotal } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const isHomePage = currentRoute === '/' || currentRoute === '';

  const handleOrganicClick = () => {
    window.open('https://madur.in', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* =========================================================
          1. MOBILE MINIMAL HEADER: Shown ONLY on Mobile (< 1024px) for Non-Home Pages
         ========================================================= */}
      {!isHomePage && (
        <header className="mobile-minimal-header mobile-only">
          <div className="app-container minimal-header-inner">
            <button
              className="header-back-btn"
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  navigate('/');
                }
              }}
              aria-label="Go back"
            >
              <ArrowLeft size={22} strokeWidth={2.2} />
            </button>
            <div className="minimal-header-title">
              {currentRoute.startsWith('/categories') ? 'Categories' :
               currentRoute.startsWith('/product') ? 'Product Details' :
               currentRoute === '/cart' ? 'Shopping Cart' :
               currentRoute === '/checkout' ? 'Checkout' :
               currentRoute === '/wishlist' ? 'My Wishlist' :
               currentRoute === '/orders' ? 'My Orders' :
               currentRoute === '/account' ? 'My Account' :
               currentRoute === '/offers' ? 'Special Offers' :
               currentRoute === '/search' ? 'Search Products' : 'MadurFresh'}
            </div>
          </div>
        </header>
      )}

      {/* =========================================================
          2. MAIN UNIVERSAL HEADER:
             - On Mobile: Shown ONLY on Homepage
             - On Desktop: Shown on ALL PAGES
         ========================================================= */}
      <header className={`site-header ${!isHomePage ? 'desktop-only-on-inner' : ''}`}>
        {/* MAIN NAV ROW */}
        <div className="main-header-row">
          <div className="app-container header-inner">
            {/* LEFT: Brand Logo */}
            <div className="header-left-group">
              <div
                className="brand-logo-clickable"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              >
                <Logo size="small" showTagline={false} />
              </div>
            </div>

            {/* DESKTOP-ONLY: Main Navigation Tabs (Home, Categories, Organic Foods, Offers) */}
            <nav className="desktop-nav-links desktop-only" aria-label="Main Navigation">
              <button
                className={`nav-link-item ${isHomePage ? 'active' : ''}`}
                onClick={() => navigate('/')}
              >
                <Home size={15} />
                <span>Home</span>
              </button>

              <button
                className={`nav-link-item ${currentRoute.startsWith('/categories') ? 'active' : ''}`}
                onClick={() => navigate('/categories')}
              >
                <LayoutGrid size={15} />
                <span>Categories</span>
              </button>

              {/* Organic Foods Link */}
              <button
                type="button"
                className="nav-link-item organic-link-item"
                onClick={handleOrganicClick}
                title="100% certified organic foods and groceries at madur.in"
              >
                <Leaf size={15} className="organic-leaf-icon" />
                <span>Organic Foods</span>
              </button>

              <button
                className={`nav-link-item offers-nav-item ${currentRoute === '/offers' ? 'active' : ''}`}
                onClick={() => navigate('/offers')}
              >
                <span>Offers</span>
                <span className="offers-badge">Hot</span>
              </button>
            </nav>

            {/* DESKTOP-ONLY: Search Bar */}
            <form className="desktop-search-form desktop-only" onSubmit={handleSearchSubmit}>
              <Search size={16} className="desktop-search-icon" />
              <input
                type="text"
                placeholder="Search fresh chicken, mutton, prawns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="desktop-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </form>

            {/* RIGHT: User Actions & Desktop Cart Button */}
            <div className="header-right-actions">
              {/* Wishlist */}
              <button
                className={`header-icon-btn ${currentRoute === '/wishlist' ? 'active' : ''}`}
                onClick={() => navigate('/wishlist')}
                aria-label="Wishlist"
                title="Wishlist"
              >
                <div className="icon-with-badge">
                  <Heart size={19} strokeWidth={1.8} />
                  {wishlistCount > 0 && <span className="header-badge">{wishlistCount}</span>}
                </div>
                <span className="action-text-label desktop-only">Wishlist</span>
              </button>

              {/* Account */}
              <button
                className={`header-icon-btn ${currentRoute === '/account' ? 'active' : ''}`}
                onClick={() => navigate('/account')}
                aria-label="Account"
                title="Account"
              >
                <User size={19} strokeWidth={1.8} />
                <span className="action-text-label desktop-only">Account</span>
              </button>

              {/* DESKTOP-ONLY: Header Cart Button */}
              <button
                type="button"
                className="desktop-header-cart-btn desktop-only"
                onClick={() => navigate('/cart')}
                aria-label="Shopping Cart"
              >
                <div className="cart-btn-icon-wrap">
                  <ShoppingBag size={17} />
                  {itemCount > 0 && <span className="cart-btn-badge">{itemCount}</span>}
                </div>
                <div className="cart-btn-text">
                  <span className="cart-btn-label">Cart</span>
                  <span className="cart-btn-amount">{subtotal > 0 ? `₹${subtotal}` : 'Empty'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE-ONLY: Clean Search Bar Below Header - On Homepage */}
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
      </header>

      <style>{`
        /* -------------------------------------------------------------
           1. MOBILE MINIMAL HEADER (Preserved for Mobile)
           ------------------------------------------------------------- */
        .mobile-minimal-header {
          position: relative;
          background-color: var(--surface-white);
          border-bottom: 1px solid var(--border-color);
          height: 48px;
          display: flex;
          align-items: center;
          z-index: 100;
        }

        .minimal-header-inner {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .minimal-header-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--charcoal);
        }

        .header-back-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          color: var(--charcoal);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background var(--transition-fast), color var(--transition-fast);
          padding: 0;
          margin-left: -6px;
        }

        .header-back-btn:hover {
          background: var(--surface-soft);
          color: var(--deep-forest-green);
        }

        /* -------------------------------------------------------------
           2. MAIN HEADER BASE
           ------------------------------------------------------------- */
        .site-header {
          position: relative;
          z-index: 100;
          background-color: var(--surface-white);
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow-xs);
        }

        /* -------------------------------------------------------------
           3. MAIN NAVBAR ROW
           ------------------------------------------------------------- */
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
          gap: 20px;
        }

        .header-left-group {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .brand-logo-clickable {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        /* Desktop Nav Links */
        .desktop-nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-shrink: 0;
        }

        .nav-link-item {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--charcoal);
          position: relative;
          padding: 6px 2px;
          transition: color var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .nav-link-item:hover,
        .nav-link-item.active {
          color: var(--deep-forest-green);
        }

        .nav-link-item.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2.5px;
          background: var(--deep-forest-green);
          border-radius: var(--radius-pill);
        }

        /* Organic Link Item with Green Styling */
        .organic-link-item {
          color: #166534;
        }

        .organic-link-item:hover {
          color: #15803D;
        }

        .organic-leaf-icon {
          color: #22C55E;
        }

        .offers-nav-item {
          color: #B45309;
        }

        .offers-badge {
          background: #DC2626;
          color: #FFFFFF;
          font-size: 0.6rem;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
        }

        /* Desktop Search Form */
        .desktop-search-form {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 320px;
          min-width: 180px;
        }

        .desktop-search-icon {
          position: absolute;
          left: 14px;
          color: var(--deep-forest-green);
          pointer-events: none;
        }

        .desktop-search-input {
          width: 100%;
          padding: 9px 36px 9px 38px;
          background: var(--surface-ivory);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-pill);
          font-size: 0.86rem;
          font-weight: 500;
          transition: all var(--transition-normal);
        }

        .desktop-search-input:focus {
          background: #FFFFFF;
          border-color: var(--deep-forest-green);
          outline: none;
          box-shadow: 0 0 0 3px rgba(7, 84, 55, 0.12);
        }

        /* Right Actions */
        .header-right-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }

        .header-icon-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          color: var(--charcoal);
          border-radius: var(--radius-sm);
          transition: background var(--transition-fast), color var(--transition-fast);
        }

        .header-icon-btn:hover {
          color: var(--deep-forest-green);
          background: var(--surface-soft);
        }

        .action-text-label {
          font-size: 0.85rem;
          font-weight: 700;
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

        /* Desktop Header Cart Button */
        .desktop-header-cart-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--deep-forest-green);
          color: #FFFFFF;
          padding: 7px 16px;
          border-radius: var(--radius-pill);
          cursor: pointer;
          transition: all var(--transition-fast);
          border: 1.5px solid var(--deep-forest-green);
          box-shadow: 0 2px 8px rgba(7, 84, 55, 0.2);
        }

        .desktop-header-cart-btn:hover {
          background: var(--dark-green);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(7, 84, 55, 0.3);
        }

        .cart-btn-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-btn-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background-color: var(--brand-yellow);
          color: var(--charcoal);
          font-size: 0.62rem;
          font-weight: 800;
          min-width: 16px;
          height: 16px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
        }

        .cart-btn-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
          text-align: left;
        }

        .cart-btn-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.85);
          text-transform: uppercase;
        }

        .cart-btn-amount {
          font-size: 0.86rem;
          font-weight: 800;
          color: #FFFFFF;
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

        /* Responsive Utilities */
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
          .desktop-only-on-inner {
            display: block !important;
          }
          .main-header-row {
            height: 72px;
          }
          .site-header {
            position: sticky;
            top: 0;
            backdrop-filter: blur(8px);
            background-color: rgba(255, 255, 255, 0.96);
          }
        }
      `}</style>
    </>
  );
};

export default Header;
