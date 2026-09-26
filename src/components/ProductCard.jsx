import React, { useState } from 'react';
import { Heart, Plus, Minus, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export const ProductCard = ({ product, navigate }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedWeightId, setSelectedWeightId] = useState(
    product.weights?.[0]?.id || ''
  );

  const selectedWeight =
    product.weights?.find((w) => w.id === selectedWeightId) || product.weights?.[0];

  const currentQty = getItemQuantity(product.id, selectedWeight.id);
  const isFavorited = isInWishlist(product.id);

  const handleWeightSelect = (e, weightId) => {
    e.stopPropagation();
    setSelectedWeightId(weightId);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, selectedWeight.id, 1);
    showToast(`Added ${product.name} (${selectedWeight.label}) to cart!`, 'success');
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    updateQuantity(product.id, selectedWeight.id, currentQty + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(product.id, selectedWeight.id, currentQty - 1);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Very short descriptor
  const shortDescriptor = product.category === 'chicken'
    ? 'Skinless • Fresh cut'
    : product.category === 'mutton'
    ? 'Tender cut • Naturally grazed'
    : 'Cleaned & deveined';

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      {/* 60% IMAGE: Large, dominant, clean with small heart */}
      <div className="product-media-container">
        <img
          src={product.images?.[0]}
          alt={product.name}
          loading="lazy"
          className="product-image"
        />

        {/* Desktop Quality Pill */}
        <div className="product-top-badge desktop-only">
          <ShieldCheck size={11} /> 100% Antibiotic-free
        </div>

        {/* Wishlist heart */}
        <button
          type="button"
          className={`wishlist-heart-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={handleWishlistToggle}
          aria-label="Wishlist"
        >
          <Heart
            size={15}
            fill={isFavorited ? '#E53935' : 'none'}
            color={isFavorited ? '#E53935' : '#17201B'}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="product-body">
        {/* Product Name */}
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        {/* Short Descriptor */}
        <p className="product-descriptor">{shortDescriptor}</p>

        {/* Weight Selector */}
        <div className="weight-pills-row">
          {product.weights?.map((w) => {
            const isSelected = w.id === selectedWeight.id;
            return (
              <button
                key={w.id}
                type="button"
                className={`weight-pill ${isSelected ? 'selected' : ''}`}
                onClick={(e) => handleWeightSelect(e, w.id)}
                aria-pressed={isSelected}
              >
                {w.label}
              </button>
            );
          })}
        </div>

        {/* Price & Action Row */}
        <div className="product-footer-row">
          <div className="price-container">
            <span className="price-current">₹{selectedWeight.price}</span>
            <div className="price-sub-row">
              <span className="price-original">₹{selectedWeight.originalPrice}</span>
              {selectedWeight.discount > 0 && (
                <span className="discount-tag">{selectedWeight.discount}% OFF</span>
              )}
            </div>
          </div>

          <div className="cart-action-wrap" onClick={(e) => e.stopPropagation()}>
            {currentQty === 0 ? (
              <button
                type="button"
                className="btn-add-to-cart"
                onClick={handleAddToCart}
                aria-label={`Add ${product.name} to cart`}
              >
                <span>ADD</span>
                <Plus size={13} strokeWidth={2.5} />
              </button>
            ) : (
              <div className="qty-stepper">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} strokeWidth={2.5} />
                </button>
                <span className="qty-count">{currentQty}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                >
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .product-card {
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          position: relative;
          height: 100%;
          transition: transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .product-card:hover {
          transform: translateY(-2px);
          border-color: var(--deep-forest-green);
        }

        @media (min-width: 1024px) {
          .product-card {
            border-radius: var(--radius-lg);
          }
          .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(7, 84, 55, 0.12);
          }
        }

        /* Image Area */
        .product-media-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1.05 / 1;
          background-color: var(--surface-soft);
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-top-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(4px);
          color: var(--deep-forest-green);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: var(--radius-pill);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .wishlist-heart-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-fast);
        }

        .wishlist-heart-btn:hover {
          transform: scale(1.12);
        }

        .wishlist-heart-btn.favorited {
          background: #FFF5F5;
        }

        /* Content Area */
        .product-body {
          padding: 8px 10px 10px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        @media (min-width: 1024px) {
          .product-body {
            padding: 12px 14px 14px;
          }
        }

        .product-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--charcoal);
          line-height: 1.25;
          margin-bottom: 2px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.1em;
        }

        @media (min-width: 1024px) {
          .product-title {
            font-size: 1.02rem;
            font-weight: 800;
            line-height: 1.3;
          }
        }

        .product-descriptor {
          font-size: 0.68rem;
          color: var(--text-muted);
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (min-width: 1024px) {
          .product-descriptor {
            font-size: 0.76rem;
            margin-bottom: 8px;
          }
        }

        /* Weight Selector */
        .weight-pills-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          flex-wrap: nowrap;
        }

        .weight-pills-row::-webkit-scrollbar {
          display: none;
        }

        .weight-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 22px;
          padding: 0 7px;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 600;
          background: var(--surface-white);
          color: var(--text-muted);
          border: 1px solid var(--border-color);
          white-space: nowrap !important;
          flex-shrink: 0;
          line-height: 1;
          transition: all var(--transition-fast);
        }

        @media (min-width: 1024px) {
          .weight-pill {
            height: 26px;
            padding: 0 10px;
            font-size: 0.76rem;
            border-radius: var(--radius-xs);
          }
        }

        .weight-pill:hover {
          border-color: var(--deep-forest-green);
          color: var(--charcoal);
        }

        .weight-pill.selected {
          background: #EFF5F0;
          color: var(--deep-forest-green);
          border-color: var(--deep-forest-green);
          font-weight: 700;
        }

        /* Footer Row */
        .product-footer-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 4px;
        }

        .price-container {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .price-current {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--deep-forest-green);
        }

        @media (min-width: 1024px) {
          .price-current {
            font-size: 1.25rem;
          }
        }

        .price-sub-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }

        .price-original {
          font-size: 0.7rem;
          color: var(--text-subtle);
          text-decoration: line-through;
          font-weight: 500;
        }

        .discount-tag {
          font-size: 0.65rem;
          font-weight: 700;
          color: #16A34A;
        }

        /* ADD Button */
        .btn-add-to-cart {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          height: 26px;
          background-color: #FFFFFF;
          color: var(--deep-forest-green);
          border: 1.5px solid var(--deep-forest-green);
          border-radius: 4px;
          padding: 0 8px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          transition: all var(--transition-fast);
        }

        .btn-add-to-cart:hover {
          background-color: var(--deep-forest-green);
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(7, 84, 55, 0.2);
        }

        .btn-add-to-cart:active {
          transform: scale(0.96);
        }

        @media (min-width: 1024px) {
          .btn-add-to-cart {
            height: 32px;
            padding: 0 14px;
            font-size: 0.82rem;
            border-radius: var(--radius-sm);
          }
        }

        /* Stepper */
        .qty-stepper {
          display: inline-flex;
          align-items: center;
          height: 26px;
          background-color: var(--deep-forest-green);
          color: #FFFFFF;
          border-radius: 4px;
          overflow: hidden;
        }

        @media (min-width: 1024px) {
          .qty-stepper {
            height: 32px;
            border-radius: var(--radius-sm);
          }
        }

        .qty-btn {
          width: 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          transition: background-color var(--transition-fast);
        }

        @media (min-width: 1024px) {
          .qty-btn {
            width: 28px;
          }
        }

        .qty-btn:hover {
          background-color: var(--dark-green);
        }

        .qty-count {
          min-width: 18px;
          text-align: center;
          font-size: 0.76rem;
          font-weight: 700;
        }

        .desktop-only {
          display: none;
        }

        @media (min-width: 1024px) {
          .desktop-only {
            display: inline-flex;
          }
        }
      `}</style>
    </div>
  );
};

