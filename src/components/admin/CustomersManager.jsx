import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  MapPin,
  ShoppingBag,
  IndianRupee,
  Calendar,
  UserCheck
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { BRAND_INFO } from '../../data/products';

export const CustomersManager = () => {
  const { orders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');

  // Aggregate customers from orders + registered owner
  const customerMap = {};

  // Add default account
  customerMap[BRAND_INFO.phone] = {
    phone: BRAND_INFO.phone,
    name: BRAND_INFO.owner,
    area: 'Indiranagar, Bangalore',
    ordersCount: 0,
    totalSpent: 0,
    lastOrderDate: '2026-09-22T10:00:00.000Z',
    isRegisteredMember: true
  };

  orders.forEach((order) => {
    const phone = order.address?.phone || 'Unknown';
    if (!customerMap[phone]) {
      customerMap[phone] = {
        phone: phone,
        name: order.address?.name || 'Guest User',
        area: `${order.address?.area || ''}, ${order.address?.city || 'Bangalore'}`,
        ordersCount: 0,
        totalSpent: 0,
        lastOrderDate: order.createdAt,
        isRegisteredMember: false
      };
    }

    customerMap[phone].ordersCount += 1;
    customerMap[phone].totalSpent += order.summary?.total || 0;
    if (new Date(order.createdAt) > new Date(customerMap[phone].lastOrderDate)) {
      customerMap[phone].lastOrderDate = order.createdAt;
    }
  });

  const customersList = Object.values(customerMap);

  const filteredCustomers = customersList.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.area.toLowerCase().includes(q)
    );
  });

  const totalRevenue = customersList.reduce((acc, c) => acc + c.totalSpent, 0);

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="customers-manager-container">
      {/* Top Metric Cards */}
      <div className="customers-metrics-row">
        <div className="cust-metric-card">
          <div className="cust-metric-icon bg-blue">
            <Users size={22} color="#2B6CB0" />
          </div>
          <div className="cust-metric-text">
            <span className="cust-metric-val">{customersList.length}</span>
            <span className="cust-metric-lbl">Total Customers</span>
          </div>
        </div>

        <div className="cust-metric-card">
          <div className="cust-metric-icon bg-green">
            <ShoppingBag size={22} color="#075437" />
          </div>
          <div className="cust-metric-text">
            <span className="cust-metric-val">{orders.length}</span>
            <span className="cust-metric-lbl">Total Orders Placed</span>
          </div>
        </div>

        <div className="cust-metric-card">
          <div className="cust-metric-icon bg-yellow">
            <IndianRupee size={22} color="#B7791F" />
          </div>
          <div className="cust-metric-text">
            <span className="cust-metric-val">₹{totalRevenue}</span>
            <span className="cust-metric-lbl">Lifetime Customer Value</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="cust-control-bar">
        <div className="cust-search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search customers by name, phone or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <span className="results-count-tag">
          Showing {filteredCustomers.length} of {customersList.length} customers
        </span>
      </div>

      {/* Customers Table */}
      <div className="customers-table-wrapper">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Phone Number</th>
              <th>Delivery Area</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Last Active</th>
              <th>Membership</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-cust-cell">
                  <Users size={36} color="#A0AEC0" />
                  <p>No customers found matching your search.</p>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust, idx) => (
                <tr key={idx} className="customer-row">
                  <td>
                    <div className="cust-identity-cell">
                      <div className="cust-avatar-circle">
                        {cust.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="cust-name-text">{cust.name}</span>
                    </div>
                  </td>

                  <td>
                    <div className="cust-phone-cell">
                      <Phone size={13} color="#718096" />
                      <span>{cust.phone}</span>
                    </div>
                  </td>

                  <td>
                    <div className="cust-area-cell">
                      <MapPin size={13} color="#718096" />
                      <span>{cust.area}</span>
                    </div>
                  </td>

                  <td>
                    <span className="orders-count-badge">
                      {cust.ordersCount} orders
                    </span>
                  </td>

                  <td>
                    <span className="total-spent-tag">₹{cust.totalSpent}</span>
                  </td>

                  <td>
                    <span className="last-order-text">
                      {formatDate(cust.lastOrderDate)}
                    </span>
                  </td>

                  <td>
                    {cust.isRegisteredMember ? (
                      <span className="member-badge verified">
                        <UserCheck size={12} /> Member
                      </span>
                    ) : (
                      <span className="member-badge guest">Shopper</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .customers-manager-container {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .customers-metrics-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .cust-metric-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .cust-metric-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bg-blue { background: #EBF8FF; }
        .bg-green { background: #E6F4EA; }
        .bg-yellow { background: #FEF3C7; }

        .cust-metric-text {
          display: flex;
          flex-direction: column;
        }

        .cust-metric-val {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1A202C;
          line-height: 1.1;
        }

        .cust-metric-lbl {
          font-size: 0.76rem;
          font-weight: 600;
          color: #718096;
          margin-top: 2px;
        }

        /* Control Bar */
        .cust-control-bar {
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

        .cust-search-wrap {
          position: relative;
          width: 320px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #A0AEC0;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px 8px 36px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.86rem;
          outline: none;
        }

        .search-input:focus {
          border-color: #075437;
        }

        .results-count-tag {
          font-size: 0.78rem;
          color: #718096;
          font-weight: 600;
        }

        /* Customers Table */
        .customers-table-wrapper {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow-x: auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .customers-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .customers-table th {
          background: #F8FAFC;
          padding: 12px 18px;
          font-size: 0.76rem;
          font-weight: 800;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid #E2E8F0;
        }

        .customers-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #EDF2F7;
          vertical-align: middle;
        }

        .customer-row:hover {
          background: #FDFEFE;
        }

        .cust-identity-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cust-avatar-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #EFF8F4;
          color: #075437;
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cust-name-text {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1A202C;
        }

        .cust-phone-cell, .cust-area-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: #4A5568;
        }

        .orders-count-badge {
          font-size: 0.78rem;
          font-weight: 700;
          background: #EDF2F7;
          color: #2D3748;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .total-spent-tag {
          font-size: 0.9rem;
          font-weight: 800;
          color: #075437;
        }

        .last-order-text {
          font-size: 0.78rem;
          color: #718096;
        }

        .member-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
        }

        .member-badge.verified {
          background: #DEF7EC;
          color: #03543F;
        }

        .member-badge.guest {
          background: #EDF2F7;
          color: #4A5568;
        }

        .empty-cust-cell {
          text-align: center;
          padding: 40px !important;
          color: #718096;
        }
      `}</style>
    </div>
  );
};
