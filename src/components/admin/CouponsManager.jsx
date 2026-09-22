import React, { useState } from 'react';
import {
  TicketPercent,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Calendar,
  IndianRupee,
  Percent
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';

export const CouponsManager = () => {
  const {
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus
  } = useStoreData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'flat', // 'flat' | 'percent'
    discountValue: 100,
    minOrderValue: 499,
    description: '',
    expiresAt: '2026-12-31'
  });

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'flat',
      discountValue: 50,
      minOrderValue: 399,
      description: 'Flat ₹50 off on orders above ₹399',
      expiresAt: '2026-12-31'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      discountType: coupon.discountType || 'flat',
      discountValue: coupon.discountValue || 50,
      minOrderValue: coupon.minOrderValue || 0,
      description: coupon.description || '',
      expiresAt: coupon.expiresAt || '2026-12-31'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanCode = (formData.code || '').trim().toUpperCase();
    if (!cleanCode) {
      alert('Please enter a coupon code.');
      return;
    }

    const payload = {
      ...formData,
      code: cleanCode,
      discountValue: parseInt(formData.discountValue, 10) || 0,
      minOrderValue: parseInt(formData.minOrderValue, 10) || 0
    };

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, payload);
    } else {
      addCoupon(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="coupons-manager-container">
      {/* Top Header */}
      <div className="coupons-top-bar">
        <div className="coupons-info-left">
          <TicketPercent size={18} color="#075437" />
          <span className="coupons-info-text">
            <strong>{coupons.length} Active & Scheduled Coupons</strong>
          </span>
        </div>

        <button
          type="button"
          className="action-btn-primary"
          onClick={handleOpenAdd}
        >
          <Plus size={16} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Grid / Cards */}
      <div className="coupons-grid">
        {coupons.length === 0 ? (
          <div className="empty-coupons-card">
            <TicketPercent size={40} color="#A0AEC0" />
            <h3>No Coupons Available</h3>
            <p>Create discount codes for customer promotions and festive offers.</p>
            <button
              type="button"
              className="action-btn-primary"
              onClick={handleOpenAdd}
            >
              <Plus size={16} />
              <span>Create Coupon</span>
            </button>
          </div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.id} className="coupon-card">
              <div className="coupon-card-header">
                <div className="coupon-code-badge">
                  <span className="code-txt">{coupon.code}</span>
                </div>

                <button
                  type="button"
                  className={`status-chip-btn ${
                    coupon.isActive ? 'active' : 'inactive'
                  }`}
                  onClick={() => toggleCouponStatus(coupon.id)}
                  title="Toggle coupon status"
                >
                  {coupon.isActive ? (
                    <>
                      <CheckCircle2 size={13} color="#38A169" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={13} color="#E53E3E" />
                      <span>Paused</span>
                    </>
                  )}
                </button>
              </div>

              <div className="coupon-discount-display">
                <span className="discount-amount">
                  {coupon.discountType === 'percent'
                    ? `${coupon.discountValue}% OFF`
                    : `₹${coupon.discountValue} OFF`}
                </span>
                <span className="min-order-sub">
                  Min order: ₹{coupon.minOrderValue}
                </span>
              </div>

              <p className="coupon-desc">{coupon.description || 'Valid on all fresh cuts.'}</p>

              <div className="coupon-meta-row">
                <div className="coupon-meta-item">
                  <Calendar size={13} color="#718096" />
                  <span>Valid till: {coupon.expiresAt}</span>
                </div>
                <span className="used-count-tag">
                  {coupon.usedCount || 0} times used
                </span>
              </div>

              <div className="coupon-actions-row">
                <button
                  type="button"
                  className="action-btn-edit"
                  onClick={() => handleOpenEdit(coupon)}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  className="action-btn-delete"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete coupon code "${coupon.code}"?`
                      )
                    ) {
                      deleteCoupon(coupon.id);
                    }
                  }}
                  title="Delete Coupon"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: CREATE / EDIT COUPON */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body-form">
              <div className="form-group">
                <label className="form-label">Coupon Code *</label>
                <input
                  type="text"
                  className="form-input text-uppercase"
                  placeholder="e.g. FRESH100, MADHUR20"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Discount Type</label>
                  <select
                    className="form-select"
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value
                      })
                    }
                  >
                    <option value="flat">Flat Amount (₹)</option>
                    <option value="percent">Percentage (%)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Discount Value *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="100"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountValue: e.target.value
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Min Cart Value (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="499"
                    value={formData.minOrderValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderValue: e.target.value
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expiresAt: e.target.value
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Helper Note</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Flat ₹100 off on your first order above ₹499"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value
                    })
                  }
                />
              </div>

              <div className="modal-footer-row">
                <button
                  type="button"
                  className="action-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="action-btn-primary">
                  {editingCoupon ? 'Save Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .coupons-manager-container {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .coupons-top-bar {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .coupons-info-left {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: #2D3748;
        }

        .action-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #075437;
          color: #FFFFFF;
          padding: 9px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          transition: background 0.15s ease;
        }

        .action-btn-primary:hover {
          background: #053D27;
        }

        /* Coupons Grid */
        .coupons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 18px;
        }

        .coupon-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .coupon-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .coupon-code-badge {
          background: #EFF8F4;
          border: 1px dashed #075437;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .code-txt {
          font-family: monospace;
          font-size: 0.95rem;
          font-weight: 800;
          color: #075437;
          letter-spacing: 0.05em;
        }

        .status-chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 9px;
          border-radius: 16px;
          font-size: 0.74rem;
          font-weight: 700;
          border: 1px solid;
          cursor: pointer;
        }

        .status-chip-btn.active {
          background: #F0FFF4;
          border-color: #9AE6B4;
          color: #276749;
        }

        .status-chip-btn.inactive {
          background: #FFF5F5;
          border-color: #FEB2B2;
          color: #9B2C2C;
        }

        .coupon-discount-display {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .discount-amount {
          font-size: 1.35rem;
          font-weight: 900;
          color: #1A202C;
        }

        .min-order-sub {
          font-size: 0.76rem;
          color: #718096;
          font-weight: 600;
        }

        .coupon-desc {
          font-size: 0.8rem;
          color: #4A5568;
          line-height: 1.4;
          flex: 1;
        }

        .coupon-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid #EDF2F7;
          font-size: 0.74rem;
          color: #718096;
        }

        .coupon-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .used-count-tag {
          font-weight: 600;
        }

        .coupon-actions-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .action-btn-edit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          flex: 1;
          background: #F7FAFC;
          color: #075437;
          border: 1px solid #E2E8F0;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .action-btn-edit:hover {
          background: #EFF8F4;
          border-color: #075437;
        }

        .action-btn-delete {
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #FEB2B2;
          background: #FFF5F5;
          color: #C53030;
          cursor: pointer;
        }

        .action-btn-delete:hover {
          background: #FED7D7;
        }

        .empty-coupons-card {
          grid-column: 1 / -1;
          background: #FFFFFF;
          border: 1px dashed #CBD5E0;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .text-uppercase {
          text-transform: uppercase;
        }

        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1500;
          padding: 16px;
        }

        .modal-card {
          background: #FFFFFF;
          border-radius: 14px;
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .modal-header {
          padding: 18px 22px;
          border-bottom: 1px solid #EDF2F7;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1A202C;
        }

        .modal-close {
          font-size: 1.1rem;
          color: #A0AEC0;
          cursor: pointer;
        }

        .modal-body-form {
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
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

        .form-input, .form-select {
          padding: 10px 12px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
        }

        .form-input:focus, .form-select:focus {
          border-color: #075437;
          box-shadow: 0 0 0 2px rgba(7,84,55,0.1);
        }

        .modal-footer-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 6px;
        }

        .action-btn-cancel {
          padding: 9px 16px;
          border-radius: 8px;
          background: #EDF2F7;
          color: #4A5568;
          font-weight: 700;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};
