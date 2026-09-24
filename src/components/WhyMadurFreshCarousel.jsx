import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, Award, Sparkles, Truck } from 'lucide-react';
import { TRUST_BENEFITS } from '../data/products';

export const WhyMadurFreshCarousel = () => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(390);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalItems = TRUST_BENEFITS.length;

  // Measure container width reliably
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth || 390);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Responsive card dimensions
  const isMobile = containerWidth < 640;
  const cardWidth = isMobile ? Math.min(containerWidth * 0.76, 290) : 320;
  const gap = isMobile ? 12 : 18;

  // Safe cyclic next and prev handlers
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  // Robust auto-rotation that never desynchronizes
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch Swipe Handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTimeout(() => setIsPaused(false), 3000);
  };

  const handleDotClick = (index) => {
    setIsPaused(true);
    setActiveIndex(index);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const getIcon = (name) => {
    switch (name) {
      case 'ShieldCheck': return <ShieldCheck size={26} strokeWidth={2} />;
      case 'Award': return <Award size={26} strokeWidth={2} />;
      case 'Sparkles': return <Sparkles size={26} strokeWidth={2} />;
      case 'Truck': return <Truck size={26} strokeWidth={2} />;
      default: return <ShieldCheck size={26} strokeWidth={2} />;
    }
  };

  // Center alignment offset calculation (always within valid bounds)
  const trackOffset = (containerWidth / 2) - (activeIndex * (cardWidth + gap)) - (cardWidth / 2);

  return (
    <section className="section why-carousel-section">
      <div className="section-header-center">
        <h2 className="section-title">Why MadurFresh?</h2>
      </div>

      <div
        className="why-carousel-container"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Horizontal sliding track */}
        <div
          className="why-carousel-track"
          style={{
            transform: `translateX(${trackOffset}px)`,
            transition: 'transform 500ms cubic-bezier(0.25, 1, 0.35, 1)'
          }}
        >
          {TRUST_BENEFITS.map((item, idx) => {
            const isCenter = idx === activeIndex;
            const isNeighbor = Math.abs(idx - activeIndex) === 1 || 
              (activeIndex === 0 && idx === totalItems - 1) || 
              (activeIndex === totalItems - 1 && idx === 0);

            return (
              <div
                key={item.id}
                className={`why-card ${isCenter ? 'card-center' : isNeighbor ? 'card-side' : 'card-subtle'}`}
                style={{
                  width: `${cardWidth}px`,
                  marginRight: `${gap}px`
                }}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(idx);
                  }
                }}
              >
                <div className="why-icon-bubble">
                  {getIcon(item.icon)}
                </div>
                <h3 className="why-card-title">{item.title}</h3>
                <p className="why-card-desc">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Indicators below carousel: ● ━ ● ● */}
      <div className="why-pagination-row">
        {TRUST_BENEFITS.map((_, i) => (
          <button
            key={i}
            className={`why-dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <style>{`
        .why-carousel-section {
          position: relative;
          overflow: hidden;
          padding: 8px 0 20px;
        }

        .section-header-center {
          text-align: center;
          margin-bottom: 18px;
        }

        .why-carousel-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 14px 0 18px;
          cursor: grab;
          user-select: none;
        }

        .why-carousel-container:active {
          cursor: grabbing;
        }

        .why-carousel-track {
          display: flex;
          align-items: center;
          will-change: transform;
        }

        .why-card {
          flex-shrink: 0;
          background: #FFFFFF;
          border-radius: var(--radius-md);
          padding: 22px 18px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 180px;
          transition: transform 500ms cubic-bezier(0.25, 1, 0.35, 1),
                      opacity 500ms ease,
                      box-shadow 500ms ease,
                      border-color 500ms ease;
          border: 1px solid var(--border-color);
        }

        /* CENTER CARD: Large, Highlighted, Scale 1, Opacity 1, Strong Shadow */
        .why-card.card-center {
          transform: scale(1);
          opacity: 1;
          border-color: var(--deep-forest-green);
          border-width: 1.5px;
          box-shadow: 0 10px 30px rgba(7, 84, 55, 0.14);
          z-index: 5;
        }

        /* SIDE CARDS: Scale ~0.88, Opacity ~0.75 */
        .why-card.card-side {
          transform: scale(0.88);
          opacity: 0.75;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          border-color: var(--border-color);
          z-index: 2;
          cursor: pointer;
        }

        /* SUBTLE CARDS: Visible, never hidden */
        .why-card.card-subtle {
          transform: scale(0.82);
          opacity: 0.5;
          border-color: var(--border-light);
          z-index: 1;
          cursor: pointer;
        }

        .why-icon-bubble {
          color: var(--deep-forest-green);
          background: var(--surface-light-green);
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          transition: transform 500ms ease;
        }

        .card-center .why-icon-bubble {
          transform: scale(1.08);
          background: #E2ECE5;
        }

        .why-card-title {
          font-size: 1.02rem;
          font-weight: 800;
          color: var(--deep-forest-green);
          margin-bottom: 6px;
          line-height: 1.25;
        }

        .why-card-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.45;
          max-width: 240px;
        }

        /* PAGINATION: ● ━ ● ● */
        .why-pagination-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
        }

        .why-dot {
          height: 6px;
          width: 6px;
          border-radius: var(--radius-pill);
          background: #D8DDD9;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 300ms ease;
        }

        .why-dot.active {
          width: 20px;
          background: var(--deep-forest-green);
        }
      `}</style>
    </section>
  );
};

export default WhyMadurFreshCarousel;
