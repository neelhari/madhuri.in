import React, { useState } from 'react';
import {
  Package,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useStoreData } from '../context/StoreDataContext';

export const OrdersPage = ({ navigate }) => {
  const { products } = useStoreData();
  const { orders } = useOrders();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState(orders[0] || null);

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      const originalProduct = (products || []).find((p) => p.id === item.productId);
      if (originalProduct) {
        const weightObj = originalProduct.weights.find((w) => w.label === item.weight) || originalProduct.weights[0];
        addToCart(originalProduct, weightObj.id, item.quantity);
      }
    });
    showToast('Items added to cart! Proceeding to cart...', 'success');
    navigate('/cart');
  };

  const statusSteps = [
    { label: 'Order Placed', code: 1 },
    { label: 'Confirmed', code: 2 },
    { label: 'Preparing Fresh Cut', code: 3 },
    { label: 'Out for Delivery', code: 4 },
    { label: 'Delivered', code: 5 }
  ];

  if (!orders.length) {
    return (
      <div className="orders-page empty-orders-page animate-fade-in">
        <div className="app-container">
          <div className="empty-orders-card">
            <Package size={52} color="var(--primary-green)" />
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet. Taste the freshness today!</p>
            <button className="btn btn-primary" onClick={() => navigate('/categories')}>
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page animate-fade-in">
      <div className="app-container">
        <div className="orders-header-row">
          <h1 className="orders-title">My Orders ({orders.length})</h1>
        </div>

        <div className="orders-layout-grid">
          {/* Left Column: Orders List */}
          <div className="orders-list-col">
            {orders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  className={`order-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="order-card-header">
                    <div className="order-id-date">
                      <span className="order-id-txt">#{order.id}</span>
                      <span className="order-date-txt">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <span
                      className={`order-status-badge status-${order.statusCode}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="order-card-items-preview">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="preview-item-chip">
                        {item.name} ({item.weight}) × {item.quantity}
                      </span>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <div className="order-total-price">
                      <span>Total: </span>
                      <strong>₹{order.summary.total}</strong>
                    </div>

                    <div className="order-card-actions">
                      <button
                        className="btn btn-sm btn-outline reorder-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorder(order);
                        }}
                      >
                        <RotateCcw size={13} />
                        Reorder
                      </button>
                      <button className="view-details-arrow">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Order Tracking Detail */}
          {selectedOrder && (
            <div className="order-tracker-col">
              <div className="tracker-card">
                <div className="tracker-header">
                  <div>
                    <span className="tracker-tag">Live Order Status</span>
                    <h3 className="tracker-id">#{selectedOrder.id}</h3>
                  </div>
                  <span className="tracker-time-est">
                    ⚡ {selectedOrder.estimatedDelivery}
                  </span>
                </div>

                {/* Timeline Bar */}
                <div className="tracker-timeline">
                  {statusSteps.map((s, idx) => {
                    const isDone = selectedOrder.statusCode >= s.code;
                    const isCurrent = selectedOrder.statusCode === s.code;

                    return (
                      <div
                        key={s.code}
                        className={`timeline-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                      >
                        <div className="timeline-node">
                          {isDone ? <CheckCircle2 size={16} /> : <span>{s.code}</span>}
                        </div>
                        {idx < statusSteps.length - 1 && (
                          <div
                            className={`timeline-connector ${selectedOrder.statusCode > s.code ? 'filled' : ''}`}
                          />
                        )}
                        <span className="timeline-step-label">{s.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Location Info */}
                <div className="tracker-delivery-info">
                  <MapPin size={18} color="var(--primary-green)" />
                  <div>
                    <span className="t-label">Delivery Destination</span>
                    <p className="t-addr">
                      {selectedOrder.address.name} ({selectedOrder.address.phone})
                      <br />
                      {selectedOrder.address.house}, {selectedOrder.address.area},{' '}
                      {selectedOrder.address.city} - {selectedOrder.address.pincode}
                    </p>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="tracker-items-section">
                  <h4 className="t-items-title">Items in this Delivery</h4>
                  <div className="t-items-list">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="t-item-row">
                        <img src={item.image} alt="" className="t-item-thumb" />
                        <div className="t-item-info">
                          <span className="t-item-name">{item.name}</span>
                          <span className="t-item-weight">
                            {item.weight} • Qty: {item.quantity}
                          </span>
                        </div>
                        <span className="t-item-price">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bill Snapshot */}
                <div className="tracker-bill-snapshot">
                  <div className="t-bill-row">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.summary.subtotal}</span>
                  </div>
                  <div className="t-bill-row">
                    <span>Delivery</span>
                    <span>{selectedOrder.summary.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.summary.deliveryFee}`}</span>
                  </div>
                  <div className="t-bill-row grand">
                    <span>Grand Total</span>
                    <span>₹{selectedOrder.summary.total}</span>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-block"
                  onClick={() => handleReorder(selectedOrder)}
                >
                  <RotateCcw size={16} />
                  <span>Reorder These Fresh Cuts</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .orders-page {
          padding-top: 18px;
          padding-bottom: 48px;
        }

        .orders-header-row {
          margin-bottom: 20px;
        }

        .orders-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary-green);
          margin-top: 8px;
        }

        .orders-layout-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 28px;
        }

        .orders-list-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .order-card {
          background: #FFFFFF;
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 16px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .order-card:hover {
          border-color: var(--secondary-green);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .order-card.selected {
          border-color: var(--primary-green);
          background-color: #FAFCF9;
        }

        .order-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .order-id-txt {
          display: block;
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--primary-green);
        }

        .order-date-txt {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .order-status-badge {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
        }

        .status-1, .status-2 {
          background: var(--surface-light-green);
          color: var(--primary-green);
        }

        .status-3, .status-4 {
          background: var(--primary-yellow-light);
          color: var(--text-dark);
          border: 1px solid var(--primary-yellow);
        }

        .status-5 {
          background: #E8F8EE;
          color: #006738;
        }

        .order-card-items-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
        }

        .preview-item-chip {
          background: var(--bg-main);
          padding: 3px 8px;
          border-radius: var(--radius-xs);
          font-size: 0.75rem;
          color: var(--text-dark);
          font-weight: 500;
        }

        .order-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px dashed var(--border-color);
          padding-top: 10px;
        }

        .order-total-price {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .order-total-price strong {
          color: var(--primary-green);
          font-size: 1.05rem;
          margin-left: 4px;
        }

        .order-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .view-details-arrow {
          color: var(--text-muted);
          padding: 4px;
        }

        /* Tracker Card */
        .tracker-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 24px;
          position: sticky;
          top: 90px;
        }

        .tracker-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-light);
        }

        .tracker-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary-green);
          text-transform: uppercase;
        }

        .tracker-id {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-dark);
        }

        .tracker-time-est {
          background: var(--surface-light-green);
          color: var(--primary-green);
          font-size: 0.8rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: var(--radius-pill);
        }

        /* Timeline */
        .tracker-timeline {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 28px;
          padding-left: 8px;
        }

        .timeline-step {
          display: flex;
          align-items: center;
          gap: 14px;
          position: relative;
        }

        .timeline-node {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          background: #FFFFFF;
          z-index: 2;
        }

        .timeline-step.done .timeline-node {
          border-color: var(--primary-green);
          background: var(--primary-green);
          color: #FFFFFF;
        }

        .timeline-step.current .timeline-node {
          border-color: var(--primary-yellow);
          background: var(--primary-yellow);
          color: var(--text-dark);
          box-shadow: 0 0 0 4px rgba(255, 222, 89, 0.3);
        }

        .timeline-connector {
          position: absolute;
          left: 13px;
          top: 28px;
          width: 2px;
          height: 20px;
          background: var(--border-color);
        }

        .timeline-connector.filled {
          background: var(--primary-green);
        }

        .timeline-step-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .timeline-step.done .timeline-step-label {
          color: var(--text-dark);
          font-weight: 700;
        }

        .timeline-step.current .timeline-step-label {
          color: var(--primary-green);
          font-weight: 800;
        }

        .tracker-delivery-info {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: var(--surface-light-green);
          padding: 12px 14px;
          border-radius: var(--radius-md);
          margin-bottom: 20px;
        }

        .t-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary-green);
          text-transform: uppercase;
        }

        .t-addr {
          font-size: 0.82rem;
          color: var(--text-dark);
          line-height: 1.4;
          margin-top: 2px;
        }

        .tracker-items-section {
          margin-bottom: 20px;
        }

        .t-items-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 10px;
        }

        .t-items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 180px;
          overflow-y: auto;
        }

        .t-item-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .t-item-thumb {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-xs);
          object-fit: cover;
        }

        .t-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .t-item-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .t-item-weight {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .t-item-price {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary-green);
        }

        .tracker-bill-snapshot {
          border-top: 1px dashed var(--border-color);
          padding-top: 10px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.82rem;
        }

        .t-bill-row {
          display: flex;
          justify-content: space-between;
        }

        .t-bill-row.grand {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--primary-green);
          padding-top: 4px;
        }

        @media (max-width: 900px) {
          .orders-layout-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
