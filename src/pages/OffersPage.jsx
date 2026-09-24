import React from 'react';
import { Tag, Sparkles, Copy, Check, ArrowLeft, ArrowRight, Percent } from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { ProductCard } from '../components/ProductCard';
import { useToast } from '../context/ToastContext';

export const OffersPage = ({ navigate }) => {
  const { products, coupons } = useStoreData();
  const { showToast } = useToast();

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon code ${code} copied to clipboard!`, 'success');
  };

  const promotionalCoupons = (coupons && coupons.length > 0)
    ? coupons.filter(c => c.isActive !== false).map(c => ({
        code: c.code,
        title: c.discountType === 'percent' ? `${c.discountValue}% Instant Savings` : `Flat ₹${c.discountValue} OFF`,
        subtitle: c.description || (c.minOrderValue ? `On orders above ₹${c.minOrderValue}` : 'Valid on fresh meat & seafood'),
        tag: c.discountType === 'percent' ? 'Limited Time Deal' : 'Special Offer',
        color: c.discountType === 'percent' ? 'green' : 'yellow'
      }))
    : [
        {
          code: 'MADUR50',
          title: 'Flat ₹50 OFF',
          subtitle: 'On your first order or any cart value above ₹499',
          tag: 'First Order Special',
          color: 'yellow'
        },
        {
          code: 'FRESH10',
          title: '10% Instant Savings',
          subtitle: 'Valid on all chicken, mutton, and seafood orders this weekend',
          tag: 'Weekend Feast',
          color: 'green'
        }
      ];

  return (
    <div className="offers-page animate-fade-in">
      <div className="app-container">
        <div className="offers-hero-card">
          <div className="offers-hero-badge">
            <Percent size={14} />
            <span>MadurFresh Savings Zone</span>
          </div>
          <h1 className="offers-hero-title">Exclusive Deals & Promo Codes</h1>
          <p className="offers-hero-subtitle">
            Enjoy premium quality farm poultry, tender goat meat, and fresh day catches
            with exceptional value.
          </p>
        </div>

        {/* Coupons Showcase */}
        <div className="coupons-grid">
          {promotionalCoupons.map((c) => (
            <div key={c.code} className={`coupon-promo-card card-${c.color}`}>
              <div className="coupon-promo-top">
                <span className="coupon-badge-pill">{c.tag}</span>
                <button
                  className="copy-coupon-btn"
                  onClick={() => handleCopy(c.code)}
                >
                  <Copy size={14} />
                  <span>Copy Code</span>
                </button>
              </div>

              <h3 className="coupon-promo-title">{c.title}</h3>
              <p className="coupon-promo-desc">{c.subtitle}</p>

              <div className="coupon-code-box">
                <span className="code-text">{c.code}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Discounted Cuts Grid */}
        <section className="section discounted-cuts-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Special Discounted Cuts</h2>
              <p className="section-subtitle">Freshly prepped cuts with up to 21% discount</p>
            </div>
          </div>

          <div className="products-grid">
            {(products || []).map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .offers-page {
          padding-top: 18px;
          padding-bottom: 48px;
        }

        .offers-hero-card {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%);
          color: #FFFFFF;
          border-radius: var(--radius-xl);
          padding: 32px;
          margin-top: 12px;
          margin-bottom: 28px;
          text-align: center;
          box-shadow: var(--shadow-md);
        }

        .offers-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 222, 89, 0.2);
          color: var(--primary-yellow);
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .offers-hero-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .offers-hero-subtitle {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.85);
          max-width: 540px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .coupons-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          margin-bottom: 36px;
        }

        @media (max-width: 680px) {
          .coupons-grid {
            grid-template-columns: 1fr;
          }
        }

        .coupon-promo-card {
          background: #FFFFFF;
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-lg);
          padding: 22px;
          position: relative;
        }

        .card-yellow {
          border-color: #F0D040;
          background: #FFFDF2;
        }

        .card-green {
          border-color: var(--secondary-green);
          background: #F5FAF0;
        }

        .coupon-promo-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .coupon-badge-pill {
          font-size: 0.72rem;
          font-weight: 800;
          background: var(--surface-white);
          color: var(--primary-green);
          padding: 3px 8px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-color);
          text-transform: uppercase;
        }

        .copy-coupon-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--primary-green);
          background: #FFFFFF;
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--primary-green);
          transition: all var(--transition-fast);
        }

        .copy-coupon-btn:hover {
          background: var(--primary-green);
          color: #FFFFFF;
        }

        .coupon-promo-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--primary-green);
          margin-bottom: 4px;
        }

        .coupon-promo-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 14px;
        }

        .coupon-code-box {
          display: inline-block;
          background: #FFFFFF;
          border: 1.5px solid var(--primary-green);
          padding: 6px 16px;
          border-radius: var(--radius-md);
        }

        .code-text {
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--primary-green);
          letter-spacing: 0.08em;
        }

        @media (max-width: 600px) {
          .offers-hero-card {
            padding: 24px 16px;
          }
          .offers-hero-title {
            font-size: 1.45rem;
          }
        }
      `}</style>
    </div>
  );
};
