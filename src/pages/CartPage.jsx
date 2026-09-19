import React, { useState } from 'react';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { useToast } from '../context/ToastContext';
import { BRAND_INFO } from '../data/products';

export const CartPage = ({ navigate }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    originalTotal,
    productSavings,
    couponSavings,
    totalSavings,
    deliveryFee,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeDeliveryRemaining,
    freeDeliveryProgress
  } = useCart();

  const { currentLocation, setIsLocationModalOpen } = useLocation();
  const { showToast } = useToast();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    if (result.success) {
      showToast(result.message, 'success');
      setCouponInput('');
    } else {
      showToast(result.message, 'warning');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    showToast('Coupon removed', 'info');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart-page animate-fade-in">
        <div className="app-container">
          <div className="empty-cart-card">
            <div className="empty-icon-wrap">
              <ShoppingBag size={48} color="var(--primary-green)" />
            </div>
            <h2 className="empty-title">Your cart is empty</h2>
            <p className="empty-desc">
              Fresh cuts of farm chicken, tender mutton, and day-catch seafood
              are waiting for you.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/categories')}
            >
              <span>Explore Fresh Products</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <style>{`
          .empty-cart-page {
            padding: 60px 0;
          }
          .empty-cart-card {
            background: #FFFFFF;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-xl);
            padding: 48px 24px;
            text-align: center;
            max-width: 480px;
            margin: 0 auto;
            box-shadow: var(--shadow-sm);
          }
          .empty-icon-wrap {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: var(--surface-light-green);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
          }
          .empty-title {
            font-size: 1.6rem;
            font-weight: 800;
            color: var(--primary-green);
            margin-bottom: 8px;
          }
          .empty-desc {
            font-size: 0.95rem;
            color: var(--text-muted);
            line-height: 1.5;
            margin-bottom: 28px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page animate-fade-in">
      <div className="app-container">
        {/* Header */}
        <div className="cart-header-row">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            <span>Continue Shopping</span>
          </button>
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <h1 className="cart-page-title">Your Fresh Cart ({cartItems.length})</h1>

        <div className="cart-layout-grid">
          {/* Left Column: Cart Items List */}
          <div className="cart-items-col">
            {/* Free Delivery Bar */}
            <div className="free-delivery-progress-card">
              <div className="progress-text-row">
                {freeDeliveryRemaining > 0 ? (
                  <span>
                    Add <strong>₹{freeDeliveryRemaining}</strong> more for <strong>FREE Delivery</strong>
                  </span>
                ) : (
                  <span className="free-unlocked-text">
                    🎉 Yay! You unlocked <strong>FREE Express Delivery</strong>
                  </span>
                )}
                <span className="threshold-pill">₹{BRAND_INFO.freeDeliveryThreshold} Goal</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.key} className="cart-item-card">
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <h4
                        className="cart-item-title"
                        onClick={() => navigate(`/product/${item.product.slug}`)}
                      >
                        {item.product.name}
                      </h4>
                      <button
                        className="item-remove-btn"
                        onClick={() => removeFromCart(item.productId, item.weightId)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="cart-item-weight-tag">
                      <span>Weight: <strong>{item.weight.label}</strong></span>
                      <span className="weight-sub">({item.weight.netWeight})</span>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="cart-item-prices">
                        <span className="c-price">₹{item.weight.price * item.quantity}</span>
                        <span className="c-mrp">
                          ₹{item.weight.originalPrice * item.quantity}
                        </span>
                      </div>

                      <div className="qty-stepper">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item.productId, item.weightId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-count">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item.productId, item.weightId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery address preview in cart */}
            <div className="cart-delivery-pill">
              <div className="cart-del-info">
                <span>⚡ Delivering to: <strong>{currentLocation.area}, {currentLocation.pincode}</strong></span>
                <span className="cart-del-time">Estimated delivery in 45-60 mins</span>
              </div>
              <button
                className="cart-del-change"
                onClick={() => setIsLocationModalOpen(true)}
              >
                Change
              </button>
            </div>
          </div>

          {/* Right Column: Bill Summary & Coupon */}
          <div className="cart-summary-col">
            {/* Coupon Box */}
            <div className="coupon-box-card">
              <div className="coupon-card-header">
                <Tag size={16} color="var(--primary-green)" />
                <span className="coupon-box-title">Apply Coupon / Promo</span>
              </div>

              {appliedCoupon ? (
                <div className="applied-coupon-pill">
                  <div className="applied-info">
                    <span className="applied-code">{appliedCoupon.code}</span>
                    <span className="applied-desc">({appliedCoupon.label} applied)</span>
                  </div>
                  <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-input-row">
                  <input
                    type="text"
                    placeholder="Enter code (MADUR50 / FRESH10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="coupon-input"
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    Apply
                  </button>
                </form>
              )}

              <div className="coupon-suggestions">
                <span className="coupon-avail">Available offers:</span>
                <div className="coupon-chips">
                  <button
                    type="button"
                    className="coupon-chip-btn"
                    onClick={() => {
                      applyCoupon('MADUR50');
                      showToast('Coupon MADUR50 applied! Saved ₹50', 'success');
                    }}
                  >
                    MADUR50 (Save ₹50)
                  </button>
                  <button
                    type="button"
                    className="coupon-chip-btn"
                    onClick={() => {
                      applyCoupon('FRESH10');
                      showToast('Coupon FRESH10 applied! Saved 10%', 'success');
                    }}
                  >
                    FRESH10 (10% Off)
                  </button>
                </div>
              </div>
            </div>

            {/* Bill Details */}
            <div className="bill-summary-card">
              <h3 className="bill-title">Bill Summary</h3>

              <div className="bill-rows">
                <div className="bill-row">
                  <span className="bill-label">Item Total (MRP)</span>
                  <span className="bill-val">₹{originalTotal}</span>
                </div>

                <div className="bill-row savings-row">
                  <span className="bill-label">Product Discount</span>
                  <span className="bill-val">- ₹{productSavings}</span>
                </div>

                {appliedCoupon && (
                  <div className="bill-row savings-row">
                    <span className="bill-label">Coupon Discount ({appliedCoupon.code})</span>
                    <span className="bill-val">- ₹{couponSavings}</span>
                  </div>
                )}

                <div className="bill-row">
                  <span className="bill-label">Delivery Fee</span>
                  <span className="bill-val">
                    {deliveryFee === 0 ? (
                      <strong className="free-tag">FREE</strong>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="bill-divider" />

                <div className="bill-row grand-total-row">
                  <div>
                    <span className="grand-label">To Pay</span>
                    <span className="taxes-note">Inclusive of all taxes</span>
                  </div>
                  <span className="grand-val">₹{grandTotal}</span>
                </div>
              </div>

              {totalSavings > 0 && (
                <div className="total-savings-banner">
                  <Sparkles size={16} />
                  <span>You saved a total of <strong>₹{totalSavings}</strong> on this order!</span>
                </div>
              )}

              <button
                className="btn btn-primary btn-lg btn-block checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page {
          padding-top: 18px;
          padding-bottom: 48px;
        }

        .cart-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .clear-cart-btn {
          font-size: 0.8rem;
          font-weight: 700;
          color: #E53935;
        }

        .cart-page-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary-green);
          margin-bottom: 20px;
        }

        .cart-layout-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 28px;
        }

        .free-delivery-progress-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 14px 18px;
          margin-bottom: 16px;
        }

        .progress-text-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.82rem;
          color: var(--text-dark);
          margin-bottom: 8px;
        }

        .free-unlocked-text {
          color: var(--primary-green);
          font-weight: 700;
        }

        .threshold-pill {
          font-size: 0.7rem;
          font-weight: 700;
          background: var(--surface-light-green);
          color: var(--primary-green);
          padding: 2px 8px;
          border-radius: var(--radius-pill);
        }

        .progress-track {
          width: 100%;
          height: 6px;
          background: #E8EDE7;
          border-radius: var(--radius-pill);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--primary-green);
          border-radius: var(--radius-pill);
          transition: width 0.3s ease;
        }

        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .cart-item-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 14px;
          display: flex;
          gap: 14px;
        }

        .cart-item-image {
          width: 84px;
          height: 84px;
          border-radius: var(--radius-md);
          object-fit: cover;
          flex-shrink: 0;
        }

        .cart-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .cart-item-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .cart-item-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-dark);
          cursor: pointer;
          line-height: 1.25;
        }

        .cart-item-title:hover {
          color: var(--primary-green);
        }

        .item-remove-btn {
          color: var(--text-muted);
          padding: 4px;
          transition: color var(--transition-fast);
        }

        .item-remove-btn:hover {
          color: #E53935;
        }

        .cart-item-weight-tag {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .weight-sub {
          margin-left: 4px;
        }

        .cart-item-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }

        .cart-item-prices {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .c-price {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--primary-green);
        }

        .c-mrp {
          font-size: 0.8rem;
          color: var(--text-subtle);
          text-decoration: line-through;
        }

        .cart-delivery-pill {
          background: var(--surface-light-green);
          border: 1px solid #DCE7D6;
          border-radius: var(--radius-md);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cart-del-info {
          display: flex;
          flex-direction: column;
          font-size: 0.8rem;
          color: var(--text-dark);
        }

        .cart-del-time {
          font-size: 0.72rem;
          color: var(--primary-green);
          font-weight: 600;
        }

        .cart-del-change {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--primary-green);
          text-decoration: underline;
        }

        /* Right Column */
        .coupon-box-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 18px;
          margin-bottom: 18px;
        }

        .coupon-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .coupon-box-title {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--primary-green);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .coupon-input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .coupon-input {
          flex: 1;
          padding: 8px 12px;
          background: var(--bg-main);
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          text-transform: uppercase;
        }

        .coupon-input:focus {
          border-color: var(--primary-green);
          outline: none;
          background: #FFFFFF;
        }

        .applied-coupon-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--surface-light-green);
          border: 1px solid var(--primary-green);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          margin-bottom: 12px;
        }

        .applied-code {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--primary-green);
        }

        .applied-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-left: 6px;
        }

        .remove-coupon-btn {
          font-size: 0.75rem;
          font-weight: 700;
          color: #E53935;
        }

        .coupon-suggestions {
          border-top: 1px dashed var(--border-color);
          padding-top: 10px;
        }

        .coupon-avail {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          display: block;
          margin-bottom: 6px;
        }

        .coupon-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .coupon-chip-btn {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary-green);
          background: var(--surface-light-green);
          border: 1px solid #DCE7D6;
          border-radius: var(--radius-pill);
          padding: 4px 10px;
          transition: all var(--transition-fast);
        }

        .coupon-chip-btn:hover {
          background: #E0EED9;
        }

        /* Bill Summary */
        .bill-summary-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 20px;
        }

        .bill-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--primary-green);
          margin-bottom: 16px;
        }

        .bill-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }

        .bill-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.875rem;
          color: var(--text-dark);
        }

        .savings-row {
          color: var(--primary-green);
          font-weight: 600;
        }

        .free-tag {
          color: var(--primary-green);
          font-weight: 800;
        }

        .bill-divider {
          height: 1px;
          background: var(--border-color);
          margin: 6px 0;
        }

        .grand-total-row {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-dark);
          padding-top: 4px;
        }

        .taxes-note {
          display: block;
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .grand-val {
          color: var(--primary-green);
          font-size: 1.35rem;
        }

        .total-savings-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary-yellow-light);
          border: 1px solid var(--primary-yellow);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          font-size: 0.82rem;
          color: var(--text-dark);
          margin-bottom: 18px;
        }

        .checkout-btn {
          font-size: 1rem;
          font-weight: 800;
        }

        @media (max-width: 900px) {
          .cart-layout-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
