import React, { useState } from 'react';
import {
  ArrowRight,
  MessageSquare,
  Star,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { HeroCarousel } from '../components/HeroCarousel';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { WhyMadurFreshCarousel } from '../components/WhyMadurFreshCarousel';
import { TESTIMONIALS } from '../data/products';
import { useStoreData } from '../context/StoreDataContext';

export const HomePage = ({ navigate, onOpenWholesale }) => {
  const { categories, products } = useStoreData();
  const CATEGORIES = categories || [];
  const PRODUCTS = products || [];

  // State for the card highlight & blur effect
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);

  const highlightCards = PRODUCTS.map((p, idx) => {
    const minPrice =
      p.weights && p.weights.length > 0
        ? Math.min(...p.weights.map((w) => w.price || 0))
        : 175;
    const defaultTag =
      idx === 0
        ? 'Chef Choice'
        : idx === 1
        ? 'Bestseller'
        : idx === 2
        ? 'Day Catch'
        : 'Special Cut';

    return {
      id: p.id,
      slug: p.slug,
      title: p.name,
      subtitle: p.shortDescription || '100% Antibiotic-free & fresh',
      price: `₹${minPrice}`,
      tag: p.tag || defaultTag,
      image:
        (p.images && p.images[0]) ||
        'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
      category: p.category
    };
  });

  const getIcon = (name) => {
    switch (name) {
      case 'ShieldCheck': return <ShieldCheck size={20} />;
      case 'Award': return <Award size={20} />;
      case 'Sparkles': return <Sparkles size={20} />;
      case 'Truck': return <Truck size={20} />;
      default: return <ShieldCheck size={20} />;
    }
  };

  return (
    <div className="home-page animate-fade-in">
      <div className="app-container">
        {/* 1. Hero Promotional Banner (Image-first, ~240px, text at bottom edge) */}
        <HeroCarousel navigate={navigate} />

        {/* 2. Shop by Category (Pushed closer to banner with decent spacing) */}
        <section className="section category-section-tight">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <button
              className="section-link"
              onClick={() => navigate('/categories')}
            >
              <span>View All</span>
              <ArrowRight size={14} />
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

        {/* 3. LIGHT YELLOW SECTION - Dynamically powered by real live products */}
        {highlightCards.length > 0 && (
          <section className="highlight-blur-section">
            <div className="highlight-section-content">
              <div className="highlight-header">
                <div>
                  <span className="highlight-badge">FEATURED ARTISANAL SELECTION</span>
                  <h3 className="highlight-title">Crafted for Exceptional Taste</h3>
                </div>
                <div className="carousel-arrows-mini">
                  <button
                    className="arrow-mini"
                    onClick={() =>
                      setActiveHighlightIndex((prev) =>
                        prev === 0 ? highlightCards.length - 1 : prev - 1
                      )
                    }
                    aria-label="Previous"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    className="arrow-mini"
                    onClick={() =>
                      setActiveHighlightIndex(
                        (prev) => (prev + 1) % highlightCards.length
                      )
                    }
                    aria-label="Next"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Cards Track: Dynamically loaded from real products */}
              <div className="highlight-cards-track">
                {highlightCards.map((card, idx) => {
                  const isFocused = idx === activeHighlightIndex;
                  return (
                    <div
                      key={card.id}
                      className={`focus-card ${isFocused ? 'card-focused' : ''}`}
                      onClick={() => {
                        setActiveHighlightIndex(idx);
                        navigate(`/product/${card.slug || card.id}`);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="focus-card-media">
                        <img src={card.image} alt={card.title} />
                        <span className="focus-card-tag">{card.tag}</span>
                      </div>
                      <div className="focus-card-body">
                        <h4 className="focus-card-title">{card.title}</h4>
                        <p className="focus-card-sub">{card.subtitle}</p>
                        <div className="focus-card-footer">
                          <span className="focus-card-price">From {card.price}</span>
                          <button
                            className="focus-card-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${card.slug || card.id}`);
                            }}
                          >
                            <span>Explore</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 4. Popular Cuts (2-col on mobile, 4-col on desktop) */}
        <section className="section popular-picks-section">
          <div className="section-header">
            <h2 className="section-title">Popular Cuts</h2>
            <button
              className="section-link"
              onClick={() => navigate('/categories')}
            >
              <span>View All ({PRODUCTS.length})</span>
              <ArrowRight size={14} />
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

        {/* 5. Why MadurFresh (Automatic Horizontal Center-Highlighted Carousel) */}
        <WhyMadurFreshCarousel />

        {/* 6. Wholesale & Bulk Supply Section */}
        <section className="section wholesale-section">
          <div className="wholesale-card">
            <div className="wholesale-inner">
              <div>
                <span className="wholesale-tag">WHOLESALE & BULK</span>
                <h3 className="wholesale-heading">Buying in Bulk?</h3>
                <p className="wholesale-sub">
                  Supplying restaurants, cloud kitchens, and caterers with fresh,
                  temperature-controlled cuts and wholesale pricing.
                </p>
              </div>
              <button
                className="btn btn-yellow wholesale-btn"
                onClick={onOpenWholesale}
              >
                <MessageSquare size={14} />
                <span>Contact for Wholesale</span>
              </button>
            </div>
          </div>
        </section>

        {/* 7. Testimonials */}
        <section className="section testimonials-section">
          <div className="section-header-center">
            <h2 className="section-title">What Customers Say</h2>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={12} fill="#C9A83E" color="#C9A83E" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.comment}"</p>
                <div className="testimonial-author">
                  <strong className="author-name">{t.name}</strong>
                  <span className="author-loc">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        /* Tightened spacing between Hero Banner and Shop by Category */
        .category-section-tight {
          padding-top: 10px; /* Decent, tight gap */
        }

        .category-grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
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

        /* LIGHT YELLOW SECTION (Clean, no floating artwork) */
        .highlight-blur-section {
          position: relative;
          background-color: #FFF9D2; /* Light yellow background */
          border-radius: var(--radius-lg);
          padding: 24px 18px;
          margin-top: 24px;
          margin-bottom: 24px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(201, 168, 62, 0.08);
          border: 1px solid #F5EEBA;
        }

        .highlight-section-content {
          position: relative;
          z-index: 2;
        }

        .highlight-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .highlight-badge {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--deep-forest-green);
          text-transform: uppercase;
          display: block;
          margin-bottom: 2px;
        }

        .highlight-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--charcoal);
          line-height: 1.2;
        }

        .carousel-arrows-mini {
          display: flex;
          gap: 6px;
        }

        .arrow-mini {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: var(--deep-forest-green);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition-fast);
        }

        .arrow-mini:hover {
          background: var(--warm-ivory);
        }

        /* Track of Cards with Highlight & Blur Effect */
        .highlight-cards-track {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding: 8px 4px 12px 4px;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }

        .highlight-cards-track::-webkit-scrollbar {
          display: none;
        }

        .focus-card {
          flex: 0 0 240px;
          scroll-snap-align: center;
          background: #FFFFFF;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        /* All cards active, sharp, and visible */
        .focus-card.card-focused {
          border-color: var(--deep-forest-green);
          box-shadow: 0 6px 20px rgba(7, 84, 55, 0.14);
          transform: translateY(-2px);
        }

        .focus-card:hover {
          border-color: var(--deep-forest-green);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .focus-card-media {
          position: relative;
          width: 100%;
          height: 130px;
          overflow: hidden;
          background: var(--surface-soft);
        }

        .focus-card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .focus-card-tag {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(4px);
          color: var(--deep-forest-green);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
        }

        .focus-card-body {
          padding: 12px;
        }

        .focus-card-title {
          font-size: 0.92rem;
          font-weight: 800;
          color: var(--charcoal);
          margin-bottom: 2px;
        }

        .focus-card-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .focus-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-light);
          padding-top: 8px;
        }

        .focus-card-price {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--deep-forest-green);
        }

        .focus-card-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--deep-forest-green);
          color: #FFFFFF;
          padding: 4px 10px;
          font-size: 0.72rem;
          font-weight: 700;
          border-radius: var(--radius-pill);
          transition: background var(--transition-fast);
        }

        .focus-card-btn:hover {
          background: var(--dark-green);
        }

        /* Product Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
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
          background: var(--deep-forest-green);
          color: #FFFFFF;
          border-radius: var(--radius-md);
          padding: 22px;
        }

        .wholesale-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .wholesale-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--brand-yellow);
          text-transform: uppercase;
        }

        .wholesale-heading {
          font-size: 1.25rem;
          font-weight: 800;
          margin-top: 3px;
          margin-bottom: 3px;
        }

        .wholesale-sub {
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.85);
          max-width: 440px;
          line-height: 1.4;
        }

        .wholesale-btn {
          padding: 8px 16px;
          font-size: 0.82rem;
          font-weight: 800;
        }

        /* Testimonials */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .testimonials-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 4px;
            gap: 8px;
            scrollbar-width: none;
          }
          .testimonials-grid::-webkit-scrollbar {
            display: none;
          }
          .testimonial-card {
            min-width: 220px;
          }
        }

        .testimonial-card {
          background: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .testimonial-stars {
          display: flex;
          gap: 2px;
          margin-bottom: 6px;
        }

        .testimonial-text {
          font-size: 0.78rem;
          color: var(--charcoal);
          line-height: 1.4;
          margin-bottom: 10px;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--border-light);
          padding-top: 6px;
        }

        .author-name {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--deep-forest-green);
        }

        .author-loc {
          font-size: 0.68rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
