import React from 'react';
import { ArrowRight } from 'lucide-react';

export const CategoryCard = ({ category, onClick }) => {
  return (
    <div className="category-card" onClick={onClick}>
      <div className="category-image-wrap">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="category-image"
        />
      </div>

      <div className="category-content">
        <h4 className="category-name">{category.name}</h4>
        <div className="category-arrow-btn">
          <ArrowRight size={14} />
        </div>
      </div>

      <style>{`
        .category-card {
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: transform var(--transition-fast), border-color var(--transition-fast);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .category-card:hover {
          transform: translateY(-2px);
          border-color: var(--deep-forest-green);
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

        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .category-card:hover .category-image {
          transform: scale(1.04);
        }

        .category-content {
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--surface-white);
        }

        .category-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--deep-forest-green);
          letter-spacing: -0.01em;
        }

        .category-arrow-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: var(--deep-forest-green);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform var(--transition-fast);
        }

        .category-card:hover .category-arrow-btn {
          transform: translateX(2px);
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
      `}</style>
    </div>
  );
};
