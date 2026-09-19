import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FloatingCartBar = ({ currentRoute, navigate }) => {
  const { itemCount, subtotal, productSavings } = useCart();

  // Hide on cart or checkout pages, or when cart is empty
  if (itemCount === 0 || currentRoute === '/cart' || currentRoute === '/checkout' || currentRoute === '/order-confirmation') {
    return null;
  }

  return (
    <div className="floating-cart-wrapper">
      <div className="floating-cart-container">
        <div className="cart-bar-left">
          <div className="cart-bar-icon-wrap">
            <ShoppingBag size={20} />
            <span className="cart-bar-count">{itemCount}</span>
          </div>
          <div className="cart-bar-pricing">
            <div className="cart-bar-subtotal">₹{subtotal}</div>
            {productSavings > 0 && (
              <div className="cart-bar-savings">Saved ₹{productSavings}</div>
            )}
          </div>
        </div>

        <button
          className="cart-bar-action-btn"
          onClick={() => navigate('/cart')}
          aria-label="View Cart"
        >
          <span>View Cart</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <style>{`
        .floating-cart-wrapper {
          position: fixed;
          bottom: calc(var(--bottom-nav-height) + 12px);
          left: 14px;
          right: 14px;
          z-index: 98;
          max-width: 440px;
          margin: 0 auto;
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (min-width: 1024px) {
          .floating-cart-wrapper {
            bottom: 24px;
            right: 24px;
            left: auto;
            width: 340px;
          }
        }

        .floating-cart-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--deep-forest-green);
          color: #FFFFFF;
          padding: 10px 14px;
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 18px rgba(7, 84, 55, 0.28);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .cart-bar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cart-bar-icon-wrap {
          position: relative;
          background: rgba(255, 255, 255, 0.15);
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-bar-count {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: var(--brand-yellow);
          color: var(--charcoal);
          font-size: 0.62rem;
          font-weight: 800;
          min-width: 15px;
          height: 15px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-bar-pricing {
          display: flex;
          flex-direction: column;
        }

        .cart-bar-subtotal {
          font-size: 1rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .cart-bar-savings {
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
        }

        .cart-bar-action-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background-color: #FFFFFF;
          color: var(--deep-forest-green);
          padding: 7px 14px;
          border-radius: var(--radius-pill);
          font-size: 0.82rem;
          font-weight: 800;
          transition: transform var(--transition-fast);
        }

        .cart-bar-action-btn:hover {
          background-color: var(--warm-ivory);
        }

        .cart-bar-action-btn:active {
          transform: scale(0.96);
        }
      `}</style>
    </div>
  );
};
