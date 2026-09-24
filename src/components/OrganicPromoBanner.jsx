import React from 'react';
import { Leaf, Sparkles, ExternalLink, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export const OrganicPromoBanner = () => {
  const handleOpenOrganicStore = () => {
    window.open('https://madhuri.in', '_blank', 'noopener,noreferrer');
  };

  const organicPillars = [
    {
      id: 'veggies',
      title: 'Farm-Fresh Veggies',
      tag: 'Daily Harvest',
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'oils',
      title: 'Cold-Pressed Oils',
      tag: 'Wood-Pressed',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'grains',
      title: 'Millets & Pulses',
      tag: 'Unpolished',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'honey',
      title: 'Raw Forest Honey',
      tag: 'Pure & Raw',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section className="organic-promo-section">
      <div className="organic-promo-card" onClick={handleOpenOrganicStore}>
        {/* Background Glow */}
        <div className="organic-glow-orb" />

        <div className="organic-banner-content">
          {/* Header Row */}
          <div className="organic-header-row">
            <div className="organic-badge-wrap">
              <span className="organic-pill-badge">
                <Leaf size={14} className="leaf-icon-spin" />
                <span>Madhuri Organic & Naturals</span>
              </span>
              <span className="organic-sub-badge">Sister Brand</span>
            </div>

            <div className="organic-visit-chip">
              <span>madhuri.in</span>
              <ExternalLink size={13} />
            </div>
          </div>

          {/* Main Title & Description */}
          <div className="organic-copy-block">
            <h3 className="organic-main-heading">
              100% Pure Organic & Natural Foods
            </h3>
            <p className="organic-subtext">
              Direct from chemical-free organic farms to your kitchen. Discover fresh native vegetables, wood-cold-pressed oils, stone-ground millets, and pure unpasteurized honey.
            </p>
          </div>

          {/* Featured Visual Tiles */}
          <div className="organic-tiles-grid">
            {organicPillars.map((item) => (
              <div key={item.id} className="organic-tile-item">
                <div className="tile-img-wrap">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <span className="tile-tag">{item.tag}</span>
                </div>
                <span className="tile-label">{item.title}</span>
              </div>
            ))}
          </div>

          {/* Bottom CTA Bar */}
          <div className="organic-cta-bar">
            <div className="organic-perks-list">
              <span className="perk-item">
                <ShieldCheck size={14} color="#16A34A" />
                <span>Zero Chemicals & Pesticides</span>
              </span>
              <span className="perk-item">
                <Sparkles size={14} color="#D97706" />
                <span>Direct Farmer Sourced</span>
              </span>
            </div>

            <button
              type="button"
              className="btn-visit-organic"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenOrganicStore();
              }}
            >
              <span>Explore Organic Store</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .organic-promo-section {
          padding: 8px 0 24px;
        }

        .organic-promo-card {
          position: relative;
          background: linear-gradient(135deg, #073B26 0%, #0B4D33 50%, #063120 100%);
          border-radius: var(--radius-xl);
          padding: 26px 24px 22px;
          color: #FFFFFF;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 12px 32px rgba(7, 59, 38, 0.22);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .organic-promo-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(7, 59, 38, 0.32);
        }

        .organic-glow-orb {
          position: absolute;
          top: -40px;
          right: -40px;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0) 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .organic-banner-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .organic-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .organic-badge-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .organic-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(34, 197, 94, 0.18);
          border: 1px solid rgba(74, 222, 128, 0.35);
          color: #86EFAC;
          font-size: 0.76rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: var(--radius-pill);
          letter-spacing: 0.02em;
        }

        .leaf-icon-spin {
          color: #4ADE80;
        }

        .organic-sub-badge {
          background: rgba(255, 255, 255, 0.12);
          color: #F0FDF4;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--radius-pill);
        }

        .organic-visit-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.12);
          color: #E2E8F0;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          transition: background 0.15s ease;
        }

        .organic-promo-card:hover .organic-visit-chip {
          background: rgba(255, 255, 255, 0.22);
          color: #FFFFFF;
        }

        .organic-copy-block {
          max-width: 680px;
        }

        .organic-main-heading {
          font-size: 1.55rem;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 6px;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        .organic-subtext {
          font-size: 0.85rem;
          color: #D1FAE5;
          line-height: 1.5;
          opacity: 0.95;
        }

        /* 4 Organic Visual Tiles */
        .organic-tiles-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .organic-tile-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tile-img-wrap {
          position: relative;
          width: 100%;
          height: 100px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .tile-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .organic-promo-card:hover .tile-img-wrap img {
          transform: scale(1.06);
        }

        .tile-tag {
          position: absolute;
          top: 6px;
          left: 6px;
          background: rgba(7, 59, 38, 0.85);
          backdrop-filter: blur(4px);
          color: #86EFAC;
          font-size: 0.62rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .tile-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #F0FDF4;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Bottom CTA Bar */
        .organic-cta-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .organic-perks-list {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .perk-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #D1FAE5;
        }

        .btn-visit-organic {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #22C55E;
          color: #062819;
          font-size: 0.88rem;
          font-weight: 800;
          padding: 10px 20px;
          border-radius: var(--radius-pill);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.35);
          transition: all 0.2s ease;
        }

        .btn-visit-organic:hover {
          background: #16A34A;
          color: #FFFFFF;
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .organic-promo-card {
            padding: 20px 16px 18px;
          }

          .organic-main-heading {
            font-size: 1.25rem;
          }

          .organic-tiles-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .tile-img-wrap {
            height: 90px;
          }

          .organic-cta-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-visit-organic {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default OrganicPromoBanner;
