import React, { createContext, useContext, useState, useEffect } from 'react';
import { BRAND_INFO } from '../data/products';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
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
    const normalized = code.trim().toUpperCase();
    if (normalized === 'MADUR50') {
      setAppliedCoupon({ code: 'MADUR50', discount: 50, type: 'fixed', label: '₹50 Flat Off' });
      return { success: true, message: 'Coupon MADUR50 applied! Saved ₹50' };
    } else if (normalized === 'FRESH10') {
      setAppliedCoupon({ code: 'FRESH10', discount: 0.10, type: 'percentage', label: '10% Off' });
      return { success: true, message: 'Coupon FRESH10 applied! Saved 10%' };
    } else {
      return { success: false, message: 'Invalid coupon code. Try MADUR50 or FRESH10.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
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
      couponSavings = Math.min(appliedCoupon.discount, subtotal);
    } else if (appliedCoupon.type === 'percentage') {
      couponSavings = Math.round(subtotal * appliedCoupon.discount);
    }
  }

  const deliveryFee = subtotal === 0 ? 0 : (subtotal >= BRAND_INFO.freeDeliveryThreshold ? 0 : BRAND_INFO.deliveryFee);
  const grandTotal = Math.max(0, subtotal - couponSavings + deliveryFee);
  const totalSavings = productSavings + couponSavings;

  const freeDeliveryRemaining = Math.max(0, BRAND_INFO.freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / BRAND_INFO.freeDeliveryThreshold) * 100));

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
