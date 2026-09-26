import React, { useState } from 'react';
import {
  ArrowRight,
  MessageSquare,
  Star,
  ShieldCheck,
  Award,
  Sparkles,
  Truck,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { HeroCarousel } from '../components/HeroCarousel';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { OrganicPromoBanner } from '../components/OrganicPromoBanner';
import { WhyMadurFreshCarousel } from '../components/WhyMadurFreshCarousel';
import { TESTIMONIALS } from '../data/products';
import { useStoreData } from '../context/StoreDataContext';

export const HomePage = ({ navigate, onOpenWholesale }) => {
  const { categories, products } = useStoreData();
  const CATEGORIES = categories || [];
  const PRODUCTS = products || [];

  return (
    <div className="home-page animate-fade-in">
      <div className="app-container">
        {/* 1. Hero Promotional Banner */}
        <HeroCarousel navigate={navigate} />

        {/* 2. Shop by Category */}
        <section className="section category-section-tight">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle-desktop desktop-only">
                Hand-selected, 100% hygienic fresh cuts prepared fresh upon order
              </p>
            </div>
            <button
              className="section-link"
              onClick={() => navigate('/categories')}
            >
              <span>View All</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="category-grid-container">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onClick={() => navigate(`/categories/${cat.id}`)}
              />
            ))}
          </div>
        </section>

        {/* 3. MADHURI ORGANIC & NATURALS - Sister Website Banner */}
        <OrganicPromoBanner />

        {/* 4. Popular Cuts */}
        <section className="section popular-picks-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Popular Cuts</h2>
              <p className="section-subtitle-desktop desktop-only">
                Customer favorites • Antibiotic-free & delivered cold
              </p>
            </div>
            <button
              className="section-link"
              onClick={() => navigate('/categories')}
            >
              <span>View All ({PRODUCTS.length})</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="products-grid">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                navigate={navigate}
              />
            ))}
          </div>
        </section>

        {/* 5. Why MadurFresh Carousel */}
        <WhyMadurFreshCarousel />

        {/* 6. Wholesale & Bulk Supply Section */}
        <section className="section wholesale-section">
          <div className="wholesale-card">
            <div className="wholesale-inner">
              <div className="wholesale-info-block">
                <span className="wholesale-tag">WHOLESALE & BULK SUPPLY</span>
                <h3 className="wholesale-heading">Buying Fresh Meat in Bulk?</h3>
                <p className="wholesale-sub">
                  Supplying restaurants, cloud kitchens, hotel chains, and caterers with
                  daily farm-fresh, temperature-controlled cuts at wholesale tier pricing.
                </p>

                <div className="wholesale-perks-row desktop-only">
                  <span className="wholesale-perk-item">
                    <CheckCircle2 size={15} className="perk-icon" /> Daily Scheduled Deliveries
                  </span>
                  <span className="wholesale-perk-item">
                    <CheckCircle2 size={15} className="perk-icon" /> Custom Portioned Cuts
                  </span>
                  <span className="wholesale-perk-item">
                    <CheckCircle2 size={15} className="perk-icon" /> Strict Cold-Chain Quality
                  </span>
                </div>
              </div>

              <div className="wholesale-action-block">
                <button
                  className="btn btn-yellow wholesale-btn"
                  onClick={onOpenWholesale}
                >
                  <MessageSquare size={16} />
                  <span>Inquire for Wholesale</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Testimonials */}
        <section className="section testimonials-section">
          <div className="section-header-center">
            <h2 className="section-title">What Customers Say</h2>
            <p className="section-subtitle-desktop desktop-only">
              Real feedback from households who love fresh, chemical-free meat
            </p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#C9A83E" color="#C9A83E" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.comment}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar-initial desktop-only">
                    {t.name ? t.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <strong className="author-name">{t.name}</strong>
                    <span className="author-loc">{t.location} • Verified Buyer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        /* Tightened spacing */
        .category-section-tight {
          padding-top: 10px;
        }

        @media (min-width: 1024px) {
          .category-section-tight {
            padding-top: 20px;
          }
        }

        .section-subtitle-desktop {
          font-size: 0.84rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 3px;
        }

        .category-grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        @media (min-width: 1024px) {
          .category-grid-container {
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .category-grid-container {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 4px;
            gap: 10px;
            scrollbar-width: none;
          }
          .category-grid-container::-webkit-scrollbar {
            display: none;
          }
        }

        /* Product Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (min-width: 1024px) {
          .products-grid {
            gap: 20px;
          }
        }

        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }

        /* Wholesale Section */
        .wholesale-card {
          background: linear-gradient(135deg, #053D27 0%, #075437 100%);
          color: #FFFFFF;
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: 0 4px 20px rgba(7, 84, 55, 0.15);
        }

        @media (min-width: 1024px) {
          .wholesale-card {
            padding: 36px 44px;
            border-radius: var(--radius-xl);
          }
        }

        .wholesale-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .wholesale-info-block {
          max-width: 680px;
        }

        .wholesale-tag {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--brand-yellow);
          text-transform: uppercase;
        }

        .wholesale-heading {
          font-size: 1.35rem;
          font-weight: 800;
          margin-top: 4px;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }

        @media (min-width: 1024px) {
          .wholesale-heading {
            font-size: 1.85rem;
          }
        }

        .wholesale-sub {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.5;
        }

        .wholesale-perks-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 14px;
        }

        .wholesale-perk-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #D1FAE5;
        }

        .perk-icon {
          color: var(--brand-yellow);
        }

        .wholesale-btn {
          padding: 12px 24px;
          font-size: 0.92rem;
          font-weight: 800;
          border-radius: var(--radius-pill);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }

        /* Testimonials */
        .section-header-center {
          text-align: center;
          margin-bottom: 20px;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (min-width: 1024px) {
          .testimonials-grid {
            gap: 24px;
            margin-bottom: 40px;
          }
        }

        @media (max-width: 768px) {
          .testimonials-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 4px;
            gap: 10px;
            scrollbar-width: none;
          }
          .testimonials-grid::-webkit-scrollbar {
            display: none;
          }
          .testimonial-card {
            min-width: 240px;
          }
        }

        .testimonial-card {
          background: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.25s ease;
        }

        @media (min-width: 1024px) {
          .testimonial-card {
            border-radius: var(--radius-lg);
            padding: 22px 24px;
          }
          .testimonial-card:hover {
            transform: translateY(-3px);
            border-color: var(--deep-forest-green);
            box-shadow: 0 8px 24px rgba(7, 84, 55, 0.08);
          }
        }

        .testimonial-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 10px;
        }

        .testimonial-text {
          font-size: 0.86rem;
          color: var(--charcoal);
          line-height: 1.5;
          margin-bottom: 14px;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 10px;
          border-top: 1px solid var(--border-light);
          padding-top: 10px;
        }

        .author-avatar-initial {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--surface-light-green);
          color: var(--deep-forest-green);
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .author-name {
          font-size: 0.86rem;
          font-weight: 800;
          color: var(--deep-forest-green);
          display: block;
        }

        .author-loc {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .desktop-only {
          display: none;
        }

        @media (min-width: 1024px) {
          .desktop-only {
            display: inline-flex;
          }
          p.desktop-only {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

