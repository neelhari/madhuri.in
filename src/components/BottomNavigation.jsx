import React from 'react';
import { Home, LayoutGrid, ShoppingBag, User, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const BottomNavigation = ({ currentRoute, navigate }) => {
  const { itemCount } = useCart();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, route: '/' },
    { id: 'categories', label: 'Categories', icon: LayoutGrid, route: '/categories' },
    {
      id: 'organics',
      label: 'Organic Foods',
      icon: Leaf,
      isExternal: true,
      url: 'https://madur.in',
      highlightBadge: 'New'
    },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, route: '/cart', badge: itemCount },
    { id: 'account', label: 'Account', icon: User, route: '/account' }
  ];

  const isActive = (route) => {
    if (!route) return false;
    if (route === '/' && currentRoute === '/') return true;
    if (route !== '/' && currentRoute.startsWith(route)) return true;
    return false;
  };

  const handleItemClick = (item) => {
    if (item.isExternal) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(item.route);
    }
  };

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const active = isActive(item.route);
        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            className={`bottom-nav-item ${active ? 'active' : ''} ${item.isExternal ? 'nav-item-organic' : ''}`}
            onClick={() => handleItemClick(item)}
            aria-label={item.label}
          >
            <div className="nav-icon-container">
              <IconComponent
                size={20}
                strokeWidth={active ? 2.2 : 1.7}
                className={item.isExternal ? 'organic-leaf-icon' : ''}
              />
              {item.badge > 0 && <span className="bottom-nav-badge">{item.badge}</span>}
              {item.highlightBadge && (
                <span className="bottom-nav-organic-tag">{item.highlightBadge}</span>
              )}
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
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .bottom-nav-item.active {
          color: var(--deep-forest-green);
        }

        .nav-item-organic {
          color: #15803D;
        }

        .organic-leaf-icon {
          color: #16A34A;
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

        .bottom-nav-organic-tag {
          position: absolute;
          top: -6px;
          right: -12px;
          background: #22C55E;
          color: #FFFFFF;
          font-size: 0.55rem;
          font-weight: 900;
          padding: 1px 4px;
          border-radius: 4px;
          letter-spacing: 0.02em;
          box-shadow: 0 1px 3px rgba(34, 197, 94, 0.4);
        }

        .nav-label {
          font-size: 0.66rem;
          font-weight: 600;
          margin-top: 2px;
          letter-spacing: -0.01em;
        }
      `}</style>
    </nav>
  );
};

export default BottomNavigation;
