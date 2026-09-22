import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, SupabaseDB } from '../lib/supabaseClient';

const OrderContext = createContext();

const INITIAL_DEMO_ORDERS = [
  {
    id: 'MF-89241',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    status: 'Out for Delivery',
    statusCode: 4,
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

  // Sync from Supabase on mount
  useEffect(() => {
    async function loadRemoteOrders() {
      try {
        const remote = await SupabaseDB.fetchTable('orders', orders);
        if (remote && remote.length > 0) {
          setOrders(remote);
        }
      } catch (e) {
        console.warn('Orders Supabase sync skipped:', e);
      }
    }
    loadRemoteOrders();
  }, []);

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
    SupabaseDB.upsertRecord('orders', newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus, newStatusCode) => {
    setOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            statusCode: newStatusCode !== undefined ? newStatusCode : order.statusCode
          };
        }
        return order;
      });

      const target = updated.find(o => o.id === orderId);
      if (target) SupabaseDB.upsertRecord('orders', target);
      return updated;
    });
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    SupabaseDB.deleteRecord('orders', 'id', orderId);
  };

  const getOrderById = (id) => orders.find(o => o.id === id);

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        placeOrder,
        getOrderById,
        updateOrderStatus,
        deleteOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
