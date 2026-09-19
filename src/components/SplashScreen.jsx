import React, { useState, useEffect, useRef } from 'react';

export const SplashScreen = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Attempt playback immediately
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log('Autoplay handled:', err);
      });
    }
  }, []);

  const handleVideoEnded = () => {
    // Settle on final frame briefly then fade out gracefully
    setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 650);
    }, 250);
  };

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 450);
  };

  return (
    <div
      className={`splash-overlay ${isFading ? 'splash-fading' : ''}`}
      onClick={handleSkip}
    >
      <div className="splash-video-container">
        <video
          ref={videoRef}
          src="/splash-video.mp4"
          poster="/splash-poster.png"
          autoPlay
          muted
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          onEnded={handleVideoEnded}
          className="splash-video-element"
        />
      </div>

      <style>{`
        .splash-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          background-color: #FFDA55;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          cursor: pointer;
          transition: opacity 650ms cubic-bezier(0.22, 1, 0.36, 1),
                      visibility 650ms ease;
          opacity: 1;
          visibility: visible;
        }

        .splash-overlay.splash-fading {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .splash-video-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #FFDA55;
        }

        .splash-video-element {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background-color: #FFDA55;
        }

        @media (max-width: 768px) {
          .splash-video-element {
            object-fit: cover;
          }
        }
      `}</style>
    </div>
  );
};
