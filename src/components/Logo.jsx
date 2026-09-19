import React from 'react';

export const Logo = ({ size = 'medium', withBackground = false, showTagline = false, className = '' }) => {
  const sizes = {
    small: { fontSize: '1.45rem', leafSize: 20 },
    medium: { fontSize: '1.75rem', leafSize: 24 },
    large: { fontSize: '2.4rem', leafSize: 34 }
  };

  const current = sizes[size] || sizes.medium;

  return (
    <div
      className={`brand-logo-container ${withBackground ? 'brand-logo-bg' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textDecoration: 'none',
        userSelect: 'none',
        ...(withBackground ? {
          backgroundColor: 'var(--brand-yellow)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)'
        } : {})
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <span
          style={{
            fontFamily: "'Cinzel', 'Playfair Display', serif",
            fontWeight: 800,
            fontSize: current.fontSize,
            color: 'var(--deep-forest-green)',
            letterSpacing: '0.04em',
            lineHeight: 1,
            position: 'relative'
          }}
        >
          MADUR.IN
        </span>
        
        {/* The two iconic leaves matching the brand identity */}
        <svg
          width={current.leafSize}
          height={current.leafSize}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            right: '-16px',
            top: '-8px',
            pointerEvents: 'none'
          }}
        >
          {/* Light green leaf */}
          <path
            d="M8 26C8 16 16 10 24 8C24 16 20 28 8 26Z"
            fill="#87BD43"
          />
          <path
            d="M11 23C15 19 18 15 22 10"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Dark green leaf */}
          <path
            d="M18 34C18 20 28 12 38 10C38 22 32 36 18 34Z"
            fill="#075437"
          />
          <path
            d="M22 30C28 25 32 20 36 14"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showTagline && (
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: '0.65rem',
            color: 'var(--charcoal)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginTop: '3px',
            paddingLeft: '2px'
          }}
        >
          The Quality Choice
        </span>
      )}
    </div>
  );
};
