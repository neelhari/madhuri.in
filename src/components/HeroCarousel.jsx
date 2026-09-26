import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Clock } from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';

export const HeroCarousel = ({ navigate }) => {
  const { heroBanners } = useStoreData();
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = heroBanners && heroBanners.length > 0 ? heroBanners : [
    {
      id: 1,
      title: 'Farm Fresh Chicken',
      category: 'chicken',
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=1400&q=85'
    }
  ];

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const currentBanner = banners[currentIndex % banners.length];

  return (
    <div className="hero-carousel-container">
      <div className="hero-slide-wrap">
        <div
          className="hero-slide"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.35) 35%, transparent 70%), url(${currentBanner.image})`
          }}
          onClick={() => navigate(`/categories/${currentBanner.category || 'chicken'}`)}
        >
          {/* Desktop Left/Right Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button
                type="button"
                className="desktop-carousel-arrow arrow-left desktop-only"
                onClick={handlePrev}
                aria-label="Previous Slide"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="desktop-carousel-arrow arrow-right desktop-only"
                onClick={handleNext}
                aria-label="Next Slide"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Text and Explore button pushed completely to the bottom edge */}
          <div className="hero-bottom-bar">
            <div className="hero-text-wrap">
              <div className="hero-badges-row desktop-only">
                <span className="hero-pill-badge">
                  <ShieldCheck size={13} /> 100% Antibiotic & Chemical Free
                </span>
                <span className="hero-pill-badge delivery-pill">
                  <Clock size={13} /> Delivered in 45-60 Mins
                </span>
              </div>
              <h2 className="hero-title-text">{currentBanner.title}</h2>
              <p className="hero-subtitle-desktop desktop-only">
                Freshly cut, cleaned, vacuum-packed and delivered cold to your doorstep.
              </p>
            </div>

            <button
              className="btn-hero-explore"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/categories/${currentBanner.category || 'chicken'}`);
              }}
            >
              <span>Explore Cuts</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {banners.map((banner, index) => (
              <button
                key={banner.id || index}
                className={`indicator-dot ${index === (currentIndex % banners.length) ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
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
          margin-bottom: 12px;
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
          justify-content: flex-end;
          padding: 14px 16px 12px 16px;
          position: relative;
          transition: background-image 0.4s ease-in-out;
          cursor: pointer;
        }

        @media (min-width: 1024px) {
          .hero-carousel-container {
            margin-top: 14px;
            margin-bottom: 24px;
          }
          .hero-slide {
            height: 380px;
            padding: 32px 36px 28px 36px;
            border-radius: var(--radius-xl);
          }
        }

        /* Desktop Carousel Arrows */
        .desktop-carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          color: var(--deep-forest-green);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all var(--transition-fast);
          z-index: 5;
          opacity: 0.85;
        }

        .desktop-carousel-arrow:hover {
          background: #FFFFFF;
          transform: translateY(-50%) scale(1.08);
          opacity: 1;
        }

        .desktop-carousel-arrow.arrow-left {
          left: 18px;
        }

        .desktop-carousel-arrow.arrow-right {
          right: 18px;
        }

        .hero-bottom-bar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 100%;
          gap: 16px;
          z-index: 2;
        }

        .hero-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .hero-badges-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .hero-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(7, 84, 55, 0.85);
          backdrop-filter: blur(6px);
          color: #A7F3D0;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-pill);
          border: 1px solid rgba(167, 243, 208, 0.3);
        }

        .delivery-pill {
          background: rgba(0, 0, 0, 0.6);
          color: var(--brand-yellow);
          border-color: rgba(255, 218, 85, 0.3);
        }

        .hero-title-text {
          font-size: 1.35rem;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.2;
          margin: 0;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
        }

        @media (min-width: 1024px) {
          .hero-title-text {
            font-size: 2.3rem;
            letter-spacing: -0.02em;
          }
        }

        .hero-subtitle-desktop {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
          margin-top: 2px;
        }

        .btn-hero-explore {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: var(--brand-yellow);
          color: var(--charcoal);
          padding: 8px 18px;
          font-size: 0.82rem;
          font-weight: 800;
          border-radius: var(--radius-sm);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
          flex-shrink: 0;
          transition: all var(--transition-fast);
        }

        .btn-hero-explore:hover {
          background-color: #F8D038;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
        }

        @media (min-width: 1024px) {
          .btn-hero-explore {
            padding: 12px 24px;
            font-size: 0.95rem;
            border-radius: var(--radius-md);
          }
        }

        /* Carousel Indicators */
        .carousel-indicators {
          position: absolute;
          top: 12px;
          right: 14px;
          display: flex;
          align-items: center;
          gap: 5px;
          z-index: 3;
        }

        @media (min-width: 1024px) {
          .carousel-indicators {
            top: auto;
            bottom: 24px;
            right: 36px;
          }
        }

        .indicator-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-pill);
          background: rgba(255, 255, 255, 0.5);
          transition: all var(--transition-fast);
          border: none;
          cursor: pointer;
        }

        .indicator-dot.active {
          width: 18px;
          background: #FFFFFF;
        }

        /* Responsive Utilities */
        .desktop-only {
          display: none;
        }

        @media (min-width: 1024px) {
          .desktop-only {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};

