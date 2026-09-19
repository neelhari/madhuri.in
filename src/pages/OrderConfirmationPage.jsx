import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  ArrowRight,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';

export const OrderConfirmationPage = ({ orderId, navigate }) => {
  const { getOrderById, orders } = useOrders();
  const order = getOrderById(orderId) || orders[0];

  useEffect(() => {
    // Subtle celebratory confetti on mount
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#006738', '#FFDE59', '#87BD43']
      });
    } catch {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="order-confirm-page animate-fade-in">
        <div className="app-container text-center">
          <h2>Order Not Found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirm-page animate-fade-in">
      <div className="app-container">
        <div className="confirmation-card">
          {/* Animated Success Badge */}
          <div className="success-icon-wrap">
            <CheckCircle2 size={54} color="var(--primary-green)" />
          </div>

          <div className="confetti-badge">
            <Sparkles size={14} />
            <span>Order Confirmed</span>
          </div>

          <h1 className="confirm-title">Order Placed Successfully!</h1>
          <p className="confirm-subtitle">
            Thank you for choosing MadurFresh. Our butchers are preparing your fresh cuts now.
          </p>

          <div className="order-id-pill">
            <span>Order ID: <strong>#{order.id}</strong></span>
          </div>

          {/* Delivery & Status Summary */}
          <div className="confirm-details-grid">
            <div className="confirm-detail-item">
              <Clock size={20} color="var(--primary-green)" />
              <div>
                <span className="det-label">Estimated Delivery</span>
                <strong className="det-val">{order.estimatedDelivery}</strong>
              </div>
            </div>

            <div className="confirm-detail-item">
              <MapPin size={20} color="var(--primary-green)" />
              <div>
                <span className="det-label">Delivering To</span>
                <strong className="det-val">
                  {order.address.house}, {order.address.area}
                </strong>
              </div>
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="confirm-items-box">
            <h4 className="confirm-items-title">Ordered Items ({order.items.length})</h4>
            <div className="confirm-items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="confirm-item-row">
                  <img src={item.image} alt="" className="confirm-item-thumb" />
                  <div className="confirm-item-info">
                    <span className="c-item-name">{item.name}</span>
                    <span className="c-item-weight">{item.weight} × {item.quantity}</span>
                  </div>
                  <span className="c-item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="confirm-total-row">
              <span>Total Paid ({order.paymentMethod}):</span>
              <strong className="c-grand-total">₹{order.summary.total}</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="confirm-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/orders')}
            >
              <Package size={18} />
              <span>Track Order Live</span>
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate('/')}
            >
              <ShoppingBag size={18} />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .order-confirm-page {
          padding: 36px 0 60px 0;
        }

        .confirmation-card {
          background: #FFFFFF;
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: 40px 28px;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: var(--shadow-md);
        }

        .success-icon-wrap {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background: var(--surface-light-green);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
          animation: pulseGlow 2s infinite ease-in-out;
        }

        .confetti-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--primary-yellow-light);
          color: var(--text-dark);
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 12px;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .confirm-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--primary-green);
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .confirm-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.45;
          margin-bottom: 20px;
        }

        .order-id-pill {
          display: inline-block;
          background: var(--bg-main);
          border: 1px dashed var(--border-color);
          padding: 6px 16px;
          border-radius: var(--radius-pill);
          font-size: 0.85rem;
          color: var(--text-dark);
          margin-bottom: 24px;
        }

        .confirm-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 28px;
          text-align: left;
        }

        .confirm-detail-item {
          background: var(--surface-light-green);
          padding: 14px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .det-label {
          display: block;
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        .det-val {
          display: block;
          font-size: 0.875rem;
          color: var(--text-dark);
          margin-top: 2px;
        }

        .confirm-items-box {
          background: var(--bg-main);
          border-radius: var(--radius-lg);
          padding: 20px;
          margin-bottom: 28px;
          text-align: left;
        }

        .confirm-items-title {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--primary-green);
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .confirm-items-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 14px;
        }

        .confirm-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .confirm-item-thumb {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-xs);
          object-fit: cover;
        }

        .confirm-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .c-item-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .c-item-weight {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .c-item-price {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--primary-green);
        }

        .confirm-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px dashed var(--border-color);
          padding-top: 12px;
          font-size: 0.95rem;
        }

        .c-grand-total {
          font-size: 1.25rem;
          color: var(--primary-green);
        }

        .confirm-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (max-width: 600px) {
          .confirm-details-grid {
            grid-template-columns: 1fr;
          }
          .confirmation-card {
            padding: 24px 16px;
          }
        }
      `}</style>
    </div>
  );
};
