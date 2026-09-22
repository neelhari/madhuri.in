import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle,
  Search,
  Plus,
  Minus,
  Save,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';

export const InventoryManager = () => {
  const { inventory, updateStock, products, categories } = useStoreData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState('all'); // 'all' | 'low' | 'out'
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Convert inventory map to array
  const inventoryList = Object.entries(inventory).map(([key, item]) => ({
    key,
    ...item
  }));

  const filteredInventory = inventoryList.filter((item) => {
    const matchesSearch =
      (item.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.weightLabel || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter;

    let matchesStatus = true;
    if (filterState === 'low') {
      matchesStatus = item.stockCount > 0 && item.stockCount <= 10;
    } else if (filterState === 'out') {
      matchesStatus = item.stockCount <= 0;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalStockUnits = inventoryList.reduce(
    (acc, curr) => acc + (curr.stockCount || 0),
    0
  );
  const lowStockCount = inventoryList.filter(
    (i) => i.stockCount > 0 && i.stockCount <= 10
  ).length;
  const outOfStockCount = inventoryList.filter((i) => i.stockCount <= 0).length;

  return (
    <div className="inventory-manager-container">
      {/* Top Metric Cards */}
      <div className="inventory-metric-row">
        <div className="inv-metric-card">
          <div className="inv-metric-icon bg-green">
            <Boxes size={22} color="#075437" />
          </div>
          <div className="inv-metric-text">
            <span className="inv-metric-value">{totalStockUnits}</span>
            <span className="inv-metric-label">Total Units in Stock</span>
          </div>
        </div>

        <div
          className={`inv-metric-card clickable ${
            filterState === 'low' ? 'active-filter' : ''
          }`}
          onClick={() => setFilterState(filterState === 'low' ? 'all' : 'low')}
        >
          <div className="inv-metric-icon bg-yellow">
            <AlertTriangle size={22} color="#D97706" />
          </div>
          <div className="inv-metric-text">
            <span className="inv-metric-value">{lowStockCount}</span>
            <span className="inv-metric-label">Low Stock Variants (&lt;10)</span>
          </div>
        </div>

        <div
          className={`inv-metric-card clickable ${
            filterState === 'out' ? 'active-filter' : ''
          }`}
          onClick={() => setFilterState(filterState === 'out' ? 'all' : 'out')}
        >
          <div className="inv-metric-icon bg-red">
            <AlertTriangle size={22} color="#DC2626" />
          </div>
          <div className="inv-metric-text">
            <span className="inv-metric-value">{outOfStockCount}</span>
            <span className="inv-metric-label">Out of Stock Variants</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="inv-control-bar">
        <div className="inv-search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search variant or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="inv-filters-group">
          <select
            className="inv-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="inv-status-pills">
            <button
              type="button"
              className={`status-pill ${filterState === 'all' ? 'active' : ''}`}
              onClick={() => setFilterState('all')}
            >
              All Variants ({inventoryList.length})
            </button>
            <button
              type="button"
              className={`status-pill ${filterState === 'low' ? 'active' : ''}`}
              onClick={() => setFilterState('low')}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              type="button"
              className={`status-pill ${filterState === 'out' ? 'active' : ''}`}
              onClick={() => setFilterState('out')}
            >
              Out of Stock ({outOfStockCount})
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inv-table-wrapper">
        <table className="inv-table">
          <thead>
            <tr>
              <th>Product & Variant</th>
              <th>Category</th>
              <th>Selling Price</th>
              <th>Status</th>
              <th className="th-center">Available Units</th>
              <th className="th-right">Quick Stock Adjustment</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-inv-cell">
                  <Boxes size={36} color="#A0AEC0" />
                  <p>No inventory items match your current filters.</p>
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => {
                const isOutOfStock = (item.stockCount || 0) <= 0;
                const isLowStock =
                  (item.stockCount || 0) > 0 && (item.stockCount || 0) <= 10;

                return (
                  <tr key={item.key} className="inv-row">
                    <td>
                      <div className="inv-item-details">
                        <span className="inv-prod-name">{item.productName}</span>
                        <span className="inv-weight-pill">
                          Pack: {item.weightLabel}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="cat-chip">{item.category}</span>
                    </td>

                    <td>
                      <span className="price-tag">₹{item.price}</span>
                    </td>

                    <td>
                      {isOutOfStock ? (
                        <span className="stock-badge badge-out">Out of Stock</span>
                      ) : isLowStock ? (
                        <span className="stock-badge badge-low">
                          Low Stock ({item.stockCount} left)
                        </span>
                      ) : (
                        <span className="stock-badge badge-healthy">
                          In Stock ({item.stockCount})
                        </span>
                      )}
                    </td>

                    <td className="td-center">
                      <input
                        type="number"
                        min="0"
                        className="stock-inline-input"
                        value={item.stockCount || 0}
                        onChange={(e) =>
                          updateStock(
                            item.productId,
                            item.weightId,
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td className="td-right">
                      <div className="quick-adjust-group">
                        <button
                          type="button"
                          className="adj-btn adj-minus"
                          onClick={() =>
                            updateStock(
                              item.productId,
                              item.weightId,
                              Math.max(0, (item.stockCount || 0) - 5)
                            )
                          }
                          title="Reduce 5 units"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          className="adj-btn adj-minus"
                          onClick={() =>
                            updateStock(
                              item.productId,
                              item.weightId,
                              Math.max(0, (item.stockCount || 0) - 1)
                            )
                          }
                          title="Reduce 1 unit"
                        >
                          <Minus size={13} />
                        </button>
                        <button
                          type="button"
                          className="adj-btn adj-plus"
                          onClick={() =>
                            updateStock(
                              item.productId,
                              item.weightId,
                              (item.stockCount || 0) + 1
                            )
                          }
                          title="Add 1 unit"
                        >
                          <Plus size={13} />
                        </button>
                        <button
                          type="button"
                          className="adj-btn adj-plus"
                          onClick={() =>
                            updateStock(
                              item.productId,
                              item.weightId,
                              (item.stockCount || 0) + 10
                            )
                          }
                          title="Add 10 units"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .inventory-manager-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .inventory-metric-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .inv-metric-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .inv-metric-card.clickable {
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .inv-metric-card.clickable:hover {
          border-color: #CBD5E0;
          transform: translateY(-1px);
        }

        .inv-metric-card.active-filter {
          border-color: #075437;
          background: #EFF8F4;
        }

        .inv-metric-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bg-green { background: #E6F4EA; }
        .bg-yellow { background: #FEF3C7; }
        .bg-red { background: #FEE2E2; }

        .inv-metric-text {
          display: flex;
          flex-direction: column;
        }

        .inv-metric-value {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1A202C;
          line-height: 1.1;
        }

        .inv-metric-label {
          font-size: 0.76rem;
          font-weight: 600;
          color: #718096;
          margin-top: 2px;
        }

        /* Control bar */
        .inv-control-bar {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .inv-search-wrap {
          position: relative;
          width: 280px;
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

        .inv-filters-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .inv-select {
          padding: 8px 12px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.82rem;
          outline: none;
          background: #FFFFFF;
        }

        .inv-status-pills {
          display: flex;
          gap: 4px;
        }

        .status-pill {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          background: #F7FAFC;
          color: #4A5568;
          border: 1px solid #E2E8F0;
          transition: all 0.15s ease;
        }

        .status-pill.active {
          background: #075437;
          color: #FFFFFF;
          border-color: #075437;
        }

        /* Table */
        .inv-table-wrapper {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow-x: auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .inv-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .inv-table th {
          background: #F8FAFC;
          padding: 12px 18px;
          font-size: 0.76rem;
          font-weight: 800;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid #E2E8F0;
        }

        .inv-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #EDF2F7;
          vertical-align: middle;
        }

        .inv-row:hover {
          background: #FDFEFE;
        }

        .inv-item-details {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .inv-prod-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: #1A202C;
        }

        .inv-weight-pill {
          font-size: 0.74rem;
          font-weight: 600;
          color: #4A5568;
          background: #EDF2F7;
          padding: 1px 6px;
          border-radius: 4px;
          width: fit-content;
        }

        .cat-chip {
          font-size: 0.75rem;
          font-weight: 600;
          color: #075437;
          background: #EFF8F4;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .price-tag {
          font-size: 0.88rem;
          font-weight: 800;
          color: #1A202C;
        }

        .stock-badge {
          display: inline-block;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 12px;
        }

        .badge-healthy {
          background: #DEF7EC;
          color: #03543F;
        }

        .badge-low {
          background: #FEF08A;
          color: #713F12;
        }

        .badge-out {
          background: #FEE2E2;
          color: #991B1B;
        }

        .th-center, .td-center {
          text-align: center;
        }

        .th-right, .td-right {
          text-align: right;
        }

        .stock-inline-input {
          width: 70px;
          text-align: center;
          padding: 6px;
          border: 1.5px solid #CBD5E0;
          border-radius: 6px;
          font-size: 0.92rem;
          font-weight: 800;
          color: #1A202C;
        }

        .stock-inline-input:focus {
          border-color: #075437;
          outline: none;
        }

        .quick-adjust-group {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
        }

        .adj-btn {
          padding: 5px 8px;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
          background: #F7FAFC;
          cursor: pointer;
          transition: all 0.12s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .adj-btn:hover {
          background: #EDF2F7;
          border-color: #CBD5E0;
        }

        .adj-minus { color: #C53030; }
        .adj-plus { color: #075437; }

        .empty-inv-cell {
          text-align: center;
          padding: 40px !important;
          color: #718096;
        }
      `}</style>
    </div>
  );
};
