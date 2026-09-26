import React from 'react';
import { ArrowUpRight, Leaf } from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';

export const OrganicPromoBanner = () => {
  const { organicAdBanner } = useStoreData();

  if (organicAdBanner && organicAdBanner.isActive === false) {
    return null;
  }

  const title = organicAdBanner?.title || 'Natural & Organic';
  const tagline = organicAdBanner?.tagline || 'Sister Store';
  const buttonText = organicAdBanner?.buttonText || 'Visit madur.in';
  const redirectUrl = organicAdBanner?.redirectUrl || 'https://madur.in';
  const image =
    organicAdBanner?.image ||
    'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1400&q=85';

  const handleOpenOrganicStore = () => {
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="organic-ad-banner-container">
      <div
        className="organic-ad-banner"
        onClick={handleOpenOrganicStore}
        role="button"
        tabIndex={0}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.45) 45%, rgba(0, 0, 0, 0.1) 85%, transparent 100%), url(${image})`
        }}
        aria-label={`Visit ${title} website`}
      >
        <div className="organic-ad-content-wrapper">
          <div className="organic-ad-text-wrap">
            <div className="organic-tag-row">
              <span className="organic-ad-tag">
                <Leaf size={12} /> 100% Certified Organic
              </span>
              <span className="organic-ad-subtag desktop-only">Farm-to-Table</span>
            </div>
            <h3 className="organic-ad-title">{title}</h3>
            <p className="organic-ad-desc desktop-only">
              Pure cold-pressed oils, native grains, wild honey, natural jaggery & chemical-free grocery.
            </p>
          </div>

          <button
            type="button"
            className="btn-organic-ad"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenOrganicStore();
            }}
          >
            <span>{buttonText}</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .organic-ad-banner-container {
          position: relative;
          margin: 12px 0 18px 0;
        }

        @media (min-width: 1024px) {
          .organic-ad-banner-container {
            margin: 24px 0 32px 0;
          }
        }

        .organic-ad-banner {
          height: 145px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          padding: 16px 20px;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.25s ease;
        }

        @media (min-width: 1024px) {
          .organic-ad-banner {
            height: 190px;
            padding: 24px 36px;
            border-radius: var(--radius-xl);
          }
        }

        .organic-ad-banner:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(6, 40, 25, 0.25);
        }

        .organic-ad-content-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 16px;
          z-index: 2;
        }

        .organic-ad-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .organic-tag-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .organic-ad-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: #86EFAC;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .organic-ad-subtag {
          font-size: 0.72rem;
          color: #D1FAE5;
          font-weight: 600;
          background: rgba(34, 197, 94, 0.2);
          padding: 2px 8px;
          border-radius: var(--radius-pill);
        }

        .organic-ad-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.2;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        }

        @media (min-width: 1024px) {
          .organic-ad-title {
            font-size: 1.7rem;
            letter-spacing: -0.01em;
          }
        }

        .organic-ad-desc {
          font-size: 0.85rem;
          color: #E2E8F0;
          max-width: 520px;
          line-height: 1.4;
          margin-top: 2px;
        }

        .btn-organic-ad {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #22C55E;
          color: #062819;
          padding: 8px 18px;
          font-size: 0.84rem;
          font-weight: 800;
          border-radius: var(--radius-pill);
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.35);
          transition: all var(--transition-fast);
        }

        .btn-organic-ad:hover {
          background-color: #4ADE80;
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 6px 18px rgba(34, 197, 94, 0.5);
        }

        @media (min-width: 1024px) {
          .btn-organic-ad {
            padding: 12px 24px;
            font-size: 0.95rem;
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

export default OrganicPromoBanner;

