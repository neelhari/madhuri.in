import React, { useState, useMemo } from 'react';
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
  Briefcase,
  Plus,
  Minus,
  Trash2,
  Edit2,
  Tag,
  Sparkles,
  Lock,
  ChevronRight,
  Truck,
  Check,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { openRazorpayPayment } from '../lib/razorpay';

export const CheckoutPage = ({ navigate }) => {
  const {
    cartItems,
    grandTotal,
    subtotal,
    deliveryFee,
    totalSavings,
    couponSavings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const { currentLocation } = useLocation();
  const { placeOrder } = useOrders();
  const { showToast } = useToast();

  // Saved Addresses List from LocalStorage (Completely clean - no dummy company data)
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_saved_addresses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Active selected address ID
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_saved_addresses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0].id;
        }
      }
    } catch {}
    return null;
  });

  // Address View Mode: 'saved' | 'form'
  const [addressTab, setAddressTab] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_saved_addresses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return 'saved';
        }
      }
    } catch {}
    return 'form'; // If no saved address, open form directly
  });

  // Address Form State (Completely empty - no prefilled dummy user)
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formAddress, setFormAddress] = useState({
    name: '',
    phone: '',
    house: '',
    street: '',
    area: currentLocation.area || '',
    city: currentLocation.city || 'Bangalore',
    state: 'Karnataka',
    pincode: currentLocation.pincode || '',
    type: 'Home'
  });

  // Selected address object
  const activeAddress = useMemo(() => {
    return savedAddresses.find((a) => a.id === selectedAddressId) || null;
  }, [savedAddresses, selectedAddressId]);

  // Dynamic Live Delivery Time Slots based on current real-time clock
  const dynamicSlots = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const slots = [];

    // Calculate dynamic live Express ETA (+45 to +60 min from now)
    const expressStart = new Date(now.getTime() + 45 * 60 * 1000);
    const expressEnd = new Date(now.getTime() + 60 * 60 * 1000);
    const formatTime = (d) =>
      d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

    // Store is open for instant butchery between 6:30 AM and 9:30 PM
    const isStoreOpenForInstant =
      currentHour >= 6 && (currentHour < 21 || (currentHour === 21 && currentMinutes <= 30));

    if (isStoreOpenForInstant) {
      slots.push({
        id: 'express_instant',
        title: `⚡ Express Delivery (${formatTime(expressStart)} – ${formatTime(expressEnd)})`,
        badge: 'FASTEST • LIVE ETA',
        desc: 'Packed in cold-chain thermal box and dispatched immediately.',
        isExpress: true
      });
    } else {
      slots.push({
        id: 'express_next_morning',
        title: '⚡ First Batch Express (Tomorrow 7:00 AM – 8:00 AM)',
        badge: 'FIRST DISPATCH',
        desc: 'Store opens at 6:30 AM. Dispatched in first morning batch.',
        isExpress: true
      });
    }

    // Today afternoon/evening slots if cutoff time has not passed
    if (currentHour < 11) {
      slots.push({
        id: 'today_afternoon',
        title: '🌤️ Today Afternoon (1:00 PM – 3:30 PM)',
        badge: 'TODAY',
        desc: 'Fresh midday butchery cut, delivered before 3:30 PM.'
      });
    }

    if (currentHour < 16) {
      slots.push({
        id: 'today_evening',
        title: '🌇 Today Evening (4:30 PM – 7:00 PM)',
        badge: 'TODAY',
        desc: 'Delivered fresh before evening dinner preparations.'
      });
    }

    if (currentHour < 19) {
      slots.push({
        id: 'today_night',
        title: '🌙 Today Night (7:30 PM – 9:30 PM)',
        badge: 'TODAY',
        desc: 'Late evening fresh delivery for dinner.'
      });
    }

    // Tomorrow Morning & Evening slots (Always available)
    slots.push({
      id: 'tomorrow_morning',
      title: '🌅 Tomorrow Morning (7:00 AM – 10:00 AM)',
      badge: 'FRESH BATCH',
      desc: 'Fresh morning artisanal cut, ready for breakfast & lunch preparations.'
    });

    slots.push({
      id: 'tomorrow_evening',
      title: '🌇 Tomorrow Evening (4:00 PM – 7:00 PM)',
      badge: 'TOMORROW',
      desc: 'Cut and packed in the afternoon, delivered before dinner.'
    });

    return slots;
  }, []);

  // Delivery Slot State
  const [selectedSlotId, setSelectedSlotId] = useState(() => dynamicSlots[0]?.id || 'express_instant');

  // Coupon code input state
  const [couponInput, setCouponInput] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('UPI (Google Pay / PhonePe / Paytm)');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty-view animate-fade-in">
        <div className="app-container">
          <div className="empty-cart-card">
            <ShoppingBag size={56} color="#A0AEC0" />
            <h2>Your Cart is Empty</h2>
            <p>Add some fresh, antibiotic-free meat cuts to proceed with checkout.</p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/categories')}
            >
              Explore Fresh Cuts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAddForm = () => {
    setEditingAddressId(null);
    setFormAddress({
      name: '',
      phone: '',
      house: '',
      street: '',
      area: currentLocation.area || '',
      city: currentLocation.city || 'Bangalore',
      state: 'Karnataka',
      pincode: currentLocation.pincode || '',
      type: 'Home'
    });
    setAddressTab('form');
  };

  const handleOpenEditForm = (addr, e) => {
    if (e) e.stopPropagation();
    setEditingAddressId(addr.id);
    setFormAddress({ ...addr });
    setAddressTab('form');
  };

  const handleDeleteAddress = (id, e) => {
    if (e) e.stopPropagation();
    const updated = savedAddresses.filter((a) => a.id !== id);
    setSavedAddresses(updated);
    try {
      localStorage.setItem('madurfresh_saved_addresses', JSON.stringify(updated));
    } catch {}

    if (selectedAddressId === id) {
      const nextId = updated[0]?.id || null;
      setSelectedAddressId(nextId);
      if (!nextId) {
        setAddressTab('form');
      }
    }
    showToast('Address removed', 'info');
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!formAddress.name?.trim() || !formAddress.phone?.trim() || !formAddress.house?.trim() || !formAddress.pincode?.trim()) {
      showToast('Please fill in all required address fields (*)', 'warning');
      return;
    }

    let updatedList = [];
    let savedId = editingAddressId;

    if (editingAddressId) {
      // Edit existing
      updatedList = savedAddresses.map((a) =>
        a.id === editingAddressId ? { ...formAddress, id: editingAddressId } : a
      );
    } else {
      // Add new
      savedId = 'addr_' + Date.now();
      const newAddr = { ...formAddress, id: savedId };
      updatedList = [newAddr, ...savedAddresses];
    }

    setSavedAddresses(updatedList);
    setSelectedAddressId(savedId);
    try {
      localStorage.setItem('madurfresh_saved_addresses', JSON.stringify(updatedList));
    } catch {}

    setEditingAddressId(null);
    setAddressTab('saved');
    showToast(editingAddressId ? 'Address updated successfully!' : 'New address saved & selected!', 'success');
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) {
      showToast('Please enter a coupon code', 'warning');
      return;
    }
    const res = applyCoupon(couponInput);
    if (res.success) {
      showToast(res.message, 'success');
      setCouponInput('');
    } else {
      showToast(res.message, 'warning');
    }
  };

  const handleCompleteOrder = () => {
    if (!activeAddress) {
      showToast('Please add and select a delivery address first', 'warning');
      setAddressTab('form');
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

    const selectedSlotObj = dynamicSlots.find((s) => s.id === selectedSlotId) || dynamicSlots[0];
    const isCOD = paymentMethod.includes('Cash');

    const baseOrderData = {
      items: cartItems.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        weight: item.weight.label,
        price: item.weight.price,
        quantity: item.quantity,
        image: item.product.images?.[0]
      })),
      address: activeAddress,
      deliverySlot: selectedSlotObj.title,
      summary: {
        subtotal,
        deliveryFee,
        total: grandTotal,
        savings: totalSavings
      }
    };

    if (isCOD) {
      setIsProcessing(true);
      setTimeout(() => {
        const newOrder = placeOrder({
          ...baseOrderData,
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'Pending'
        });
        clearCart();
        setIsProcessing(false);
        showToast('Order confirmed with Cash on Delivery!', 'success');
        navigate(`/order-confirmation?orderId=${newOrder.id}`);
      }, 600);
      return;
    }

    // Online Payment via Razorpay
    setIsProcessing(true);
    openRazorpayPayment({
      amount: grandTotal,
      customerName: activeAddress.name,
      customerPhone: activeAddress.phone,
      customerEmail: activeAddress.email || 'care@madurfresh.in',
      notes: {
        deliveryArea: activeAddress.area,
        pincode: activeAddress.pincode,
        deliverySlot: selectedSlotObj.title
      },
      onSuccess: (paymentRes) => {
        const newOrder = placeOrder({
          ...baseOrderData,
          paymentMethod: `${paymentMethod} (Razorpay: ${paymentRes.paymentId})`,
          paymentStatus: 'Paid',
          transactionId: paymentRes.paymentId
        });
        clearCart();
        setIsProcessing(false);
        showToast('Payment successful! Order confirmed.', 'success');
        navigate(`/order-confirmation?orderId=${newOrder.id}`);
      },
      onFailure: (error) => {
        setIsProcessing(false);
        const errorMsg = error?.message || 'Payment not completed';
        showToast(errorMsg, 'warning');
      }
    });
  };

  const selectedSlotObj = dynamicSlots.find((s) => s.id === selectedSlotId) || dynamicSlots[0];

  return (
    <div className="single-page-checkout animate-fade-in">
      <div className="app-container">
        {/* Navigation & Header */}
        <div className="checkout-top-nav">
          <button
            type="button"
            className="btn-back-nav"
            onClick={() => navigate('/categories')}
          >
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </button>
          <div className="secure-badge-pill">
            <Lock size={13} />
            <span>100% Secure Checkout</span>
          </div>
        </div>

        <h1 className="checkout-main-title">Single-Page Checkout</h1>

        <div className="checkout-grid-layout">
          {/* LEFT COLUMN: All Order Sections in One Page */}
          <div className="checkout-sections-col">
            {/* 1. ORDER ITEMS & CUTS */}
            <div className="checkout-section-card">
              <div className="section-card-header">
                <div className="header-icon-box">
                  <ShoppingBag size={18} color="#075437" />
                </div>
                <div className="header-title-text">
                  <h3>1. Selected Fresh Cuts ({cartItems.length})</h3>
                  <p>Review items, adjust quantities, or add more cuts</p>
                </div>
                <button
                  type="button"
                  className="btn-add-more-cuts"
                  onClick={() => navigate('/categories')}
                >
                  <Plus size={14} />
                  <span>Add More Cuts</span>
                </button>
              </div>

              <div className="checkout-items-list">
                {cartItems.map((item) => (
                  <div key={item.key} className="checkout-item-row">
                    <img
                      src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=300&q=80'}
                      alt={item.product.name}
                      className="item-row-img"
                    />

                    <div className="item-row-info">
                      <h4 className="item-name">{item.product.name}</h4>
                      <div className="item-meta-tags">
                        <span className="item-pack-tag">Pack: {item.weight.label}</span>
                        <span className="item-price-each">₹{item.weight.price} each</span>
                      </div>
                    </div>

                    <div className="item-qty-stepper">
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => updateQuantity(item.productId, item.weightId, item.quantity - 1)}
                        title="Reduce quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="stepper-count">{item.quantity}</span>
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => updateQuantity(item.productId, item.weightId, item.quantity + 1)}
                        title="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="item-row-total">
                      <span className="item-total-val">₹{item.weight.price * item.quantity}</span>
                      <button
                        type="button"
                        className="item-remove-btn"
                        onClick={() => removeFromCart(item.productId, item.weightId)}
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. DELIVERY ADDRESS: DUAL BUTTONS (SAVED ADDRESSES / ADD ADDRESS) */}
            <div className="checkout-section-card">
              <div className="section-card-header address-section-header">
                <div className="header-icon-box">
                  <MapPin size={18} color="#075437" />
                </div>
                <div className="header-title-text">
                  <h3>2. Delivery Address</h3>
                  <p>Where we deliver your fresh, vacuum-packed cuts</p>
                </div>

                {/* TWO TOGGLE BUTTONS: Saved Addresses & Add New Address */}
                <div className="address-tabs-toggle">
                  <button
                    type="button"
                    className={`tab-btn ${addressTab === 'saved' ? 'active' : ''}`}
                    onClick={() => {
                      if (savedAddresses.length === 0) {
                        showToast('No saved addresses yet. Please fill the form below.', 'info');
                        setAddressTab('form');
                      } else {
                        setAddressTab('saved');
                      }
                    }}
                  >
                    <MapPin size={13} />
                    <span>Saved Addresses ({savedAddresses.length})</span>
                  </button>

                  <button
                    type="button"
                    className={`tab-btn ${addressTab === 'form' ? 'active' : ''}`}
                    onClick={handleOpenAddForm}
                  >
                    <Plus size={13} />
                    <span>+ Add Address</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: SAVED ADDRESSES VIEW */}
              {addressTab === 'saved' && (
                <div className="saved-addresses-list animate-fade-in">
                  {savedAddresses.length === 0 ? (
                    <div className="no-address-box">
                      <AlertCircle size={36} color="#A0AEC0" />
                      <h4>No Saved Address Found</h4>
                      <p>You haven't saved any delivery address yet. Click below to add one.</p>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleOpenAddForm}
                      >
                        <Plus size={14} />
                        <span>Add New Address</span>
                      </button>
                    </div>
                  ) : (
                    <div className="saved-cards-grid">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            className={`saved-addr-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedAddressId(addr.id)}
                          >
                            <div className="saved-addr-left">
                              <div className={`custom-radio ${isSelected ? 'checked' : ''}`}>
                                {isSelected && <div className="radio-dot" />}
                              </div>
                            </div>

                            <div className="saved-addr-content">
                              <div className="saved-addr-top-line">
                                <span className="addr-tag-chip">
                                  {addr.type === 'Work' ? <Briefcase size={12} /> : addr.type === 'Other' ? <Building size={12} /> : <Home size={12} />}
                                  <span>{addr.type || 'Home'}</span>
                                </span>
                                <strong className="addr-recipient-name">{addr.name}</strong>
                                <span className="addr-phone">{addr.phone}</span>
                              </div>

                              <p className="addr-full-text">
                                {addr.house}, {addr.street ? `${addr.street}, ` : ''}{addr.area}, {addr.city} - <strong>{addr.pincode}</strong>
                              </p>

                              <div className="saved-addr-actions">
                                <button
                                  type="button"
                                  className="btn-addr-action"
                                  onClick={(e) => handleOpenEditForm(addr, e)}
                                >
                                  <Edit2 size={12} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  className="btn-addr-action delete"
                                  onClick={(e) => handleDeleteAddress(addr.id, e)}
                                >
                                  <Trash2 size={12} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ADD / EDIT ADDRESS FORM (EMPTY BY DEFAULT) */}
              {addressTab === 'form' && (
                <form onSubmit={handleSaveAddress} className="address-edit-form animate-fade-in">
                  <div className="form-mode-title">
                    <h4>{editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}</h4>
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        className="btn-link-sm"
                        onClick={() => setAddressTab('saved')}
                      >
                        Cancel & View Saved Addresses
                      </button>
                    )}
                  </div>

                  <div className="form-grid-2">
                    <div className="form-field-group">
                      <label className="form-field-label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formAddress.name}
                        onChange={handleFormChange}
                        placeholder="Enter recipient full name"
                        className="form-clean-input"
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="form-field-label">Mobile Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formAddress.phone}
                        onChange={handleFormChange}
                        placeholder="10-digit mobile number"
                        className="form-clean-input"
                      />
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">Flat / House No. / Building Name *</label>
                    <input
                      type="text"
                      name="house"
                      required
                      value={formAddress.house}
                      onChange={handleFormChange}
                      placeholder="e.g. Flat 301, Lakeview Residency"
                      className="form-clean-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">Street / Landmark</label>
                    <input
                      type="text"
                      name="street"
                      value={formAddress.street}
                      onChange={handleFormChange}
                      placeholder="e.g. 5th Cross Road, Near Green Park"
                      className="form-clean-input"
                    />
                  </div>

                  <div className="form-grid-3">
                    <div className="form-field-group">
                      <label className="form-field-label">Locality / Area *</label>
                      <input
                        type="text"
                        name="area"
                        required
                        value={formAddress.area}
                        onChange={handleFormChange}
                        placeholder="e.g. Indiranagar"
                        className="form-clean-input"
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="form-field-label">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formAddress.city}
                        onChange={handleFormChange}
                        placeholder="Bangalore"
                        className="form-clean-input"
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="form-field-label">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        maxLength={6}
                        value={formAddress.pincode}
                        onChange={handleFormChange}
                        placeholder="6-digit PIN"
                        className="form-clean-input"
                      />
                    </div>
                  </div>

                  {/* Address Type Tag Buttons */}
                  <div className="form-field-group">
                    <label className="form-field-label">Save Address As:</label>
                    <div className="address-type-pill-group">
                      {[
                        { id: 'Home', label: 'Home', icon: Home },
                        { id: 'Work', label: 'Work', icon: Briefcase },
                        { id: 'Other', label: 'Other', icon: Building }
                      ].map((t) => {
                        const Icon = t.icon;
                        const isSelected = formAddress.type === t.id;
                        return (
                          <button
                            type="button"
                            key={t.id}
                            className={`address-type-btn ${isSelected ? 'active' : ''}`}
                            onClick={() => setFormAddress((prev) => ({ ...prev, type: t.id }))}
                          >
                            <Icon size={14} />
                            <span>{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="form-action-row">
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        className="btn-cancel-flat"
                        onClick={() => setAddressTab('saved')}
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="btn btn-primary">
                      {editingAddressId ? 'Update & Deliver Here' : 'Save Address & Deliver Here'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 3. DYNAMIC DELIVERY SLOTS */}
            <div className="checkout-section-card">
              <div className="section-card-header">
                <div className="header-icon-box">
                  <Clock size={18} color="#075437" />
                </div>
                <div className="header-title-text">
                  <h3>3. Delivery Speed & Live Time Slots</h3>
                  <p>Real-time butchery dispatch and scheduled delivery windows</p>
                </div>
              </div>

              <div className="delivery-slots-grid">
                {dynamicSlots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <div
                      key={slot.id}
                      className={`slot-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedSlotId(slot.id)}
                    >
                      <input
                        type="radio"
                        name="delivery_slot"
                        checked={isSelected}
                        onChange={() => setSelectedSlotId(slot.id)}
                        className="slot-radio-input"
                      />
                      <div className="slot-option-body">
                        <div className="slot-header-row">
                          <strong className="slot-option-title">{slot.title}</strong>
                          {slot.badge && (
                            <span className={`slot-badge-tag ${slot.isExpress ? 'express' : ''}`}>
                              {slot.badge}
                            </span>
                          )}
                        </div>
                        <p className="slot-option-desc">{slot.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. PAYMENT METHOD (ALL-IN-ONE SINGLE PAGE) */}
            <div className="checkout-section-card">
              <div className="section-card-header">
                <div className="header-icon-box">
                  <CreditCard size={18} color="#075437" />
                </div>
                <div className="header-title-text">
                  <h3>4. Payment Method</h3>
                  <p>Select your preferred payment method</p>
                </div>
              </div>

              <div className="payment-methods-grid">
                {[
                  {
                    id: 'UPI (Google Pay / PhonePe / Paytm)',
                    title: 'UPI (Google Pay / PhonePe / Paytm / QR)',
                    desc: 'Instant zero-fee transfer via any UPI app',
                    badge: 'Recommended',
                    isOnline: true
                  },
                  {
                    id: 'Credit / Debit Card (Visa, Mastercard, RuPay)',
                    title: 'Credit / Debit Card & Netbanking',
                    desc: 'Secure 256-bit encrypted checkout via Razorpay',
                    isOnline: true
                  },
                  {
                    id: 'Cash on Delivery (Pay upon delivery)',
                    title: 'Cash / UPI on Delivery',
                    desc: 'Pay cash or scan delivery partner’s QR code upon delivery',
                    isOnline: false
                  }
                ].map((m) => {
                  const isSelected = paymentMethod === m.id;
                  return (
                    <div
                      key={m.id}
                      className={`payment-method-box ${isSelected ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(m.id)}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={isSelected}
                        onChange={() => setPaymentMethod(m.id)}
                        className="payment-radio-input"
                      />
                      <div className="payment-method-text">
                        <div className="payment-name-row">
                          <span className="payment-method-title">{m.title}</span>
                          {m.badge && <span className="payment-pill-tag">{m.badge}</span>}
                        </div>
                        <span className="payment-method-desc">{m.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Complete Order CTA */}
              <div className="single-page-cta-bar">
                <div className="guarantee-text-row">
                  <ShieldCheck size={18} color="#075437" />
                  <span>100% Quality Assurance: Freshness guaranteed or instant free replacement.</span>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-lg btn-block btn-final-checkout"
                  disabled={isProcessing}
                  onClick={handleCompleteOrder}
                >
                  {isProcessing ? (
                    'Processing Order...'
                  ) : paymentMethod.includes('Cash') ? (
                    `Place Cash on Delivery Order • ₹${grandTotal}`
                  ) : (
                    `Pay via Razorpay • ₹${grandTotal}`
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY & BILL DETAILS */}
          <div className="checkout-sidebar-col">
            {/* Coupon Promo Box */}
            <div className="sidebar-summary-card">
              <div className="coupon-box-header">
                <Tag size={16} color="#075437" />
                <h4>Apply Discount Coupon</h4>
              </div>

              {appliedCoupon ? (
                <div className="applied-coupon-pill">
                  <div className="applied-coupon-info">
                    <span className="applied-code">{appliedCoupon.code}</span>
                    <span className="applied-desc">Saved ₹{couponSavings}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-remove-coupon"
                    onClick={removeCoupon}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-input-form">
                  <input
                    type="text"
                    placeholder="Enter code: FRESH100 / MADHUR20"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="coupon-text-input"
                  />
                  <button type="submit" className="btn-apply-coupon">
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Bill Summary */}
            <div className="sidebar-summary-card">
              <h3 className="bill-card-title">Order Bill Summary</h3>

              <div className="bill-breakdown-list">
                <div className="bill-row">
                  <span className="bill-lbl">Item Total ({cartItems.length} cuts)</span>
                  <span className="bill-val">₹{subtotal}</span>
                </div>

                {couponSavings > 0 && (
                  <div className="bill-row row-discount">
                    <span className="bill-lbl">Coupon Discount</span>
                    <span className="bill-val">- ₹{couponSavings}</span>
                  </div>
                )}

                <div className="bill-row">
                  <span className="bill-lbl">Delivery Fee</span>
                  <span className="bill-val">
                    {deliveryFee === 0 ? (
                      <span className="badge-free-delivery">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="bill-row bill-grand-total">
                  <span className="bill-lbl">Total Amount</span>
                  <span className="bill-val">₹{grandTotal}</span>
                </div>
              </div>

              {totalSavings > 0 && (
                <div className="savings-highlight-pill">
                  <Sparkles size={14} color="#065F46" />
                  <span>You are saving ₹{totalSavings} on this order!</span>
                </div>
              )}

              {/* Delivery Destination Mini Summary */}
              <div className="delivery-destination-box">
                <Truck size={16} color="#075437" />
                <div>
                  {activeAddress ? (
                    <>
                      <strong className="dest-title">Delivering to {activeAddress.type || 'Home'} ({activeAddress.name})</strong>
                      <p className="dest-text">{activeAddress.house}, {activeAddress.area}, {activeAddress.city} ({activeAddress.pincode})</p>
                    </>
                  ) : (
                    <>
                      <strong className="dest-title text-warning">No Delivery Address Selected</strong>
                      <p className="dest-text">Please add/select an address on the left to proceed</p>
                    </>
                  )}
                </div>
              </div>

              {/* Selected Slot Mini Summary */}
              <div className="selected-slot-box">
                <Clock size={16} color="#075437" />
                <div>
                  <strong className="slot-mini-title">Slot: {selectedSlotObj.title}</strong>
                  <p className="slot-mini-desc">{selectedSlotObj.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .single-page-checkout {
          padding-top: 16px;
          padding-bottom: 60px;
          background-color: var(--bg-main);
          min-height: calc(100vh - 120px);
        }

        .checkout-top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .btn-back-nav {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--deep-forest-green);
          font-weight: 700;
          font-size: 0.88rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 0;
          transition: transform 0.15s ease;
        }

        .btn-back-nav:hover {
          transform: translateX(-3px);
        }

        .secure-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
          padding: 4px 12px;
          border-radius: var(--radius-pill);
          font-size: 0.76rem;
          font-weight: 700;
        }

        .checkout-main-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--charcoal);
          margin-bottom: 24px;
        }

        .checkout-grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 1024px) {
          .checkout-grid-layout {
            grid-template-columns: 1.55fr 1fr;
            gap: 32px;
            align-items: start;
          }
          .checkout-sidebar-col {
            position: sticky;
            top: 90px;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
        }

        .checkout-sections-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .checkout-section-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 22px 24px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        }

        .section-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-light);
        }

        .address-section-header {
          flex-wrap: wrap;
          gap: 12px;
        }

        .header-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--surface-light-green);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .header-title-text {
          flex: 1;
          min-width: 160px;
        }

        .header-title-text h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--charcoal);
          margin: 0;
        }

        .header-title-text p {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin: 2px 0 0 0;
        }

        .btn-add-more-cuts {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--deep-forest-green);
          background: #EFF8F4;
          border: 1px solid #C6F6D5;
          padding: 6px 14px;
          border-radius: var(--radius-pill);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-add-more-cuts:hover {
          background: var(--deep-forest-green);
          color: #FFFFFF;
        }

        /* Address Tabs Toggle */
        .address-tabs-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F1F5F9;
          padding: 4px;
          border-radius: 10px;
        }

        .address-tabs-toggle .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 7px;
          border: none;
          background: transparent;
          color: #64748B;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .address-tabs-toggle .tab-btn.active {
          background: #FFFFFF;
          color: var(--deep-forest-green);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        /* Items List */
        .checkout-items-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .checkout-item-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-light);
        }

        .checkout-item-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .item-row-img {
          width: 54px;
          height: 54px;
          border-radius: var(--radius-md);
          object-fit: cover;
          background: #EDF2F7;
          flex-shrink: 0;
        }

        .item-row-info {
          flex: 1;
        }

        .item-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--charcoal);
          margin: 0 0 4px 0;
        }

        .item-meta-tags {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .item-pack-tag {
          font-size: 0.74rem;
          font-weight: 700;
          background: #EDF2F7;
          color: #4A5568;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .item-price-each {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .item-qty-stepper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F7FAFC;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 3px 6px;
        }

        .stepper-btn {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--charcoal);
          cursor: pointer;
        }

        .stepper-btn:hover {
          background: #EDF2F7;
        }

        .stepper-count {
          font-size: 0.88rem;
          font-weight: 800;
          min-width: 18px;
          text-align: center;
        }

        .item-row-total {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          min-width: 60px;
        }

        .item-total-val {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--deep-forest-green);
        }

        .item-remove-btn {
          background: none;
          border: none;
          color: #E53E3E;
          cursor: pointer;
          padding: 2px;
          opacity: 0.7;
          transition: opacity 0.15s ease;
        }

        .item-remove-btn:hover {
          opacity: 1;
        }

        /* Saved Address Cards Grid */
        .saved-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .saved-addr-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #FAF9F5;
          border: 1.5px solid #E2E8F0;
          border-radius: var(--radius-md);
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .saved-addr-card:hover {
          border-color: #CBD5E0;
        }

        .saved-addr-card.selected {
          background: #EFF8F4;
          border-color: var(--deep-forest-green);
        }

        .saved-addr-left {
          margin-top: 2px;
        }

        .custom-radio {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid #CBD5E0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
        }

        .custom-radio.checked {
          border-color: var(--deep-forest-green);
        }

        .radio-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--deep-forest-green);
        }

        .saved-addr-content {
          flex: 1;
        }

        .saved-addr-top-line {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .addr-tag-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #075437;
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
        }

        .addr-recipient-name {
          font-size: 0.92rem;
          color: var(--charcoal);
        }

        .addr-phone {
          font-size: 0.82rem;
          color: #64748B;
        }

        .addr-full-text {
          font-size: 0.84rem;
          color: #4A5568;
          line-height: 1.4;
          margin: 0 0 10px 0;
        }

        .saved-addr-actions {
          display: flex;
          gap: 12px;
        }

        .btn-addr-action {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--deep-forest-green);
          cursor: pointer;
          padding: 0;
        }

        .btn-addr-action.delete {
          color: #E53E3E;
        }

        .no-address-box {
          text-align: center;
          padding: 30px 16px;
          background: #F8FAFC;
          border: 1.5px dashed #CBD5E0;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .no-address-box h4 {
          margin: 0;
          font-size: 1rem;
          color: var(--charcoal);
        }

        .no-address-box p {
          margin: 0;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        /* Address Form */
        .address-edit-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #FAF9F5;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 18px;
        }

        .form-mode-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid #E2E8F0;
        }

        .form-mode-title h4 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--charcoal);
          margin: 0;
        }

        .btn-link-sm {
          background: none;
          border: none;
          color: var(--deep-forest-green);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-grid-3 {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          gap: 14px;
        }

        @media (max-width: 600px) {
          .form-grid-2, .form-grid-3 {
            grid-template-columns: 1fr;
          }
        }

        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-field-label {
          font-size: 0.76rem;
          font-weight: 800;
          color: #4A5568;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .form-clean-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #CBD5E0;
          border-radius: 8px;
          font-size: 0.88rem;
          color: var(--charcoal);
          background: #FFFFFF;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .form-clean-input:focus {
          border-color: var(--deep-forest-green);
        }

        .address-type-pill-group {
          display: flex;
          gap: 8px;
        }

        .address-type-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          border: 1.5px solid #CBD5E0;
          background: #FFFFFF;
          color: #4A5568;
          cursor: pointer;
        }

        .address-type-btn.active {
          border-color: var(--deep-forest-green);
          background: #EFF8F4;
          color: var(--deep-forest-green);
        }

        .form-action-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 6px;
        }

        .btn-cancel-flat {
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #718096;
          background: none;
          border: none;
          cursor: pointer;
        }

        /* Delivery Slots */
        .delivery-slots-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .slot-option-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-color);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .slot-option-card.selected {
          border-color: var(--deep-forest-green);
          background: #EFF8F4;
        }

        .slot-radio-input {
          margin-top: 3px;
          cursor: pointer;
          accent-color: var(--deep-forest-green);
        }

        .slot-option-body {
          flex: 1;
        }

        .slot-header-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .slot-option-title {
          font-size: 0.92rem;
          color: var(--charcoal);
        }

        .slot-badge-tag {
          font-size: 0.68rem;
          font-weight: 800;
          background: #EDF2F7;
          color: #4A5568;
          padding: 2px 7px;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
        }

        .slot-badge-tag.express {
          background: var(--brand-yellow);
          color: var(--charcoal);
        }

        .slot-option-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin: 3px 0 0 0;
        }

        /* Payment Methods */
        .payment-methods-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .payment-method-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-color);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .payment-method-box.selected {
          border-color: var(--deep-forest-green);
          background: #EFF8F4;
        }

        .payment-radio-input {
          margin-top: 3px;
          cursor: pointer;
          accent-color: var(--deep-forest-green);
        }

        .payment-method-text {
          flex: 1;
        }

        .payment-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .payment-method-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--charcoal);
        }

        .payment-pill-tag {
          font-size: 0.68rem;
          font-weight: 800;
          background: #DEF7EC;
          color: #03543F;
          padding: 2px 7px;
          border-radius: var(--radius-pill);
        }

        .payment-method-desc {
          display: block;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .single-page-cta-bar {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }

        .guarantee-text-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #065F46;
          font-weight: 600;
        }

        .btn-final-checkout {
          font-size: 1.05rem;
          padding: 14px;
          box-shadow: 0 4px 14px rgba(7, 84, 55, 0.25);
        }

        /* Sidebar Cards */
        .sidebar-summary-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 20px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        }

        .coupon-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .coupon-box-header h4 {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--charcoal);
          margin: 0;
        }

        .coupon-input-form {
          display: flex;
          gap: 8px;
        }

        .coupon-text-input {
          flex: 1;
          padding: 8px 12px;
          border: 1.5px solid #CBD5E0;
          border-radius: 8px;
          font-size: 0.84rem;
          outline: none;
          text-transform: uppercase;
        }

        .coupon-text-input:focus {
          border-color: var(--deep-forest-green);
        }

        .btn-apply-coupon {
          padding: 8px 16px;
          background: var(--deep-forest-green);
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
        }

        .applied-coupon-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #EFF8F4;
          border: 1px solid #A7F3D0;
          padding: 8px 12px;
          border-radius: 8px;
        }

        .applied-code {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--deep-forest-green);
        }

        .applied-desc {
          font-size: 0.75rem;
          color: #065F46;
          margin-left: 8px;
        }

        .btn-remove-coupon {
          background: none;
          border: none;
          color: #E53E3E;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* Bill Card */
        .bill-card-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--charcoal);
          margin: 0 0 16px 0;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-light);
        }

        .bill-breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bill-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.88rem;
          color: #4A5568;
        }

        .bill-row.row-discount {
          color: #059669;
          font-weight: 700;
        }

        .badge-free-delivery {
          font-size: 0.72rem;
          font-weight: 800;
          color: #059669;
          background: #D1FAE5;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .bill-grand-total {
          border-top: 1.5px dashed #CBD5E0;
          padding-top: 12px;
          margin-top: 4px;
          font-size: 1.18rem;
          font-weight: 800;
          color: var(--charcoal);
        }

        .savings-highlight-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #DEF7EC;
          color: #03543F;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 8px 12px;
          border-radius: 8px;
          margin-top: 14px;
        }

        .delivery-destination-box, .selected-slot-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #FAF9F5;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 12px;
          margin-top: 12px;
        }

        .dest-title, .slot-mini-title {
          display: block;
          font-size: 0.8rem;
          color: var(--charcoal);
        }

        .dest-title.text-warning {
          color: #C05621;
        }

        .dest-text, .slot-mini-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 2px 0 0 0;
        }

        .empty-cart-card {
          text-align: center;
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
