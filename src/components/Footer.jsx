import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MessageSquare, ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import { BRAND_INFO } from '../data/products';

export const Footer = ({ navigate, onOpenWholesale }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="app-container">
        {/* Main Footer Grid */}
        <div className="footer-main-grid">
          {/* Brand Info Column */}
          <div className="footer-col brand-col">
            <div className="footer-logo-wrap" onClick={() => navigate('/')}>
              <Logo size="medium" />
            </div>
            <p className="footer-brand-bio">
              MadurFresh is dedicated to bringing farm-fresh, 100% antibiotic-free chicken,
              tender pasture-raised mutton, and day-catch cleaned seafood directly to your
              kitchen in Bangalore with uncompromised quality.
            </p>
            <div className="footer-trust-pill">
              <ShieldCheck size={16} color="var(--primary-green)" />
              <span>Chilled at 0-4°C | Never Frozen</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><button onClick={() => navigate('/')} className="footer-link">Home</button></li>
              <li><button onClick={() => navigate('/categories')} className="footer-link">All Categories</button></li>
              <li><button onClick={() => navigate('/offers')} className="footer-link">Special Offers</button></li>
              <li><button onClick={() => navigate('/wishlist')} className="footer-link">My Wishlist</button></li>
              <li><button onClick={() => navigate('/account')} className="footer-link">My Account</button></li>
              <li><button onClick={() => navigate('/orders')} className="footer-link">Track Orders</button></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-col-title">Categories</h4>
            <ul className="footer-links-list">
              <li>
                <button
                  onClick={() => navigate('/categories/chicken')}
                  className="footer-link"
                >
                  Fresh Chicken
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/categories/mutton')}
                  className="footer-link"
                >
                  Prime Mutton
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/categories/seafood')}
                  className="footer-link"
                >
                  Fresh Seafood
                </button>
              </li>
              <li>
                <button onClick={onOpenWholesale} className="footer-link wholesale-highlight">
                  Wholesale & Bulk Supply
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support & Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Customer Care</h4>
            <div className="footer-contact-list">
              <a
                href={`https://wa.me/${BRAND_INFO.whatsapp}?text=Hi%20MadurFresh,%20I%20have%20an%20enquiry.`}
                target="_blank"
                rel="noreferrer"
                className="footer-contact-item"
              >
                <div className="contact-icon-wrap whatsapp">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <span className="contact-label">WhatsApp Support</span>
                  <span className="contact-value">+91 98765 43210</span>
                </div>
              </a>

              <a href="tel:+919876543210" className="footer-contact-item">
                <div className="contact-icon-wrap phone">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="contact-label">Order Helpline</span>
                  <span className="contact-value">+91 98765 43210</span>
                </div>
              </a>

              <a href="mailto:care@madurfresh.in" className="footer-contact-item">
                <div className="contact-icon-wrap mail">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="contact-label">Email Support</span>
                  <span className="contact-value">care@madurfresh.in</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-legal-links">
            <span>© {new Date().getFullYear()} MadurFresh (Sindhusha G). All rights reserved.</span>
            <span className="legal-dot">•</span>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: MadurFresh guarantees 100% data confidentiality and never shares customer contact information with third parties.'); }}>Privacy Policy</a>
            <span className="legal-dot">•</span>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service: Fresh meat cuts are dispatched daily under strict food safety guidelines.'); }}>Terms & Conditions</a>
            <span className="legal-dot">•</span>
            <a href="#refund" onClick={(e) => { e.preventDefault(); alert('Refund Policy: 100% replacement or instant refund if any quality issue is reported within 2 hours of delivery.'); }}>Refund Policy</a>
            <span className="legal-dot">•</span>
            <a href="#shipping" onClick={(e) => { e.preventDefault(); alert('Delivery Policy: 90-min express delivery in temperature-controlled insulated cold-packs.'); }}>Delivery Policy</a>
          </div>

          <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .site-footer {
          background-color: #FFFFFF;
          border-top: 1px solid var(--border-color);
          padding-top: 48px;
          padding-bottom: 24px;
          margin-top: 48px;
        }

        .footer-main-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
          gap: 36px;
          margin-bottom: 36px;
        }

        .footer-logo-wrap {
          cursor: pointer;
          margin-bottom: 14px;
        }

        .footer-brand-bio {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin-bottom: 16px;
          max-width: 320px;
        }

        .footer-trust-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--surface-light-green);
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary-green);
        }

        .footer-col-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--primary-green);
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }

        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-link {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
          text-align: left;
          transition: color var(--transition-fast);
        }

        .footer-link:hover {
          color: var(--primary-green);
          font-weight: 700;
        }

        .wholesale-highlight {
          color: var(--primary-green);
          font-weight: 700;
        }

        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          transition: transform var(--transition-fast);
        }

        .footer-contact-item:hover {
          transform: translateX(3px);
        }

        .contact-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contact-icon-wrap.whatsapp {
          background-color: #E8F8EE;
          color: #25D366;
        }

        .contact-icon-wrap.phone {
          background-color: var(--surface-light-green);
          color: var(--primary-green);
        }

        .contact-icon-wrap.mail {
          background-color: var(--primary-yellow-light);
          color: var(--text-dark);
        }

        .contact-label {
          display: block;
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .contact-value {
          display: block;
          font-size: 0.85rem;
          color: var(--text-dark);
          font-weight: 700;
        }

        .footer-bottom-bar {
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-legal-links {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .legal-dot {
          color: var(--border-color);
        }

        .footer-legal-links a:hover {
          color: var(--primary-green);
          text-decoration: underline;
        }

        .scroll-top-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-green);
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          background: var(--surface-light-green);
          transition: all var(--transition-fast);
        }

        .scroll-top-btn:hover {
          background: #E1EDDC;
        }

        @media (max-width: 900px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .brand-col {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 600px) {
          .footer-main-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .site-footer {
            padding-top: 32px;
            padding-bottom: 20px;
          }
          .footer-bottom-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
};
