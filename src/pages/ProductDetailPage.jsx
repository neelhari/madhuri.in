import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  ChefHat
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocation } from '../context/LocationContext';
import { useToast } from '../context/ToastContext';
import { useStoreData } from '../context/StoreDataContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage = ({ slug, navigate }) => {
  const { products } = useStoreData();
  const product = (products || []).find((p) => p.slug === slug || p.id === slug) || products?.[0] || {
    name: 'Fresh Meat Cut',
    weights: []
  };
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { currentLocation, setIsLocationModalOpen } = useLocation();
  const { showToast } = useToast();

  const [selectedWeightId, setSelectedWeightId] = useState(
    product.weights?.[0]?.id || ''
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');

  const selectedWeight =
    product.weights?.find((w) => w.id === selectedWeightId) || product.weights?.[0];

  const currentQty = getItemQuantity(product.id, selectedWeight.id);
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedWeight.id, 1);
    showToast(`Added ${product.name} (${selectedWeight.label}) to cart!`, 'success');
  };

  const handleBuyNow = () => {
    if (currentQty === 0) {
      addToCart(product, selectedWeight.id, 1);
    }
    navigate('/cart');
  };

  const relatedProducts = (products || []).filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="product-detail-page animate-fade-in">
      <div className="app-container">
        <div className="pdp-layout-grid">
          {/* Left: Image Gallery */}
          <div className="pdp-gallery-col">
            <div className="pdp-main-image-wrap">
              <img
                src={product.images?.[activeImageIndex] || product.images?.[0]}
                alt={product.name}
                className="pdp-main-image"
              />
              <span className="pdp-badge-tag">{product.tag}</span>
              <button
                className={`pdp-wishlist-btn ${isFavorited ? 'favorited' : ''}`}
                onClick={() => {
                  toggleWishlist(product.id);
                  showToast(
                    isFavorited ? 'Removed from wishlist' : 'Saved to wishlist ❤️',
                    'info'
                  );
                }}
                aria-label="Wishlist"
              >
                <Heart
                  size={20}
                  fill={isFavorited ? '#E53935' : 'none'}
                  color={isFavorited ? '#E53935' : '#172018'}
                />
              </button>
            </div>

            {/* Gallery Thumbnails */}
            {product.images?.length > 1 && (
              <div className="pdp-thumbnails-row">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`pdp-thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Highlights below image on desktop */}
            <div className="pdp-trust-card desktop-only">
              <div className="pdp-trust-item">
                <ShieldCheck size={20} color="var(--primary-green)" />
                <div>
                  <strong>100% Quality Assured</strong>
                  <span>Antibiotic-free & hygienically prepped</span>
                </div>
              </div>
              <div className="pdp-trust-item">
                <Truck size={20} color="var(--primary-green)" />
                <div>
                  <strong>Cold-Chain Express Delivery</strong>
                  <span>Chilled at 0-4°C to your doorstep</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="pdp-info-col">
            {/* Category & Rating */}
            <div className="pdp-header-row">
              <span className="pdp-category-name">{product.categoryName || product.category}</span>
              <div className="rating-badge">
                <Star size={14} fill="#FFDE59" color="#D9A800" />
                <span>{product.rating || '4.9'}</span>
                <span className="rating-count">({product.reviewCount || '80+'} reviews)</span>
              </div>
            </div>

            <h1 className="pdp-title">{product.name}</h1>
            <p className="pdp-short-desc">{product.shortDescription || product.description}</p>

            {/* Select Weight & Price Cards */}
            <div className="pdp-weight-box">
              <div className="weight-box-header">
                <span className="weight-box-title">Select Pack Weight & Price:</span>
                {selectedWeight.serves && (
                  <span className="weight-box-sub">Ideal for {selectedWeight.serves}</span>
                )}
              </div>

              <div className="pdp-weights-grid">
                {product.weights?.map((w) => {
                  const isSelected = w.id === selectedWeight.id;
                  const discountPercent = w.discount || (w.originalPrice && w.originalPrice > w.price ? Math.round(((w.originalPrice - w.price) / w.originalPrice) * 100) : 0);
                  
                  return (
                    <div
                      key={w.id}
                      className={`pdp-weight-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedWeightId(w.id)}
                    >
                      <div className="pdp-weight-top">
                        <span className="weight-lbl">{w.label}</span>
                        {isSelected && <CheckCircle2 size={16} color="var(--primary-green)" />}
                      </div>
                      <div className="pdp-weight-prices">
                        <span className="w-price">₹{w.price}</span>
                        {w.originalPrice && w.originalPrice > w.price && (
                          <span className="w-mrp">₹{w.originalPrice}</span>
                        )}
                      </div>
                      {discountPercent > 0 && (
                        <span className="w-discount">{discountPercent}% OFF</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add to Cart / Buy Now Action Bar */}
            <div className="pdp-actions-row">
              {currentQty === 0 ? (
                <button
                  className="btn btn-primary btn-lg btn-block pdp-add-btn"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={20} />
                  <span>Add to Cart • ₹{selectedWeight.price}</span>
                </button>
              ) : (
                <div className="pdp-qty-control-wrap">
                  <div className="qty-stepper large">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(product.id, selectedWeight.id, currentQty - 1)}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="qty-count">{currentQty} in cart</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(product.id, selectedWeight.id, currentQty + 1)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              )}

              <button
                className="btn btn-yellow btn-lg btn-block pdp-buy-btn"
                onClick={handleBuyNow}
              >
                <Zap size={18} />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Clean Trust & Delivery Highlights */}
            <div className="pdp-clean-highlights">
              <div className="pdp-highlight-pill">
                <ShieldCheck size={18} color="var(--primary-green)" />
                <span>100% Antibiotic-Free & Hygienic</span>
              </div>
              <div className="pdp-highlight-pill">
                <Sparkles size={18} color="var(--primary-green)" />
                <span>Daily Farm-Fresh Cut</span>
              </div>
              <div className="pdp-highlight-pill delivery-pill">
                <Truck size={18} color="var(--primary-green)" />
                <span>⚡ Express Delivery to <strong>{currentLocation.area || 'Bangalore'}</strong></span>
                <button
                  className="delivery-pill-btn"
                  onClick={() => setIsLocationModalOpen(true)}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related / Other Cuts */}
        <section className="section pdp-related-section">
          <div className="section-header">
            <div>
              <h3 className="section-title">You May Also Like</h3>
              <p className="section-subtitle">Complement your order with other freshly prepped cuts</p>
            </div>
          </div>
          <div className="products-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .product-detail-page {
          padding-top: 18px;
          padding-bottom: 48px;
        }

        .pdp-layout-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 40px;
          margin-top: 12px;
          margin-bottom: 48px;
        }

        .pdp-gallery-col {
          position: sticky;
          top: 90px;
          height: fit-content;
        }

        .pdp-main-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background-color: #EBF3E8;
          box-shadow: var(--shadow-sm);
        }

        .pdp-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pdp-badge-tag {
          position: absolute;
          top: 14px;
          left: 14px;
          background-color: var(--primary-yellow);
          color: var(--text-dark);
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
        }

        .pdp-wishlist-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          transition: transform var(--transition-fast);
        }

        .pdp-wishlist-btn:hover {
          transform: scale(1.1);
        }

        .pdp-thumbnails-row {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }

        .pdp-thumb-btn {
          width: 70px;
          height: 60px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 2px solid transparent;
          transition: all var(--transition-fast);
        }

        .pdp-thumb-btn.active {
          border-color: var(--primary-green);
        }

        .pdp-thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pdp-trust-card {
          margin-top: 24px;
          background: var(--surface-light-green);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pdp-trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pdp-trust-item strong {
          display: block;
          font-size: 0.85rem;
          color: var(--primary-green);
        }

        .pdp-trust-item span {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Right Column */
        .pdp-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .pdp-category-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-green);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .pdp-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .pdp-short-desc {
          font-size: 0.92rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .pdp-delivery-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--surface-light-green);
          border: 1px solid #DCE7D6;
          border-radius: var(--radius-md);
          padding: 12px 16px;
          margin-bottom: 22px;
        }

        .delivery-icon-box {
          color: var(--primary-green);
        }

        .delivery-text-box {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .delivery-status-txt {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .delivery-area-txt {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--primary-green);
        }

        .delivery-change-btn {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-green);
          text-decoration: underline;
        }

        .pdp-weight-box {
          margin-bottom: 22px;
        }

        .weight-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .weight-box-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--text-dark);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .weight-box-sub {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .pdp-weights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 10px;
        }

        .pdp-weight-card {
          border: 2px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          cursor: pointer;
          transition: all var(--transition-fast);
          background: #FFFFFF;
        }

        .pdp-weight-card:hover {
          border-color: var(--secondary-green);
        }

        .pdp-weight-card.selected {
          border-color: var(--primary-green);
          background: #F4F9F1;
        }

        .pdp-weight-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .weight-lbl {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-dark);
        }

        .pdp-weight-prices {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .w-price {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--primary-green);
        }

        .w-mrp {
          font-size: 0.75rem;
          color: var(--text-subtle);
          text-decoration: line-through;
        }

        .w-discount {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          color: #D32F2F;
          margin-top: 2px;
        }

        .pdp-pricing-card {
          background: var(--surface-light-green);
          border-radius: var(--radius-md);
          padding: 14px 18px;
          margin-bottom: 22px;
        }

        .pdp-price-breakdown {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .pdp-price-current {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--primary-green);
        }

        .pdp-price-mrp {
          font-size: 1rem;
          color: var(--text-muted);
          text-decoration: line-through;
        }

        .pdp-savings-note {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-green);
          margin-top: 4px;
        }

        .pdp-actions-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }

        .pdp-qty-control-wrap {
          display: flex;
        }

        .qty-stepper.large {
          width: 100%;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 8px;
        }

        .qty-stepper.large .qty-btn {
          width: 40px;
          height: 40px;
        }

        .qty-stepper.large .qty-count {
          font-size: 0.95rem;
        }

        /* Clean Trust & Delivery Highlights */
        .pdp-clean-highlights {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #F4F9F1;
          border: 1px solid #DCE7D6;
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          margin-top: 8px;
        }

        .pdp-highlight-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.84rem;
          font-weight: 600;
          color: #2D3748;
        }

        .pdp-highlight-pill.delivery-pill {
          padding-top: 8px;
          border-top: 1px dashed #CBD5E0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .delivery-pill-btn {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--primary-green);
          text-decoration: underline;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        @media (max-width: 900px) {
          .pdp-layout-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .pdp-gallery-col {
            position: relative;
            top: 0;
          }
          .pdp-title {
            font-size: 1.45rem;
          }
          .pdp-actions-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
