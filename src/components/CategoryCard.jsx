import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoryCard = ({ category, onClick }) => {
  const getCategorySubtitle = (id) => {
    switch (id) {
      case 'chicken': return 'Curry cuts, breast & wings';
      case 'mutton': return 'Tender goat & lamb cuts';
      case 'seafood': return 'Freshwater fish & prawns';
      default: return 'Farm fresh daily selection';
    }
  };

  return (
    <div className="category-card" onClick={onClick}>
      <div className="category-image-wrap">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="category-image"
        />
        <div className="category-badge-desktop desktop-only">
          <Sparkles size={11} /> 100% Fresh
        </div>
      </div>

      <div className="category-content">
        <div className="category-text-meta">
          <h4 className="category-name">{category.name}</h4>
          <p className="category-sub-desktop desktop-only">{getCategorySubtitle(category.id)}</p>
        </div>

        <div className="category-action-wrap">
          <span className="category-explore-label desktop-only">Shop Now</span>
          <div className="category-arrow-btn">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      <style>{`
        .category-card {
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .category-card:hover {
          transform: translateY(-3px);
          border-color: var(--deep-forest-green);
          box-shadow: 0 8px 24px rgba(7, 84, 55, 0.12);
        }

        .category-image-wrap {
          position: relative;
          width: 100%;
          height: 140px;
          overflow: hidden;
          background-color: var(--surface-soft);
        }

        @media (min-width: 768px) {
          .category-image-wrap {
            height: 180px;
          }
        }

        @media (min-width: 1024px) {
          .category-image-wrap {
            height: 200px;
          }
        }

        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .category-card:hover .category-image {
          transform: scale(1.06);
        }

        .category-badge-desktop {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(4px);
          color: var(--deep-forest-green);
          font-size: 0.68rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: var(--radius-pill);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .category-content {
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--surface-white);
          flex: 1;
        }

        @media (min-width: 1024px) {
          .category-content {
            padding: 14px 18px;
          }
        }

        .category-text-meta {
          display: flex;
          flex-direction: column;
        }

        .category-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--deep-forest-green);
          letter-spacing: -0.01em;
        }

        @media (min-width: 1024px) {
          .category-name {
            font-size: 1.15rem;
          }
        }

        .category-sub-desktop {
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-top: 2px;
          font-weight: 500;
        }

        .category-action-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .category-explore-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--deep-forest-green);
        }

        .category-arrow-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: var(--deep-forest-green);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform var(--transition-fast), background-color var(--transition-fast);
        }

        .category-card:hover .category-arrow-btn {
          transform: translateX(3px);
          background-color: var(--dark-green);
        }

        @media (max-width: 768px) {
          .category-card {
            width: 155px;
          }
          .category-image-wrap {
            height: 125px;
          }
          .category-content {
            padding: 10px 12px;
          }
          .category-name {
            font-size: 0.85rem;
          }
          .category-arrow-btn {
            width: 22px;
            height: 22px;
          }
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

