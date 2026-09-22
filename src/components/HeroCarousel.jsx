import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';

export const HeroCarousel = ({ navigate }) => {
  const { heroBanners } = useStoreData();
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = heroBanners && heroBanners.length > 0 ? heroBanners : [
    {
      id: 1,
      title: 'Farm Fresh Chicken',
      category: 'chicken',
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const currentBanner = banners[currentIndex % banners.length];

  return (
    <div className="hero-carousel-container">
      <div className="hero-slide-wrap">
        <div
          className="hero-slide"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.25) 28%, transparent 55%), url(${currentBanner.image})`
          }}
        >
          {/* Text and Explore button pushed completely to the bottom edge */}
          <div className="hero-bottom-bar">
            <div className="hero-text-wrap">
              <h2 className="hero-title-text">{currentBanner.title}</h2>
            </div>

            <button
              className="btn-hero-explore"
              onClick={() => navigate(`/categories/${currentBanner.category}`)}
            >
              <span>Explore</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Subtle Carousel Indicators */}
          <div className="carousel-indicators">
            {banners.map((banner, index) => (
              <button
                key={banner.id || index}
                className={`indicator-dot ${index === (currentIndex % banners.length) ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hero-carousel-container {
          position: relative;
          margin-top: 6px;
          margin-bottom: 8px; /* Tighter spacing towards Shop by Category */
        }

        .hero-slide-wrap {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .hero-slide {
          height: 240px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          flex-direction: column;
          justify-content: flex-end; /* Anchors all text to bottom edge */
          padding: 14px 16px 12px 16px;
          position: relative;
          transition: background-image 0.4s ease-in-out;
        }

        @media (min-width: 768px) {
          .hero-slide {
            height: 300px;
            padding: 20px 24px 16px 24px;
          }
        }

        .hero-bottom-bar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 100%;
          gap: 12px;
          z-index: 2;
        }

        .hero-text-wrap {
          display: flex;
          flex-direction: column;
        }

        .hero-title-text {
          font-size: 1.35rem;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.2;
          margin: 0;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
        }

        @media (min-width: 768px) {
          .hero-title-text {
            font-size: 1.8rem;
          }
        }

        .btn-hero-explore {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background-color: var(--brand-yellow);
          color: var(--charcoal);
          padding: 7px 16px;
          font-size: 0.8rem;
          font-weight: 800;
          border-radius: var(--radius-sm);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          flex-shrink: 0;
          transition: transform var(--transition-fast);
        }

        .btn-hero-explore:active {
          transform: scale(0.96);
        }

        /* Subtle Indicators placed right above or beside */
        .carousel-indicators {
          position: absolute;
          top: 12px;
          right: 14px;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 3;
        }

        .indicator-dot {
          width: 5px;
          height: 5px;
          border-radius: var(--radius-pill);
          background: rgba(255, 255, 255, 0.5);
          transition: all var(--transition-fast);
        }

        .indicator-dot.active {
          width: 14px;
          background: #FFFFFF;
        }
      `}</style>
    </div>
  );
};
