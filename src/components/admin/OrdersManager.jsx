import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  XCircle,
  Eye,
  Phone,
  MapPin,
  Calendar,
  Search,
  ChevronRight,
  User
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

const ORDER_STATUS_CONFIG = {
  Placed: { code: 1, color: '#3182CE', bg: '#EBF8FF', next: 'Confirmed' },
  Confirmed: { code: 2, color: '#D69E2E', bg: '#FEFCBF', next: 'Preparing' },
  Preparing: { code: 3, color: '#DD6B20', bg: '#FEEBC8', next: 'Out for Delivery' },
  'Out for Delivery': { code: 4, color: '#38A169', bg: '#C6F6D5', next: 'Delivered' },
  Delivered: { code: 5, color: '#075437', bg: '#DEF7EC', next: null },
  Cancelled: { code: 0, color: '#E53E3E', bg: '#FED7D7', next: null }
};

export const OrdersManager = () => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusList = [
    'All',
    'Placed',
    'Confirmed',
    'Preparing',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      selectedStatusTab === 'All' || order.status === selectedStatusTab;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (order.id || '').toLowerCase().includes(query) ||
      (order.address?.name || '').toLowerCase().includes(query) ||
      (order.address?.phone || '').includes(query) ||
      (order.address?.area || '').toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  const handleAdvanceStatus = (order, targetStatus) => {
    const targetConfig = ORDER_STATUS_CONFIG[targetStatus];
    if (targetConfig) {
      updateOrderStatus(order.id, targetStatus, targetConfig.code);
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: targetStatus,
          statusCode: targetConfig.code
        }));
      }
    }
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString || 'Recently';
    }
  };

  return (
    <div className="orders-manager-container">
      {/* Top Filter Bar */}
      <div className="orders-top-bar">
        <div className="orders-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Order ID (MF-...), customer name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="orders-status-tabs">
          {statusList.map((status) => {
            const count =
              status === 'All'
                ? orders.length
                : orders.filter((o) => o.status === status).length;
            return (
              <button
                key={status}
                type="button"
                className={`order-tab-btn ${
                  selectedStatusTab === status ? 'active' : ''
                }`}
                onClick={() => setSelectedStatusTab(status)}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Placed Time</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th className="th-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-orders-cell">
                  <ShoppingBag size={40} color="#CBD5E0" />
                  <p>No orders found under "{selectedStatusTab}".</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const cfg = ORDER_STATUS_CONFIG[order.status] || {
                  color: '#4A5568',
                  bg: '#EDF2F7',
                  next: null
                };

                const totalItemsCount = (order.items || []).reduce(
                  (acc, curr) => acc + (curr.quantity || 1),
                  0
                );

                return (
                  <tr key={order.id} className="order-row">
                    <td>
                      <span className="order-id-tag">{order.id}</span>
                    </td>

                    <td>
                      <div className="time-cell">
                        <Calendar size={13} color="#718096" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </td>

                    <td>
                      <div className="customer-cell">
                        <span className="cust-name">
                          {order.address?.name || 'Customer'}
                        </span>
                        <span className="cust-phone">
                          {order.address?.phone || '-'}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="items-summary-badge">
                        {totalItemsCount} items
                      </span>
                    </td>

                    <td>
                      <span className="order-total-price">
                        ₹{order.summary?.total || 0}
                      </span>
                    </td>

                    <td>
                      <div className="payment-cell">
                        <span className="pay-method">{order.paymentMethod || 'Online'}</span>
                        <span
                          className={`pay-status ${
                            order.paymentStatus === 'Paid' ? 'paid' : 'pending'
                          }`}
                        >
                          {order.paymentStatus || 'Paid'}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className="order-status-chip"
                        style={{ color: cfg.color, backgroundColor: cfg.bg }}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="td-right">
                      <div className="order-row-actions">
                        {cfg.next && (
                          <button
                            type="button"
                            className="btn-quick-next"
                            onClick={() => handleAdvanceStatus(order, cfg.next)}
                            title={`Advance status to ${cfg.next}`}
                          >
                            Mark {cfg.next}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-view-details"
                          onClick={() => setSelectedOrder(order)}
                          title="View Order Details"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: ORDER DETAILS */}
      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-card modal-order-details">
            <div className="modal-header">
              <div>
                <h3>Order {selectedOrder.id} Details</h3>
                <span className="order-modal-sub">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </span>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body-content">
              {/* Status Update Quick Bar */}
              <div className="status-update-banner">
                <div className="current-status-display">
                  <span className="status-banner-lbl">Current Live Status:</span>
                  <span
                    className="order-status-chip-lg"
                    style={{
                      color:
                        ORDER_STATUS_CONFIG[selectedOrder.status]?.color ||
                        '#075437',
                      backgroundColor:
                        ORDER_STATUS_CONFIG[selectedOrder.status]?.bg ||
                        '#EFF8F4'
                    }}
                  >
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="status-change-dropdown-wrap">
                  <label className="dropdown-lbl">Change Status:</label>
                  <select
                    className="status-change-select"
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleAdvanceStatus(selectedOrder, e.target.value)
                    }
                  >
                    <option value="Placed">Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="order-details-grid">
                <div className="detail-box">
                  <h4 className="detail-box-title">
                    <User size={15} /> Customer Details
                  </h4>
                  <p className="detail-line">
                    <strong>Name:</strong> {selectedOrder.address?.name || '-'}
                  </p>
                  <p className="detail-line">
                    <strong>Phone:</strong> {selectedOrder.address?.phone || '-'}
                  </p>
                  <p className="detail-line">
                    <strong>Payment:</strong> {selectedOrder.paymentMethod} (
                    {selectedOrder.paymentStatus})
                  </p>
                </div>

                <div className="detail-box">
                  <h4 className="detail-box-title">
                    <MapPin size={15} /> Delivery Address
                  </h4>
                  <p className="detail-line">
                    {selectedOrder.address?.line1 || 'No line address'}
                  </p>
                  <p className="detail-line">
                    {selectedOrder.address?.area}, {selectedOrder.address?.city} -{' '}
                    {selectedOrder.address?.pincode}
                  </p>
                  <p className="detail-line">
                    <strong>Slot:</strong>{' '}
                    {selectedOrder.estimatedDelivery || 'Express'}
                  </p>
                </div>
              </div>

              {/* Order Items List */}
              <div className="order-items-section">
                <h4 className="items-heading">Ordered Meat & Seafood Cuts</h4>
                <div className="items-table-wrap">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Pack Size</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th className="th-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedOrder.items || []).map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="item-mini-cell">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="item-mini-thumb"
                                />
                              )}
                              <span className="item-name-txt">{item.name}</span>
                            </div>
                          </td>
                          <td>{item.weight || '500g'}</td>
                          <td>{item.quantity || 1}</td>
                          <td>₹{item.price}</td>
                          <td className="th-right">
                            ₹{(item.price || 0) * (item.quantity || 1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Price Breakdown */}
                <div className="order-summary-box">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.summary?.subtotal || selectedOrder.summary?.total}</span>
                  </div>
                  {selectedOrder.summary?.discount > 0 && (
                    <div className="summary-row discount-row">
                      <span>Discount</span>
                      <span>-₹{selectedOrder.summary?.discount}</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>
                      {selectedOrder.summary?.deliveryFee === 0
                        ? 'FREE'
                        : `₹${selectedOrder.summary?.deliveryFee || 0}`}
                    </span>
                  </div>
                  <div className="summary-row grand-total-row">
                    <span>Total Amount Paid</span>
                    <span>₹{selectedOrder.summary?.total || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .orders-manager-container {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .orders-top-bar {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .orders-search-box {
          position: relative;
          width: 100%;
          max-width: 450px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #A0AEC0;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px 8px 36px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.86rem;
          outline: none;
        }

        .search-input:focus {
          border-color: #075437;
        }

        .orders-status-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .order-tab-btn {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          background: #F7FAFC;
          color: #4A5568;
          border: 1px solid #E2E8F0;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .order-tab-btn.active {
          background: #075437;
          color: #FFFFFF;
          border-color: #075437;
        }

        /* Orders Table */
        .orders-table-wrapper {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow-x: auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .orders-table th {
          background: #F8FAFC;
          padding: 12px 16px;
          font-size: 0.76rem;
          font-weight: 800;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid #E2E8F0;
        }

        .orders-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #EDF2F7;
          vertical-align: middle;
        }

        .order-row:hover {
          background: #FDFEFE;
        }

        .order-id-tag {
          font-family: monospace;
          font-weight: 800;
          font-size: 0.88rem;
          color: #075437;
        }

        .time-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #718096;
        }

        .customer-cell {
          display: flex;
          flex-direction: column;
        }

        .cust-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #1A202C;
        }

        .cust-phone {
          font-size: 0.74rem;
          color: #718096;
        }

        .items-summary-badge {
          font-size: 0.76rem;
          background: #EDF2F7;
          color: #4A5568;
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 600;
        }

        .order-total-price {
          font-size: 0.92rem;
          font-weight: 800;
          color: #1A202C;
        }

        .payment-cell {
          display: flex;
          flex-direction: column;
        }

        .pay-method {
          font-size: 0.78rem;
          color: #4A5568;
        }

        .pay-status {
          font-size: 0.68rem;
          font-weight: 700;
        }

        .pay-status.paid { color: #276749; }
        .pay-status.pending { color: #C53030; }

        .order-status-chip {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 12px;
        }

        .th-right, .td-right {
          text-align: right;
        }

        .order-row-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .btn-quick-next {
          background: #075437;
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 5px 9px;
          border-radius: 6px;
          transition: background 0.12s ease;
        }

        .btn-quick-next:hover {
          background: #053D27;
        }

        .btn-view-details {
          padding: 6px;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
          background: #F7FAFC;
          color: #4A5568;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-view-details:hover {
          background: #EDF2F7;
        }

        .empty-orders-cell {
          text-align: center;
          padding: 40px !important;
          color: #718096;
        }

        /* Order Details Modal */
        .modal-order-details {
          max-width: 650px;
        }

        .order-modal-sub {
          font-size: 0.74rem;
          color: #718096;
        }

        .status-update-banner {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .current-status-display {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-banner-lbl {
          font-size: 0.8rem;
          font-weight: 600;
          color: #718096;
        }

        .order-status-chip-lg {
          font-size: 0.82rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 12px;
        }

        .status-change-dropdown-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dropdown-lbl {
          font-size: 0.78rem;
          font-weight: 700;
          color: #4A5568;
        }

        .status-change-select {
          padding: 6px 10px;
          border: 1.5px solid #075437;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #075437;
          background: #FFFFFF;
          outline: none;
        }

        .order-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 14px;
        }

        .detail-box {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 12px 14px;
        }

        .detail-box-title {
          font-size: 0.82rem;
          font-weight: 800;
          color: #1A202C;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid #EDF2F7;
        }

        .detail-line {
          font-size: 0.78rem;
          color: #4A5568;
          margin-bottom: 4px;
        }

        .order-items-section {
          margin-top: 16px;
        }

        .items-heading {
          font-size: 0.86rem;
          font-weight: 800;
          color: #1A202C;
          margin-bottom: 8px;
        }

        .items-table-wrap {
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow: hidden;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }

        .items-table th {
          background: #F8FAFC;
          padding: 8px 12px;
          font-size: 0.72rem;
          color: #718096;
          text-transform: uppercase;
        }

        .items-table td {
          padding: 10px 12px;
          border-top: 1px solid #EDF2F7;
        }

        .item-mini-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .item-mini-thumb {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          object-fit: cover;
        }

        .item-name-txt {
          font-weight: 600;
          color: #1A202C;
        }

        .order-summary-box {
          background: #F7FAFC;
          border-radius: 8px;
          padding: 12px 16px;
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.82rem;
          color: #4A5568;
        }

        .discount-row {
          color: #276749;
          font-weight: 600;
        }

        .grand-total-row {
          font-size: 0.95rem;
          font-weight: 800;
          color: #1A202C;
          padding-top: 6px;
          border-top: 1px solid #E2E8F0;
        }
      `}</style>
    </div>
  );
};
