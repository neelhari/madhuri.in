import React, { createContext, useContext, useState, useEffect } from 'react';
import { BRAND_INFO } from '../data/products';
import { useStoreData } from './StoreDataContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { storeSettings, coupons } = useStoreData();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('madurfresh_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, weightId, quantity = 1) => {
    const selectedWeight = product.weights.find(w => w.id === weightId) || product.weights[0];
    const key = `${product.id}_${selectedWeight.id}`;

    setCartItems(prev => {
      const existing = prev.find(item => item.key === key);
      if (existing) {
        return prev.map(item =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          product,
          weightId: selectedWeight.id,
          weight: selectedWeight,
          quantity
        }
      ];
    });
  };

  const updateQuantity = (productId, weightId, newQty) => {
    const key = `${productId}_${weightId}`;
    if (newQty <= 0) {
      removeFromCart(productId, weightId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.key === key ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (productId, weightId) => {
    const key = `${productId}_${weightId}`;
    setCartItems(prev => prev.filter(item => item.key !== key));
  };

  const getItemQuantity = (productId, weightId) => {
    const key = `${productId}_${weightId}`;
    const found = cartItems.find(item => item.key === key);
    return found ? found.quantity : 0;
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code) => {
    const normalized = (code || '').trim().toUpperCase();
    if (!normalized) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    // Check dynamic coupons from database / admin panel
    const matchedCoupon = coupons?.find(
      (c) => c.code.toUpperCase() === normalized && c.isActive
    );

    if (matchedCoupon) {
      if (matchedCoupon.minOrderValue && subtotal < matchedCoupon.minOrderValue) {
        return {
          success: false,
          message: `Minimum order value of ₹${matchedCoupon.minOrderValue} required for this coupon.`
        };
      }

      setAppliedCoupon({
        code: matchedCoupon.code,
        discount: matchedCoupon.discountValue,
        type: matchedCoupon.discountType === 'percent' ? 'percentage' : 'fixed',
        label:
          matchedCoupon.discountType === 'percent'
            ? `${matchedCoupon.discountValue}% Off`
            : `₹${matchedCoupon.discountValue} Flat Off`
      });

      return {
        success: true,
        message: `Coupon ${matchedCoupon.code} applied successfully!`
      };
    }

    // Fallback default coupons
    if (normalized === 'MADUR50') {
      setAppliedCoupon({ code: 'MADUR50', discount: 50, type: 'fixed', label: '₹50 Flat Off' });
      return { success: true, message: 'Coupon MADUR50 applied! Saved ₹50' };
    } else if (normalized === 'FRESH10') {
      setAppliedCoupon({ code: 'FRESH10', discount: 10, type: 'percentage', label: '10% Off' });
      return { success: true, message: 'Coupon FRESH10 applied! Saved 10%' };
    } else {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const activeDeliveryThreshold =
    storeSettings?.freeDeliveryThreshold !== undefined
      ? Number(storeSettings.freeDeliveryThreshold)
      : BRAND_INFO.freeDeliveryThreshold;

  const activeDeliveryFee =
    storeSettings?.deliveryFee !== undefined
      ? Number(storeSettings.deliveryFee)
      : BRAND_INFO.deliveryFee;

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.weight.price * item.quantity,
    0
  );

  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.weight.originalPrice * item.quantity,
    0
  );

  const productSavings = Math.max(0, originalTotal - subtotal);

  let couponSavings = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'fixed') {
      couponSavings = Math.min(Number(appliedCoupon.discount) || 0, subtotal);
    } else if (appliedCoupon.type === 'percentage') {
      const pct = (Number(appliedCoupon.discount) || 0) / 100;
      couponSavings = Math.round(subtotal * pct);
    }
  }

  const deliveryFee = subtotal === 0 ? 0 : (subtotal >= activeDeliveryThreshold ? 0 : activeDeliveryFee);
  const grandTotal = Math.max(0, subtotal - couponSavings + deliveryFee);
  const totalSavings = productSavings + couponSavings;

  const freeDeliveryRemaining = Math.max(0, activeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / (activeDeliveryThreshold || 1)) * 100));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        getItemQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        itemCount,
        subtotal,
        originalTotal,
        productSavings,
        couponSavings,
        deliveryFee,
        grandTotal,
        totalSavings,
        freeDeliveryRemaining,
        freeDeliveryProgress
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
