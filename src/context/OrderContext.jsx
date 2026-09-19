import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

const INITIAL_DEMO_ORDERS = [
  {
    id: 'MF-89241',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    status: 'Out for Delivery',
    statusCode: 4, // 1: Placed, 2: Confirmed, 3: Preparing, 4: Out for Delivery, 5: Delivered
    estimatedDelivery: 'In 25 minutes',
    address: {
      name: 'Sindhusha G',
      phone: '+91 98765 43210',
      line1: 'Flat 402, Green Orchid Apartments',
      area: 'Indiranagar',
      city: 'Bangalore',
      pincode: '560038',
      type: 'Home'
    },
    items: [
      {
        productId: 'mf-chk-01',
        name: 'Fresh Chicken Curry Cut (Skinless)',
        weight: '500 g',
        price: 175,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=300&q=80'
      },
      {
        productId: 'mf-sea-01',
        name: 'Fresh White Prawns (Cleaned & Deveined)',
        weight: '500 g',
        price: 499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=300&q=80'
      }
    ],
    summary: {
      subtotal: 849,
      discount: 170,
      deliveryFee: 0,
      total: 849
    },
    paymentMethod: 'UPI (Google Pay)',
    paymentStatus: 'Paid'
  }
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_orders');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  });

  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('madurfresh_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  const placeOrder = ({ items, address, deliverySlot, paymentMethod, summary }) => {
    const randomId = `MF-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: randomId,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      statusCode: 2,
      estimatedDelivery: deliverySlot || 'Express (45-60 mins)',
      address,
      items,
      summary,
      paymentMethod,
      paymentStatus: paymentMethod.includes('Cash') ? 'Pending' : 'Paid'
    };

    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    return newOrder;
  };

  const getOrderById = (id) => orders.find(o => o.id === id);

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        placeOrder,
        getOrderById
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
