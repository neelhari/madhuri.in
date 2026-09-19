import React, { useState } from 'react';
import { X, MessageSquare, PhoneCall, Sparkles, CheckCircle2 } from 'lucide-react';
import { BRAND_INFO } from '../data/products';
import { useToast } from '../context/ToastContext';

export const WholesaleModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    category: 'chicken',
    quantity: '25kg - 50kg',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Hi MadurFresh! I would like to enquire about wholesale meat/seafood pricing.\n\n` +
      `Name: ${formData.name || 'Business Partner'}\n` +
      `Business: ${formData.businessName || 'N/A'}\n` +
      `Phone: ${formData.phone || 'N/A'}\n` +
      `Requirement: ${formData.category.toUpperCase()} (${formData.quantity})\n` +
      `Notes: ${formData.notes || 'Looking for daily supply and wholesale quotes.'}`
    );
    window.open(`https://wa.me/${BRAND_INFO.whatsapp}?text=${text}`, '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Please provide your name and phone number', 'warning');
      return;
    }
    setSubmitted(true);
    showToast('Wholesale enquiry submitted! Our B2B team will contact you.', 'success');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content wholesale-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="wholesale-success-view">
            <CheckCircle2 size={54} color="var(--primary-green)" />
            <h3 className="success-title">Enquiry Received!</h3>
            <p className="success-desc">
              Thank you, <strong>{formData.name}</strong>. Our wholesale manager will reach out to{' '}
              <strong>{formData.phone}</strong> within 2 business hours with custom B2B pricing.
            </p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={handleWhatsAppChat}>
                <MessageSquare size={16} />
                Connect Instantly on WhatsApp
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="wholesale-modal-header">
              <div className="wholesale-badge">
                <Sparkles size={14} />
                <span>B2B & Bulk Supply</span>
              </div>
              <h3 className="modal-title">Wholesale & Commercial Enquiries</h3>
              <p className="modal-subtitle">
                Supplying restaurants, cloud kitchens, caterers, and bulk events with
                fresh, temperature-controlled poultry, mutton, and seafood.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="wholesale-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Business / Restaurant Name</label>
                  <input
                    type="text"
                    name="businessName"
                    placeholder="e.g. Spice Valley Kitchen"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category of Interest</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input form-select"
                  >
                    <option value="chicken">Fresh Chicken (Whole / Cuts)</option>
                    <option value="mutton">Prime Mutton (Goat / Lamb)</option>
                    <option value="seafood">Fresh Seafood (Prawns / Fish)</option>
                    <option value="mixed">All Categories (Bulk Supply)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Expected Volume / Frequency</label>
                <div className="volume-chips-row">
                  {['10kg - 25kg', '25kg - 50kg', '50kg - 100kg', '100kg+ Daily'].map(
                    (vol) => (
                      <button
                        type="button"
                        key={vol}
                        className={`volume-chip ${formData.quantity === vol ? 'active' : ''}`}
                        onClick={() => setFormData((p) => ({ ...p, quantity: vol }))}
                      >
                        {vol}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Specific Cut or Packaging Notes</label>
                <textarea
                  name="notes"
                  rows="2"
                  placeholder="e.g., Specific curry cut size, bone-in ratio, daily 7 AM delivery requirement..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-input form-textarea"
                />
              </div>

              <div className="wholesale-form-actions">
                <button type="submit" className="btn btn-primary btn-block">
                  Submit Wholesale Enquiry
                </button>
                <button
                  type="button"
                  className="btn btn-yellow btn-block whatsapp-btn"
                  onClick={handleWhatsAppChat}
                >
                  <MessageSquare size={16} />
                  Chat Directly on WhatsApp
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          background: var(--surface-white);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 540px;
          padding: 28px;
          position: relative;
          box-shadow: var(--shadow-lg);
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--surface-light-green);
          color: var(--text-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition-fast);
        }

        .modal-close-btn:hover {
          background: #E1EDDC;
        }

        .wholesale-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--primary-yellow-light);
          color: var(--text-dark);
          font-size: 0.72rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .modal-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--primary-green);
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .modal-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
          margin-bottom: 18px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group {
          margin-bottom: 14px;
        }

        .form-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 5px;
        }

        .form-input {
          width: 100%;
          padding: 10px 14px;
          background-color: var(--bg-main);
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          transition: border-color var(--transition-fast);
        }

        .form-input:focus {
          border-color: var(--primary-green);
          outline: none;
          background-color: #FFFFFF;
        }

        .form-select {
          appearance: auto;
        }

        .form-textarea {
          resize: vertical;
        }

        .volume-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .volume-chip {
          padding: 6px 12px;
          background: var(--surface-light-green);
          border: 1.5px solid #DCE8D7;
          border-radius: var(--radius-pill);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-dark);
          transition: all var(--transition-fast);
        }

        .volume-chip.active {
          background: var(--primary-green);
          color: #FFFFFF;
          border-color: var(--primary-green);
        }

        .wholesale-form-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 18px;
        }

        .whatsapp-btn {
          background-color: #25D366;
          color: #FFFFFF;
        }

        .whatsapp-btn:hover {
          background-color: #1EBE5D;
        }

        .wholesale-success-view {
          text-align: center;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .success-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--primary-green);
          margin-top: 14px;
          margin-bottom: 8px;
        }

        .success-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 24px;
          max-width: 420px;
        }

        .success-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 320px;
        }

        @media (max-width: 640px) {
          .modal-content {
            padding: 20px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            position: fixed;
            bottom: 0;
            max-height: 85vh;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
};
