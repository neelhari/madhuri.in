import React from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  Sparkles,
  HelpCircle,
  FileText,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Phone,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { BRAND_INFO } from '../data/products';
import { useLocation } from '../context/LocationContext';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';

export const AccountPage = ({ navigate, onOpenWholesale }) => {
  const { currentLocation, setIsLocationModalOpen } = useLocation();
  const { orders } = useOrders();
  const { wishlistCount } = useWishlist();

  const handleSupportWhatsApp = () => {
    window.open(
      `https://wa.me/${BRAND_INFO.whatsapp}?text=Hi%20MadurFresh%20Support,%20I%20need%20assistance.`,
      '_blank'
    );
  };

  return (
    <div className="account-page animate-fade-in">
      <div className="app-container">
        <h1 className="account-page-title">My Account</h1>

        <div className="account-layout-grid">
          {/* User Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar-wrap">
              <User size={34} color="var(--primary-green)" />
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{BRAND_INFO.owner}</h3>
              <span className="profile-phone">{BRAND_INFO.phone}</span>
              <span className="profile-email">{BRAND_INFO.email}</span>
            </div>
            <span className="membership-badge">MadurFresh Member</span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="account-metrics-bar">
            <div className="metric-item" onClick={() => navigate('/orders')}>
              <span className="metric-num">{orders.length}</span>
              <span className="metric-lbl">Total Orders</span>
            </div>
            <div className="metric-item" onClick={() => navigate('/wishlist')}>
              <span className="metric-num">{wishlistCount}</span>
              <span className="metric-lbl">Wishlist</span>
            </div>
            <div className="metric-item" onClick={() => setIsLocationModalOpen(true)}>
              <span className="metric-num">1</span>
              <span className="metric-lbl">Saved Address</span>
            </div>
          </div>

          {/* Clean List Menu */}
          <div className="account-menu-card">
            <div className="menu-group-title">Orders & Saved Items</div>

            <div className="menu-item" onClick={() => navigate('/orders')}>
              <div className="menu-item-left">
                <Package size={20} color="var(--primary-green)" />
                <span>My Orders & Live Tracking</span>
              </div>
              <ChevronRight size={18} className="menu-chevron" />
            </div>

            <div className="menu-item" onClick={() => navigate('/wishlist')}>
              <div className="menu-item-left">
                <Heart size={20} color="var(--primary-green)" />
                <span>Wishlist</span>
              </div>
              <div className="menu-item-right">
                {wishlistCount > 0 && (
                  <span className="menu-badge">{wishlistCount}</span>
                )}
                <ChevronRight size={18} className="menu-chevron" />
              </div>
            </div>

            <div className="menu-item" onClick={() => setIsLocationModalOpen(true)}>
              <div className="menu-item-left">
                <MapPin size={20} color="var(--primary-green)" />
                <span>Delivery Address ({currentLocation.area})</span>
              </div>
              <ChevronRight size={18} className="menu-chevron" />
            </div>

            <div className="menu-divider" />
            <div className="menu-group-title">Store Administration</div>

            <div className="menu-item admin-portal-btn" onClick={() => navigate('/admin')}>
              <div className="menu-item-left">
                <ShieldCheck size={20} color="#075437" />
                <span><strong>Store Admin Dashboard</strong></span>
              </div>
              <span className="badge badge-admin">Manage Store</span>
            </div>

            <div className="menu-divider" />
            <div className="menu-group-title">Business & Support</div>

            <div className="menu-item" onClick={onOpenWholesale}>
              <div className="menu-item-left">
                <Sparkles size={20} color="var(--primary-yellow)" />
                <span>Wholesale & Bulk Enquiries</span>
              </div>
              <span className="badge badge-yellow">B2B</span>
            </div>

            <div className="menu-item" onClick={handleSupportWhatsApp}>
              <div className="menu-item-left">
                <MessageSquare size={20} color="#25D366" />
                <span>WhatsApp Customer Support</span>
              </div>
              <ChevronRight size={18} className="menu-chevron" />
            </div>

            <a href="tel:+919876543210" className="menu-item">
              <div className="menu-item-left">
                <Phone size={20} color="var(--primary-green)" />
                <span>Call Helpline (+91 98765 43210)</span>
              </div>
              <ChevronRight size={18} className="menu-chevron" />
            </a>

            <div className="menu-divider" />
            <div className="menu-group-title">Legal & Information</div>

            <div
              className="menu-item"
              onClick={() =>
                alert(
                  'Privacy Policy: MadurFresh guarantees 100% data confidentiality and never shares customer information.'
                )
              }
            >
              <div className="menu-item-left">
                <ShieldCheck size={20} color="var(--text-muted)" />
                <span>Privacy Policy</span>
              </div>
              <ChevronRight size={18} className="menu-chevron" />
            </div>

            <div
              className="menu-item"
              onClick={() =>
                alert(
                  'Terms & Conditions: All products are freshly prepared to order and delivered in cold-chain packs.'
                )
              }
            >
              <div className="menu-item-left">
                <FileText size={20} color="var(--text-muted)" />
                <span>Terms of Service</span>
              </div>
              <ChevronRight size={18} className="menu-chevron" />
            </div>

            <div className="menu-divider" />

            <div
              className="menu-item logout-item"
              onClick={() => alert('Logged out successfully.')}
            >
              <div className="menu-item-left">
                <LogOut size={20} color="#E53935" />
                <span style={{ color: '#E53935' }}>Log Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .account-page {
          padding-top: 18px;
          padding-bottom: 48px;
        }

        .account-page-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary-green);
          margin-top: 8px;
          margin-bottom: 20px;
        }

        .account-layout-grid {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .profile-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          box-shadow: var(--shadow-xs);
        }

        .profile-avatar-wrap {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--surface-light-green);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
        }

        .profile-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-dark);
        }

        .profile-phone {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .profile-email {
          font-size: 0.78rem;
          color: var(--primary-green);
          font-weight: 600;
        }

        .membership-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 0.68rem;
          font-weight: 800;
          background: var(--primary-yellow-light);
          color: var(--text-dark);
          padding: 3px 8px;
          border-radius: var(--radius-pill);
        }

        .account-metrics-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 14px 0;
        }

        .metric-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          border-right: 1px solid var(--border-light);
        }

        .metric-item:last-child {
          border-right: none;
        }

        .metric-num {
          font-size: 1.35rem;
          font-weight: 900;
          color: var(--primary-green);
        }

        .metric-lbl {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .account-menu-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: 18px 20px;
          box-shadow: var(--shadow-xs);
        }

        .menu-group-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 8px;
          margin-top: 6px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 0;
          border-bottom: 1px solid var(--border-light);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .menu-item:hover {
          padding-left: 4px;
        }

        .menu-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .menu-item-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .badge-admin {
          background: #EFF8F4;
          color: #075437;
          border: 1px solid #075437;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
        }

        .admin-portal-btn:hover {
          background: #EFF8F4;
        }

        .badge-yellow {
          background: #FEF3C7;
          color: #92400E;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
        }

        .menu-chevron {
          color: var(--text-muted);
        }

        .menu-divider {
          height: 1px;
          background: var(--border-color);
          margin: 12px 0;
        }
      `}</style>
    </div>
  );
};
