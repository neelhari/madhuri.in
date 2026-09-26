import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingBag,
  Package,
  Boxes,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Store,
  DollarSign,
  Plus
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useOrders } from '../../context/OrderContext';

export const OverviewDashboard = ({ onNavigateTab, navigate }) => {
  const { products, categories, inventory, heroBanners, storeSettings } = useStoreData();
  const { orders } = useOrders();

  const totalProducts = (products || []).length;
  const totalCategories = (categories || []).length;
  const totalOrders = (orders || []).length;

  // Pending & active orders
  const pendingOrders = (orders || []).filter(
    (o) => o.status === 'Pending' || o.status === 'Order Placed' || o.status === 'Processing' || o.status === 'Preparing'
  );
  const deliveredOrders = (orders || []).filter((o) => o.status === 'Delivered');

  // Revenue calculation
  const totalRevenue = (orders || [])
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.summary?.total || o.total || 0), 0);

  // Low stock calculation
  const lowStockItems = Object.entries(inventory || {}).filter(([key, val]) => {
    return val && val.stockCount > 0 && val.stockCount <= 10;
  });

  const outOfStockItems = Object.entries(inventory || {}).filter(([key, val]) => {
    return val && val.stockCount === 0;
  });

  const recentOrders = (orders || []).slice(0, 6);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'badge-success';
      case 'Processing':
      case 'Preparing': return 'badge-info';
      case 'Out for Delivery': return 'badge-warning';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-pending';
    }
  };

  return (
    <div className="overview-dashboard animate-fade-in">
      {/* 1. Header with Welcome & Quick Action */}
      <div className="dashboard-header-bar">
        <div>
          <h1 className="dashboard-heading">Store Overview</h1>
          <p className="dashboard-subheading">
            Live business summary, active orders, catalog health & quick shortcuts.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm preview-store-btn"
            onClick={() => navigate('/')}
          >
            <span>View Live Store</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Stats Cards */}
      <div className="metrics-grid">
        {/* Total Revenue */}
        <div className="metric-card metric-revenue">
          <div className="metric-icon-wrap bg-green-light">
            <TrendingUp size={22} className="text-green" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Revenue</span>
            <h2 className="metric-value">₹{totalRevenue.toLocaleString('en-IN')}</h2>
            <span className="metric-footer-text">From {totalOrders} placed orders</span>
          </div>
        </div>

        {/* Active Orders */}
        <div
          className="metric-card metric-orders clickable"
          onClick={() => onNavigateTab('orders')}
          role="button"
          tabIndex={0}
        >
          <div className="metric-icon-wrap bg-yellow-light">
            <ShoppingBag size={22} className="text-yellow" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Pending / Active Orders</span>
            <h2 className="metric-value">{pendingOrders.length}</h2>
            <span className="metric-footer-action">
              Manage Orders <ArrowRight size={12} />
            </span>
          </div>
        </div>

        {/* Total Products */}
        <div
          className="metric-card metric-products clickable"
          onClick={() => onNavigateTab('products')}
          role="button"
          tabIndex={0}
        >
          <div className="metric-icon-wrap bg-blue-light">
            <Package size={22} className="text-blue" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Active Catalog Cuts</span>
            <h2 className="metric-value">{totalProducts}</h2>
            <span className="metric-footer-text">{totalCategories} categories</span>
          </div>
        </div>

        {/* Inventory Stock Alerts */}
        <div
          className={`metric-card metric-inventory clickable ${lowStockItems.length > 0 || outOfStockItems.length > 0 ? 'metric-alert' : ''}`}
          onClick={() => onNavigateTab('inventory')}
          role="button"
          tabIndex={0}
        >
          <div className="metric-icon-wrap bg-red-light">
            <AlertTriangle size={22} className="text-red" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Stock Status</span>
            <h2 className="metric-value">
              {outOfStockItems.length > 0 ? `${outOfStockItems.length} Out of Stock` : `${lowStockItems.length} Low Stock`}
            </h2>
            <span className="metric-footer-action">
              View Inventory <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Shortcuts Strip */}
      <div className="quick-actions-card">
        <h3 className="section-card-title">Quick Actions</h3>
        <div className="quick-actions-buttons">
          <button
            type="button"
            className="action-pill-btn"
            onClick={() => onNavigateTab('banners')}
          >
            <Sparkles size={16} />
            <span>Manage Hero & Banners</span>
          </button>

          <button
            type="button"
            className="action-pill-btn"
            onClick={() => onNavigateTab('products')}
          >
            <Plus size={16} />
            <span>Add / Edit Products</span>
          </button>

          <button
            type="button"
            className="action-pill-btn"
            onClick={() => onNavigateTab('orders')}
          >
            <ShoppingBag size={16} />
            <span>View All Orders</span>
          </button>

          <button
            type="button"
            className="action-pill-btn"
            onClick={() => onNavigateTab('inventory')}
          >
            <Boxes size={16} />
            <span>Update Live Stock</span>
          </button>

          <button
            type="button"
            className="action-pill-btn"
            onClick={() => onNavigateTab('settings')}
          >
            <Store size={16} />
            <span>Store Timings & Settings</span>
          </button>
        </div>
      </div>

      {/* 4. Split Dashboard Grid: Recent Orders & Catalog Highlights */}
      <div className="dashboard-split-grid">
        {/* Left: Recent Orders */}
        <div className="dashboard-card recent-orders-card">
          <div className="card-header-between">
            <h3 className="section-card-title">Recent Orders</h3>
            <button
              type="button"
              className="view-all-link"
              onClick={() => onNavigateTab('orders')}
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="empty-state-box">
              <ShoppingBag size={36} color="var(--text-muted)" />
              <p>No orders placed yet. Orders will appear here in real-time.</p>
            </div>
          ) : (
            <div className="orders-table-wrapper">
              <table className="overview-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} onClick={() => onNavigateTab('orders')}>
                      <td className="order-id-cell">#{order.id.slice(-6).toUpperCase()}</td>
                      <td>{order.address?.name || 'Customer'}</td>
                      <td>{order.items?.length || 1} cuts</td>
                      <td className="order-price-cell">₹{order.summary?.total || order.total || 0}</td>
                      <td>
                        <span className={`status-pill ${getStatusBadgeClass(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Quick Store & Category Breakdown */}
        <div className="dashboard-card store-health-card">
          <h3 className="section-card-title">Active Categories</h3>
          <div className="categories-breakdown-list">
            {categories.map((cat) => {
              const catProducts = (products || []).filter((p) => p.category === cat.id);
              return (
                <div
                  key={cat.id}
                  className="cat-breakdown-item"
                  onClick={() => onNavigateTab('categories')}
                >
                  <div className="cat-item-left">
                    <img src={cat.image} alt="" className="cat-thumb" />
                    <div>
                      <h4 className="cat-name">{cat.name}</h4>
                      <span className="cat-count">{catProducts.length} items available</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="cat-chevron" />
                </div>
              );
            })}
          </div>

          <div className="banner-preview-box" onClick={() => onNavigateTab('banners')}>
            <div className="banner-preview-info">
              <span className="banner-badge">Active Hero Banner</span>
              <p className="banner-title-preview">{heroBanners?.[0]?.title || 'Farm Fresh Chicken'}</p>
            </div>
            <button type="button" className="btn btn-sm btn-yellow">
              Edit Banners
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .overview-dashboard {
          padding: 24px;
        }

        .dashboard-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .dashboard-heading {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--deep-forest-green);
          letter-spacing: -0.02em;
        }

        .dashboard-subheading {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .preview-store-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-pill);
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 1200px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }

        .metric-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          box-shadow: var(--shadow-xs);
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }

        .metric-card.clickable {
          cursor: pointer;
        }

        .metric-card.clickable:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--deep-forest-green);
        }

        .metric-card.metric-alert {
          border-color: #FCA5A5;
          background: #FFFBFB;
        }

        .metric-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bg-green-light { background: #ECFDF5; }
        .text-green { color: #059669; }

        .bg-yellow-light { background: #FEF3C7; }
        .text-yellow { color: #D97706; }

        .bg-blue-light { background: #EFF6FF; }
        .text-blue { color: #2563EB; }

        .bg-red-light { background: #FEF2F2; }
        .text-red { color: #DC2626; }

        .metric-info {
          display: flex;
          flex-direction: column;
        }

        .metric-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .metric-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--charcoal);
          line-height: 1.2;
          margin: 4px 0 2px 0;
        }

        .metric-footer-text {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .metric-footer-action {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--deep-forest-green);
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        /* Quick Actions Card */
        .quick-actions-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 18px 22px;
          margin-bottom: 24px;
        }

        .section-card-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--charcoal);
          margin-bottom: 14px;
        }

        .quick-actions-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .action-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--surface-ivory);
          border: 1px solid var(--border-color);
          padding: 9px 16px;
          border-radius: var(--radius-pill);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--charcoal);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .action-pill-btn:hover {
          background: var(--deep-forest-green);
          color: #FFFFFF;
          border-color: var(--deep-forest-green);
          transform: translateY(-1px);
        }

        /* Split Grid */
        .dashboard-split-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .dashboard-split-grid {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 22px;
        }

        .card-header-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .view-all-link {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--deep-forest-green);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          background: none;
          border: none;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        .orders-table-wrapper {
          overflow-x: auto;
        }

        .overview-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .overview-table th {
          text-align: left;
          padding: 10px 12px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-color);
        }

        .overview-table td {
          padding: 12px;
          border-bottom: 1px solid var(--border-light);
          color: var(--charcoal);
        }

        .overview-table tr {
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .overview-table tr:hover td {
          background: var(--surface-soft);
        }

        .order-id-cell {
          font-weight: 800;
          color: var(--deep-forest-green);
        }

        .order-price-cell {
          font-weight: 800;
        }

        .status-pill {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
        }

        .badge-success { background: #DCFCE7; color: #166534; }
        .badge-info { background: #DBEAFE; color: #1E40AF; }
        .badge-warning { background: #FEF3C7; color: #92400E; }
        .badge-danger { background: #FEE2E2; color: #991B1B; }
        .badge-pending { background: #F3F4F6; color: #374151; }

        .empty-state-box {
          text-align: center;
          padding: 36px 16px;
          color: var(--text-muted);
          font-size: 0.88rem;
        }

        /* Categories Breakdown */
        .categories-breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 18px;
        }

        .cat-breakdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: var(--surface-ivory);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .cat-breakdown-item:hover {
          background: #FFFFFF;
          border-color: var(--deep-forest-green);
          transform: translateX(2px);
        }

        .cat-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cat-thumb {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .cat-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--charcoal);
        }

        .cat-count {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .cat-chevron {
          color: var(--text-muted);
        }

        .banner-preview-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: linear-gradient(135deg, #053D27 0%, #075437 100%);
          color: #FFFFFF;
          border-radius: var(--radius-md);
          cursor: pointer;
        }

        .banner-badge {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--brand-yellow);
          text-transform: uppercase;
        }

        .banner-title-preview {
          font-size: 0.95rem;
          font-weight: 800;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};

export default OverviewDashboard;
