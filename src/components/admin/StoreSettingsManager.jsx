import React, { useState } from 'react';
import {
  Settings,
  Save,
  Store,
  Phone,
  MessageSquare,
  Mail,
  Truck,
  Clock,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';

export const StoreSettingsManager = () => {
  const { storeSettings, updateSettings } = useStoreData();
  const [formData, setFormData] = useState({ ...storeSettings });
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings({
      ...formData,
      deliveryFee: parseInt(formData.deliveryFee, 10) || 0,
      freeDeliveryThreshold:
        parseInt(formData.freeDeliveryThreshold, 10) || 0,
      minimumOrderAmount: parseInt(formData.minimumOrderAmount, 10) || 0
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="store-settings-container">
      {showSavedToast && (
        <div className="save-toast-banner">
          <CheckCircle2 size={18} color="#075437" />
          <span>Store settings saved successfully and updated live on the website!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Section 1: Store Identity */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Store size={18} color="#075437" />
            <h3>Store Brand & Identity</h3>
          </div>

          <div className="settings-card-body">
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Store Brand Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name || 'MadhurFresh'}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.tagline || 'The Quality Choice'}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Store In-Charge / Owner</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.owner || 'Sindhusha G'}
                  onChange={(e) => handleChange('owner', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Store Operational Status</label>
                <div className="status-toggle-wrap">
                  <button
                    type="button"
                    className={`status-btn ${formData.isOpen ? 'open' : ''}`}
                    onClick={() => handleChange('isOpen', true)}
                  >
                    Open & Accepting Orders
                  </button>
                  <button
                    type="button"
                    className={`status-btn ${!formData.isOpen ? 'closed' : ''}`}
                    onClick={() => handleChange('isOpen', false)}
                  >
                    Store Temporarily Paused
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Support */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Phone size={18} color="#075437" />
            <h3>Customer Support & Contact Info</h3>
          </div>

          <div className="settings-card-body">
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Calling Helpline</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phone || '+91 98765 43210'}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Support (No + / spaces)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.whatsapp || '919876543210'}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="919876543210"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Support Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email || 'care@madurfresh.in'}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="care@madurfresh.in"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Delivery Fees & Minimum Order */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Truck size={18} color="#075437" />
            <h3>Delivery Fees & Ordering Limits</h3>
          </div>

          <div className="settings-card-body">
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Standard Delivery Charge (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.deliveryFee}
                  onChange={(e) => handleChange('deliveryFee', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Free Delivery Threshold (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.freeDeliveryThreshold}
                  onChange={(e) =>
                    handleChange('freeDeliveryThreshold', e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.minimumOrderAmount || 149}
                  onChange={(e) =>
                    handleChange('minimumOrderAmount', e.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-grid-2" style={{ marginTop: '12px' }}>
              <div className="form-group">
                <label className="form-label">Delivery Speed / Estimate</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.deliveryTime || 'Express (45-60 mins)'}
                  onChange={(e) =>
                    handleChange('deliveryTime', e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Operating Hours</label>
                <div className="hours-row">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.openingTime || '06:30 AM'}
                    onChange={(e) =>
                      handleChange('openingTime', e.target.value)
                    }
                    placeholder="06:30 AM"
                  />
                  <span>to</span>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.closingTime || '10:00 PM'}
                    onChange={(e) =>
                      handleChange('closingTime', e.target.value)
                    }
                    placeholder="10:00 PM"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Announcement Bar */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Bell size={18} color="#075437" />
            <h3>Homepage Announcement Banner</h3>
          </div>

          <div className="settings-card-body">
            <div className="form-group">
              <label className="form-label">Announcement Text</label>
              <input
                type="text"
                className="form-input"
                value={
                  formData.announcementText ||
                  '⚡ Fast 45-min delivery across Bangalore'
                }
                onChange={(e) =>
                  handleChange('announcementText', e.target.value)
                }
                placeholder="e.g. ⚡ Fast 45-min delivery across Bangalore"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="settings-submit-bar">
          <button type="submit" className="action-btn-primary btn-save-settings">
            <Save size={16} />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>

      <style>{`
        .store-settings-container {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .save-toast-banner {
          background: #DEF7EC;
          border: 1px solid #31C48D;
          color: #03543F;
          padding: 12px 18px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          animation: fadeIn 0.2s ease;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .settings-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .settings-card-header {
          padding: 14px 20px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .settings-card-header h3 {
          font-size: 0.95rem;
          font-weight: 800;
          color: #1A202C;
        }

        .settings-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #2D3748;
        }

        .form-input {
          padding: 10px 14px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
        }

        .form-input:focus {
          border-color: #075437;
          box-shadow: 0 0 0 2px rgba(7,84,55,0.1);
        }

        .status-toggle-wrap {
          display: flex;
          gap: 6px;
        }

        .status-btn {
          flex: 1;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          border: 1px solid #E2E8F0;
          background: #F7FAFC;
          color: #718096;
          transition: all 0.15s ease;
        }

        .status-btn.open {
          background: #DEF7EC;
          border-color: #31C48D;
          color: #03543F;
        }

        .status-btn.closed {
          background: #FEE2E2;
          border-color: #F87171;
          color: #991B1B;
        }

        .hours-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hours-row span {
          font-size: 0.8rem;
          color: #718096;
        }

        .settings-submit-bar {
          display: flex;
          justify-content: flex-end;
          padding: 10px 0;
        }

        .btn-save-settings {
          padding: 12px 24px;
          font-size: 0.92rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #075437;
          color: #FFFFFF;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-save-settings:hover {
          background: #053D27;
        }

        @media (max-width: 650px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
