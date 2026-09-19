import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, Award, Sparkles, Truck } from 'lucide-react';
import { TRUST_BENEFITS } from '../data/products';

export const WhyMadurFreshCarousel = () => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(390);
  const [isPaused, setIsPaused] = useState(false);
  const [hasTransition, setHasTransition] = useState(true);

  // Triple the list for seamless infinite horizontal scrolling: [0..3, 0..3, 0..3]
  // Middle set starts at index 4 (item 0)
  const items = [...TRUST_BENEFITS, ...TRUST_BENEFITS, ...TRUST_BENEFITS];
  const initialIndex = TRUST_BENEFITS.length; // 4
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Card dimensions
  const isMobile = containerWidth < 640;
  const cardWidth = isMobile ? Math.min(containerWidth * 0.72, 280) : 320;
  const gap = isMobile ? 12 : 18;

  // Auto rotation every 3.5 seconds
  const nextSlide = useCallback(() => {
    setHasTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setHasTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Handle infinite loop reset without animation
  const handleTransitionEnd = () => {
    // If we've reached the end of the middle set (index >= 8 for 4 items)
    if (currentIndex >= TRUST_BENEFITS.length * 2) {
      setHasTransition(false);
      setCurrentIndex((prev) => prev - TRUST_BENEFITS.length);
    }
    // If we've gone backwards past the middle set (index < 4)
    else if (currentIndex < TRUST_BENEFITS.length) {
      setHasTransition(false);
      setCurrentIndex((prev) => prev + TRUST_BENEFITS.length);
    }
  };

  // Re-enable transitions after reset
  useEffect(() => {
    if (!hasTransition) {
      // Force repaint then re-enable transition
      const timer = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHasTransition(true);
        });
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [hasTransition]);

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
    // Resume auto rotation after 4s
    setTimeout(() => setIsPaused(false), 4000);
  };

  // Dot Click
  const handleDotClick = (targetIndex) => {
    setIsPaused(true);
    setHasTransition(true);
    const currentBase = currentIndex % TRUST_BENEFITS.length;
    const stepDiff = targetIndex - currentBase;
    setCurrentIndex((prev) => prev + stepDiff);
    setTimeout(() => setIsPaused(false), 4000);
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

  // Center alignment math
  const trackOffset = (containerWidth / 2) - (currentIndex * (cardWidth + gap)) - (cardWidth / 2);
  const realActiveIndex = currentIndex % TRUST_BENEFITS.length;

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
            transition: hasTransition ? 'transform 600ms cubic-bezier(0.25, 1, 0.35, 1)' : 'none'
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {items.map((item, idx) => {
            const isCenter = idx === currentIndex;
            const isLeft = idx === currentIndex - 1;
            const isRight = idx === currentIndex + 1;

            return (
              <div
                key={`${item.id}-${idx}`}
                className={`why-card ${isCenter ? 'card-center' : isLeft || isRight ? 'card-side' : 'card-hidden'}`}
                style={{
                  width: `${cardWidth}px`,
                  marginRight: `${gap}px`
                }}
                onClick={() => {
                  if (isLeft) prevSlide();
                  if (isRight) nextSlide();
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
            className={`why-dot ${i === realActiveIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Slide ${i + 1}`}
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
          transition: transform 600ms cubic-bezier(0.25, 1, 0.35, 1),
                      opacity 600ms ease,
                      box-shadow 600ms ease,
                      border-color 600ms ease;
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

        /* SIDE CARDS: Smaller, Scale ~0.84, Opacity ~0.65, Weaker Shadow */
        .why-card.card-side {
          transform: scale(0.85);
          opacity: 0.65;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          border-color: var(--border-color);
          z-index: 2;
          cursor: pointer;
        }

        /* HIDDEN CARDS */
        .why-card.card-hidden {
          transform: scale(0.75);
          opacity: 0.3;
          z-index: 1;
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
          transition: transform 600ms ease;
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
