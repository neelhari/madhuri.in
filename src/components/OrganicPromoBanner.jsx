import React from 'react';
import { ArrowRight } from 'lucide-react';
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
    'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80';

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
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.25) 45%, rgba(0, 0, 0, 0.1) 100%), url(${image})`
        }}
        aria-label={`Visit ${title} website`}
      >
        <div className="organic-ad-bottom-bar">
          <div className="organic-ad-text-wrap">
            {tagline && <span className="organic-ad-tag">{tagline}</span>}
            <h3 className="organic-ad-title">{title}</h3>
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
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      <style>{`
        .organic-ad-banner-container {
          position: relative;
          margin: 12px 0 16px 0;
        }

        .organic-ad-banner {
          height: 145px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 12px 16px 12px 16px;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }

        @media (min-width: 768px) {
          .organic-ad-banner {
            height: 180px;
            padding: 16px 20px;
          }
        }

        .organic-ad-banner:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
        }

        .organic-ad-bottom-bar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 100%;
          gap: 12px;
          z-index: 2;
        }

        .organic-ad-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .organic-ad-tag {
          font-size: 0.65rem;
          font-weight: 800;
          color: #86EFAC;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .organic-ad-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.2;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        }

        @media (min-width: 768px) {
          .organic-ad-title {
            font-size: 1.4rem;
          }
        }

        .btn-organic-ad {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background-color: #22C55E;
          color: #062819;
          padding: 7px 14px;
          font-size: 0.78rem;
          font-weight: 800;
          border-radius: var(--radius-sm);
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          transition: transform var(--transition-fast), background 0.15s ease;
        }

        .btn-organic-ad:hover {
          background-color: #16A34A;
          color: #FFFFFF;
        }

        .btn-organic-ad:active {
          transform: scale(0.96);
        }
      `}</style>
    </div>
  );
};

export default OrganicPromoBanner;
