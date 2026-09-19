import React from 'react';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const BottomNavigation = ({ currentRoute, navigate }) => {
  const { itemCount } = useCart();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, route: '/' },
    { id: 'categories', label: 'Categories', icon: LayoutGrid, route: '/categories' },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, route: '/cart', badge: itemCount },
    { id: 'account', label: 'Account', icon: User, route: '/account' }
  ];

  const isActive = (route) => {
    if (route === '/' && currentRoute === '/') return true;
    if (route !== '/' && currentRoute.startsWith(route)) return true;
    return false;
  };

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const active = isActive(item.route);
        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(item.route)}
            aria-label={item.label}
          >
            <div className="nav-icon-container">
              <IconComponent size={20} strokeWidth={active ? 2.2 : 1.7} />
              {item.badge > 0 && <span className="bottom-nav-badge">{item.badge}</span>}
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}

      <style>{`
        .mobile-bottom-nav {
          display: flex;
          align-items: center;
          justify-content: space-around;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--bottom-nav-height);
          background-color: var(--surface-white);
          border-top: 1px solid var(--border-color);
          box-shadow: var(--shadow-bottom-nav);
          z-index: 99;
          padding-bottom: env(safe-area-inset-bottom, 0);
        }

        @media (min-width: 1024px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          color: #8A928B;
          position: relative;
          transition: color var(--transition-fast);
          padding-top: 4px;
        }

        .bottom-nav-item.active {
          color: var(--deep-forest-green);
        }

        .nav-icon-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bottom-nav-badge {
          position: absolute;
          top: -4px;
          right: -8px;
          background-color: var(--deep-forest-green);
          color: #FFFFFF;
          font-size: 0.62rem;
          font-weight: 800;
          min-width: 15px;
          height: 15px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #FFFFFF;
        }

        .nav-label {
          font-size: 0.68rem;
          font-weight: 600;
          margin-top: 2px;
          letter-spacing: -0.01em;
        }
      `}</style>
    </nav>
  );
};
