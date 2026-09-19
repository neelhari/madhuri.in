import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Clock,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  Building,
  Home,
  Briefcase
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';

export const CheckoutPage = ({ navigate }) => {
  const { cartItems, grandTotal, subtotal, deliveryFee, totalSavings, clearCart } = useCart();
  const { currentLocation } = useLocation();
  const { placeOrder } = useOrders();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);

  // Address Form State
  const [address, setAddress] = useState({
    name: 'Sindhusha G',
    phone: '+91 98765 43210',
    house: 'Flat 402, Green Orchid Apartments',
    street: '12th Main Road, 4th Cross',
    area: currentLocation.area || 'Indiranagar',
    city: currentLocation.city || 'Bangalore',
    state: 'Karnataka',
    pincode: currentLocation.pincode || '560038',
    type: 'Home'
  });

  // Delivery Slot State
  const [deliverySlot, setDeliverySlot] = useState('Express 90-min Delivery (Immediate)');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('UPI (Google Pay / PhonePe / Paytm)');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty animate-fade-in">
        <div className="app-container">
          <p>Your cart is empty. Please add products to checkout.</p>
          <button className="btn btn-primary" onClick={() => navigate('/categories')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.house || !address.pincode) {
      showToast('Please fill in all required address fields', 'warning');
      return;
    }
    setStep(2);
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          weight: item.weight.label,
          price: item.weight.price,
          quantity: item.quantity,
          image: item.product.images?.[0]
        })),
        address,
        deliverySlot,
        paymentMethod,
        summary: {
          subtotal,
          deliveryFee,
          total: grandTotal,
          savings: totalSavings
        }
      };

      const newOrder = placeOrder(orderData);
      clearCart();
      setIsProcessing(false);
      navigate(`/order-confirmation?orderId=${newOrder.id}`);
    }, 1200);
  };

  const steps = [
    { num: 1, label: 'Address' },
    { num: 2, label: 'Delivery' },
    { num: 3, label: 'Payment' }
  ];

  return (
    <div className="checkout-page animate-fade-in">
      <div className="app-container">
        <h1 className="checkout-title">Secure Checkout</h1>

        {/* Checkout Stepper Progress */}
        <div className="checkout-stepper">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`stepper-item ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}
              onClick={() => {
                if (step > s.num) setStep(s.num);
              }}
            >
              <div className="stepper-circle">
                {step > s.num ? <CheckCircle2 size={16} /> : s.num}
              </div>
              <span className="stepper-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="checkout-layout-grid">
          {/* Main Step Form Area */}
          <div className="checkout-main-col">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="checkout-card animate-fade-in">
                <div className="step-card-header">
                  <MapPin size={22} color="var(--primary-green)" />
                  <div>
                    <h3 className="step-heading">1. Delivery Address</h3>
                    <p className="step-subheading">Where should we deliver your fresh meat?</p>
                  </div>
                </div>

                <form onSubmit={handleAddressSubmit} className="address-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={address.name}
                        onChange={handleAddressChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobile Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={address.phone}
                        onChange={handleAddressChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">House / Flat / Building *</label>
                    <input
                      type="text"
                      name="house"
                      required
                      value={address.house}
                      onChange={handleAddressChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Street / Landmark</label>
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Area / Locality *</label>
                      <input
                        type="text"
                        name="area"
                        required
                        value={address.area}
                        onChange={handleAddressChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={address.city}
                        onChange={handleAddressChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        maxLength={6}
                        value={address.pincode}
                        onChange={handleAddressChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Address Type Tag */}
                  <div className="form-group">
                    <label className="form-label">Save Address As:</label>
                    <div className="address-tags-row">
                      {[
                        { id: 'Home', icon: Home },
                        { id: 'Work', icon: Briefcase },
                        { id: 'Other', icon: Building }
                      ].map((t) => {
                        const Icon = t.icon;
                        return (
                          <button
                            type="button"
                            key={t.id}
                            className={`address-tag-btn ${address.type === t.id ? 'active' : ''}`}
                            onClick={() => setAddress((p) => ({ ...p, type: t.id }))}
                          >
                            <Icon size={14} />
                            <span>{t.id}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg btn-block">
                    Continue to Delivery Slot
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Delivery Slot */}
            {step === 2 && (
              <div className="checkout-card animate-fade-in">
                <div className="step-card-header">
                  <Clock size={22} color="var(--primary-green)" />
                  <div>
                    <h3 className="step-heading">2. Choose Delivery Slot</h3>
                    <p className="step-subheading">
                      Select your preferred delivery time to {address.area}
                    </p>
                  </div>
                </div>

                <div className="slots-list">
                  {[
                    {
                      id: 'Express 90-min Delivery (Immediate)',
                      title: '⚡ Express 90-Min Delivery',
                      desc: 'Packed in cold-chain thermal box and dispatched immediately.',
                      tag: 'Fastest'
                    },
                    {
                      id: 'Tomorrow Morning (7:00 AM - 10:00 AM)',
                      title: '🌅 Tomorrow Morning (7:00 AM - 10:00 AM)',
                      desc: 'Fresh morning cut for breakfast & early Sunday lunch.'
                    },
                    {
                      id: 'Tomorrow Evening (4:00 PM - 7:00 PM)',
                      title: '🌇 Tomorrow Evening (4:00 PM - 7:00 PM)',
                      desc: 'Delivered fresh before evening dinner preparations.'
                    }
                  ].map((slot) => {
                    const isSelected = deliverySlot === slot.id;
                    return (
                      <div
                        key={slot.id}
                        className={`slot-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setDeliverySlot(slot.id)}
                      >
                        <div className="slot-radio">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => setDeliverySlot(slot.id)}
                          />
                        </div>
                        <div className="slot-info">
                          <div className="slot-title-row">
                            <strong className="slot-title">{slot.title}</strong>
                            {slot.tag && (
                              <span className="badge badge-yellow">{slot.tag}</span>
                            )}
                          </div>
                          <p className="slot-desc">{slot.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="step-nav-buttons">
                  <button
                    className="btn btn-outline"
                    onClick={() => setStep(1)}
                  >
                    Back to Address
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setStep(3)}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="checkout-card animate-fade-in">
                <div className="step-card-header">
                  <CreditCard size={22} color="var(--primary-green)" />
                  <div>
                    <h3 className="step-heading">3. Payment Method</h3>
                    <p className="step-subheading">
                      Safe & secure checkout. Cash on Delivery is also available.
                    </p>
                  </div>
                </div>

                <div className="payment-options-list">
                  {[
                    {
                      id: 'UPI (Google Pay / PhonePe / Paytm)',
                      title: 'UPI (GPay / PhonePe / Paytm)',
                      desc: 'Instant zero-fee transfer via any UPI app',
                      badge: 'Recommended'
                    },
                    {
                      id: 'Credit / Debit Card (Visa, Mastercard, RuPay)',
                      title: 'Credit or Debit Card',
                      desc: 'Encrypted and processed securely'
                    },
                    {
                      id: 'Cash on Delivery (Pay upon delivery)',
                      title: 'Cash / UPI on Delivery',
                      desc: 'Pay safely with cash or QR code when the delivery arrives'
                    }
                  ].map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        className={`payment-option-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => setPaymentMethod(method.id)}
                        />
                        <div className="payment-option-info">
                          <div className="payment-title-row">
                            <span className="payment-name">{method.title}</span>
                            {method.badge && (
                              <span className="badge badge-yellow">{method.badge}</span>
                            )}
                          </div>
                          <span className="payment-desc">{method.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="payment-guarantee-note">
                  <ShieldCheck size={18} color="var(--primary-green)" />
                  <span>100% Satisfaction Guarantee: Free replacement if not satisfied.</span>
                </div>

                <div className="step-nav-buttons">
                  <button
                    className="btn btn-outline"
                    onClick={() => setStep(2)}
                  >
                    Back to Delivery
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    disabled={isProcessing}
                    onClick={handleCompleteOrder}
                  >
                    {isProcessing ? 'Confirming Order...' : `Place Order • ₹${grandTotal}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary Preview */}
          <div className="checkout-summary-col">
            <div className="order-summary-box">
              <h3 className="summary-title">Order Items ({cartItems.length})</h3>

              <div className="summary-items-list">
                {cartItems.map((item) => (
                  <div key={item.key} className="summary-item-row">
                    <img
                      src={item.product.images?.[0]}
                      alt=""
                      className="summary-item-thumb"
                    />
                    <div className="summary-item-details">
                      <span className="summary-name">{item.product.name}</span>
                      <span className="summary-weight">
                        {item.weight.label} × {item.quantity}
                      </span>
                    </div>
                    <span className="summary-price">
                      ₹{item.weight.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-total-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="summary-total-row">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-total-row grand">
                  <span>Total Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {/* Delivery Address Snapshot */}
              <div className="summary-address-snapshot">
                <MapPin size={16} color="var(--primary-green)" />
                <div>
                  <span className="snapshot-title">Delivering to {address.type}:</span>
                  <p className="snapshot-addr">
                    {address.house}, {address.area}, {address.city} - {address.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-page {
          padding-top: 18px;
          padding-bottom: 48px;
        }

        .checkout-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary-green);
          margin-bottom: 20px;
        }

        .checkout-stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 36px;
          margin-bottom: 28px;
          position: relative;
        }

        .stepper-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          cursor: pointer;
        }

        .stepper-item.active {
          color: var(--primary-green);
          font-weight: 700;
        }

        .stepper-item.completed {
          color: var(--primary-green);
        }

        .stepper-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 800;
          background: #FFFFFF;
        }

        .stepper-item.active .stepper-circle {
          border-color: var(--primary-green);
          background: var(--primary-green);
          color: #FFFFFF;
        }

        .stepper-item.completed .stepper-circle {
          border-color: var(--primary-green);
          background: var(--surface-light-green);
          color: var(--primary-green);
        }

        .stepper-label {
          font-size: 0.875rem;
        }

        .checkout-layout-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 28px;
        }

        .checkout-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 24px;
        }

        .step-card-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-light);
        }

        .step-heading {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--primary-green);
        }

        .step-subheading {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .address-tags-row {
          display: flex;
          gap: 10px;
        }

        .address-tag-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-color);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-dark);
          background: var(--bg-main);
          transition: all var(--transition-fast);
        }

        .address-tag-btn.active {
          border-color: var(--primary-green);
          background: var(--surface-light-green);
          color: var(--primary-green);
        }

        .slots-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .slot-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-color);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .slot-card.selected {
          border-color: var(--primary-green);
          background: var(--surface-light-green);
        }

        .slot-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .slot-title {
          font-size: 0.95rem;
          color: var(--text-dark);
        }

        .slot-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .step-nav-buttons {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }

        .payment-options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .payment-option-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-color);
          cursor: pointer;
        }

        .payment-option-card.selected {
          border-color: var(--primary-green);
          background: var(--surface-light-green);
        }

        .payment-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .payment-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .payment-desc {
          display: block;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .payment-guarantee-note {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--surface-light-green);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          color: var(--primary-green);
          font-weight: 600;
          margin-bottom: 20px;
        }

        /* Order Summary Column */
        .order-summary-box {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 20px;
        }

        .summary-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--primary-green);
          margin-bottom: 14px;
        }

        .summary-items-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
          max-height: 240px;
          overflow-y: auto;
        }

        .summary-item-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .summary-item-thumb {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-xs);
          object-fit: cover;
        }

        .summary-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .summary-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .summary-weight {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .summary-price {
          font-size: 0.875rem;
          font-weight: 800;
          color: var(--primary-green);
        }

        .summary-totals {
          border-top: 1px dashed var(--border-color);
          padding-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .summary-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-dark);
        }

        .summary-total-row.grand {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--primary-green);
          padding-top: 4px;
        }

        .summary-address-snapshot {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid var(--border-light);
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .snapshot-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .snapshot-addr {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.35;
          margin-top: 2px;
        }

        @media (max-width: 900px) {
          .checkout-layout-grid {
            grid-template-columns: 1fr;
          }
          .checkout-stepper {
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};
