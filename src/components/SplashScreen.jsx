import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

export const SplashScreen = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // 1. Lock scrolling on body and html so background page cannot scroll or bleed through
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    window.scrollTo(0, 0);

    // 2. Play video immediately
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log('Video autoplay note:', err);
      });
    }

    // 3. Fallback safety timer
    timerRef.current = setTimeout(() => {
      handleComplete();
    }, 8000);

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.touchAction = prevTouchAction;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleComplete = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsFading(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 550);
  };

  const handleVideoEnded = () => {
    // Hold final revealed frame briefly, then fade out smoothly
    setTimeout(() => {
      handleComplete();
    }, 200);
  };

  const splashContent = (
    <div
      className={`splash-overlay ${isFading ? 'splash-fading' : ''}`}
      onClick={handleComplete}
      aria-hidden="true"
    >
      <div className="splash-video-container">
        <video
          ref={videoRef}
          src="/splash-video.mp4"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="splash-video-element"
        />
      </div>

      <style>{`
        .splash-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          inset: 0 !important;
          width: 100vw !important;
          width: 100% !important;
          height: 100vh !important;
          height: 100dvh !important;
          height: -webkit-fill-available !important;
          min-height: 100vh !important;
          min-height: 100dvh !important;
          min-height: -webkit-fill-available !important;
          background-color: #F0E2CD !important;
          z-index: 99999999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          cursor: pointer;
          touch-action: none;
          -webkit-user-select: none;
          user-select: none;
          transition: opacity 550ms cubic-bezier(0.25, 1, 0.5, 1),
                      visibility 550ms ease;
          opacity: 1;
          visibility: visible;
        }

        .splash-overlay.splash-fading {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        .splash-video-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #F0E2CD;
          overflow: hidden;
        }

        .splash-video-element {
          width: 100%;
          height: 100%;
          object-fit: cover !important;
          background-color: #F0E2CD;
          display: block;
        }

        @media (min-width: 1024px) {
          .splash-video-element {
            object-fit: contain !important;
            max-width: 540px;
            max-height: 960px;
          }
        }
      `}</style>
    </div>
  );

  return ReactDOM.createPortal(splashContent, document.body);
};
