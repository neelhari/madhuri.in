import React, { useState } from 'react';
import {
  Image,
  FolderTree,
  Package,
  Boxes,
  ShoppingBag,
  Users,
  TicketPercent,
  Settings,
  ExternalLink,
  Store,
  Clock,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';

export const ADMIN_TABS = [
  { id: 'banners', label: 'Banners', icon: Image, description: 'Home & category banner visuals' },
  { id: 'categories', label: 'Categories', icon: FolderTree, description: 'Meat & seafood categories' },
  { id: 'products', label: 'Products', icon: Package, description: 'Catalog, pricing & weights' },
  { id: 'inventory', label: 'Inventory', icon: Boxes, description: 'Live stock & low stock alerts' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, description: 'Order pipeline & delivery status' },
  { id: 'customers', label: 'Customers', icon: Users, description: 'Customer database & orders' },
  { id: 'coupons', label: 'Coupons', icon: TicketPercent, description: 'Discount codes & promo rules' },
  { id: 'settings', label: 'Store Settings', icon: Settings, description: 'Hours, delivery fees & WhatsApp' }
];

export const AdminLayout = ({ activeTab, onTabChange, navigate, children }) => {
  const { storeSettings, updateSettings, inventory, products } = useStoreData();
  const { orders } = useOrders();
  const { logoutAdmin, adminUser } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Count active pending orders
  const pendingOrdersCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  // Count low stock items (< 10 units)
  const lowStockCount = Object.values(inventory).filter(
    (item) => item.stockCount > 0 && item.stockCount <= 10
  ).length;

  const currentTabObj = ADMIN_TABS.find((t) => t.id === activeTab) || ADMIN_TABS[0];

  return (
    <div className="admin-app-wrapper">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`admin-sidebar ${isMobileNavOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand" onClick={() => navigate('/')}>
            <div className="brand-badge-pill">ADMIN</div>
            <div className="brand-titles">
              <span className="brand-main-text">Madhur Fresh</span>
              <span className="brand-sub-text">Store Management</span>
            </div>
          </div>
          <button
            className="mobile-close-btn"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="sidebar-nav">
          <div className="nav-group-heading">MAIN MENU</div>
          {ADMIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onTabChange(tab.id);
                  setIsMobileNavOpen(false);
                }}
              >
                <div className="nav-btn-left">
                  <Icon size={19} className="nav-icon" />
                  <span className="nav-btn-label">{tab.label}</span>
                </div>
                {tab.id === 'orders' && pendingOrdersCount > 0 && (
                  <span className="nav-pill-badge badge-warning">
                    {pendingOrdersCount}
                  </span>
                )}
                {tab.id === 'inventory' && lowStockCount > 0 && (
                  <span className="nav-pill-badge badge-danger">
                    {lowStockCount}
                  </span>
                )}
                {isActive && <ChevronRight size={16} className="nav-active-arrow" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Link to Store & Logout */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="view-store-link-btn"
            onClick={() => navigate('/')}
          >
            <ExternalLink size={16} />
            <span>View Live Website</span>
          </button>

          <button
            type="button"
            className="logout-admin-btn"
            onClick={() => {
              logoutAdmin();
              navigate('/');
            }}
            title="Log out of admin session"
          >
            <LogOut size={15} color="#C53030" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* BACKDROP FOR MOBILE */}
      {isMobileNavOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="admin-main-container">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="topbar-menu-btn"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <div className="topbar-title-wrap">
              <h1 className="topbar-page-title">{currentTabObj.label}</h1>
              <p className="topbar-page-subtitle">{currentTabObj.description}</p>
            </div>
          </div>

          <div className="topbar-right">
            {lowStockCount > 0 && (
              <button
                className="topbar-alert-chip"
                onClick={() => onTabChange('inventory')}
                title="Low stock items alert"
              >
                <AlertCircle size={15} color="#D32F2F" />
                <span>{lowStockCount} Low Stock</span>
              </button>
            )}

            <button
              type="button"
              className="topbar-storefront-btn"
              onClick={() => navigate('/')}
            >
              <Store size={16} />
              <span className="btn-text-desktop">Go to Storefront</span>
            </button>

            <button
              type="button"
              className="topbar-logout-btn"
              onClick={() => {
                logoutAdmin();
                navigate('/');
              }}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Active Tab Screen Content */}
        <main className="admin-content-body">{children}</main>
      </div>

      <style>{`
        .admin-app-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: #F8F9FA;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1A202C;
        }

        /* SIDEBAR STYLES */
        .admin-sidebar {
          width: 270px;
          background: #FFFFFF;
          border-right: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 1200;
          transition: transform 0.25s ease;
        }

        .sidebar-header {
          padding: 20px 18px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #EDF2F7;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .brand-badge-pill {
          background: #075437;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 3px 7px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .brand-titles {
          display: flex;
          flex-direction: column;
        }

        .brand-main-text {
          font-size: 1.05rem;
          font-weight: 800;
          color: #075437;
          line-height: 1.2;
        }

        .brand-sub-text {
          font-size: 0.72rem;
          color: #718096;
          font-weight: 600;
        }

        .mobile-close-btn {
          display: none;
          color: #718096;
          padding: 4px;
        }

        /* Quick Store Status Card */
        .store-status-card {
          margin: 16px 14px 10px;
          padding: 12px 14px;
          background: #F7FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .status-indicator-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-pulse-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .status-pulse-dot.online {
          background-color: #38A169;
          box-shadow: 0 0 0 3px rgba(56, 161, 105, 0.2);
        }

        .status-pulse-dot.offline {
          background-color: #E53E3E;
          box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.2);
        }

        .status-label {
          font-size: 0.76rem;
          color: #4A5568;
        }

        .status-toggle-btn {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 9px;
          border-radius: 6px;
          border: 1px solid;
          transition: all 0.15s ease;
        }

        .btn-toggle-open {
          background: #FFFFFF;
          color: #C53030;
          border-color: #FEB2B2;
        }

        .btn-toggle-open:hover {
          background: #FFF5F5;
        }

        .btn-toggle-closed {
          background: #075437;
          color: #FFFFFF;
          border-color: #075437;
        }

        /* Sidebar Nav */
        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-group-heading {
          font-size: 0.65rem;
          font-weight: 800;
          color: #A0AEC0;
          letter-spacing: 0.08em;
          padding: 8px 10px 4px;
        }

        .sidebar-nav-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #4A5568;
          transition: all 0.15s ease;
          text-align: left;
        }

        .sidebar-nav-btn:hover {
          background-color: #EDF2F7;
          color: #1A202C;
        }

        .sidebar-nav-btn.active {
          background-color: #EFF8F4;
          color: #075437;
          font-weight: 700;
        }

        .nav-btn-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-icon {
          color: inherit;
        }

        .nav-active-arrow {
          color: #075437;
        }

        .nav-pill-badge {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 12px;
        }

        .badge-warning {
          background-color: #FFDA55;
          color: #1A202C;
        }

        .badge-danger {
          background-color: #FED7D7;
          color: #9B2C2C;
        }

        /* Sidebar Footer */
        .sidebar-footer {
          padding: 14px 14px;
          border-top: 1px solid #EDF2F7;
        }

        .view-store-link-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 9px 12px;
          background: #F7FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #075437;
          transition: all 0.15s ease;
        }

        .view-store-link-btn:hover {
          background: #075437;
          color: #FFFFFF;
          border-color: #075437;
        }

        .logout-admin-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          margin-top: 8px;
          padding: 8px 12px;
          background: #FFF5F5;
          border: 1px solid #FEB2B2;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #C53030;
          transition: all 0.15s ease;
        }

        .logout-admin-btn:hover {
          background: #FED7D7;
        }

        .topbar-logout-btn {
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          background: #FFF5F5;
          color: #C53030;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .topbar-logout-btn:hover {
          background: #FED7D7;
        }

        /* MAIN CONTAINER */
        .admin-main-container {
          flex: 1;
          margin-left: 270px;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* Topbar */
        .admin-topbar {
          background: #FFFFFF;
          height: 64px;
          padding: 0 24px;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .topbar-menu-btn {
          display: none;
          color: #4A5568;
          padding: 4px;
        }

        .topbar-title-wrap {
          display: flex;
          flex-direction: column;
        }

        .topbar-page-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #1A202C;
          line-height: 1.2;
        }

        .topbar-page-subtitle {
          font-size: 0.75rem;
          color: #718096;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .topbar-alert-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FFF5F5;
          border: 1px solid #FEB2B2;
          color: #C53030;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .topbar-storefront-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #075437;
          color: #FFFFFF;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          transition: background 0.15s ease;
        }

        .topbar-storefront-btn:hover {
          background: #053D27;
        }

        /* Content Body */
        .admin-content-body {
          padding: 24px;
          flex: 1;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }

          .admin-sidebar.mobile-open {
            transform: translateX(0);
          }

          .mobile-close-btn {
            display: block;
          }

          .admin-main-container {
            margin-left: 0;
          }

          .topbar-menu-btn {
            display: block;
          }

          .admin-content-body {
            padding: 16px;
          }

          .btn-text-desktop {
            display: none;
          }

          .admin-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            z-index: 1100;
          }
        }
      `}</style>
    </div>
  );
};
