import React, { useState } from 'react';
import { X, MapPin, Search, Check, Clock } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

export const LocationModal = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    currentLocation,
    selectLocation,
    popularLocations
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [customPincode, setCustomPincode] = useState('');

  if (!isLocationModalOpen) return null;

  const filteredLocations = popularLocations.filter(
    (loc) =>
      loc.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.pincode.includes(searchQuery)
  );

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customPincode.trim().length === 6) {
      selectLocation({
        area: 'Bangalore Delivery Zone',
        city: 'Bangalore',
        pincode: customPincode.trim(),
        time: '60-90 mins'
      });
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => setIsLocationModalOpen(false)}
    >
      <div
        className="modal-content location-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="location-modal-header">
          <div className="location-modal-title-wrap">
            <MapPin size={22} color="var(--primary-green)" />
            <div>
              <h3 className="location-modal-title">Select Delivery Area</h3>
              <p className="location-modal-subtitle">
                Express 90-min delivery available in Bangalore
              </p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setIsLocationModalOpen(false)}
            aria-label="Close location selector"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search / Pincode Input */}
        <div className="location-search-wrap">
          <Search size={16} className="loc-search-icon" />
          <input
            type="text"
            placeholder="Search area or enter 6-digit pincode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="location-search-input"
          />
        </div>

        {/* Popular Locations */}
        <div className="popular-locations-section">
          <span className="loc-section-label">Popular Delivery Hubs</span>
          <div className="locations-list">
            {filteredLocations.map((loc) => {
              const isSelected =
                currentLocation.pincode === loc.pincode &&
                currentLocation.area === loc.area;

              return (
                <div
                  key={loc.pincode}
                  className={`location-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => selectLocation(loc)}
                >
                  <div className="loc-item-icon">
                    <MapPin size={16} />
                  </div>
                  <div className="loc-item-info">
                    <span className="loc-item-area">{loc.area}</span>
                    <span className="loc-item-city">
                      {loc.city} - {loc.pincode}
                    </span>
                  </div>
                  <div className="loc-item-meta">
                    <span className="loc-time-tag">
                      <Clock size={12} />
                      {loc.time}
                    </span>
                    {isSelected && <Check size={18} className="selected-check" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Pincode Form */}
        <form onSubmit={handleCustomSubmit} className="custom-pincode-form">
          <span className="loc-section-label">Or enter custom Bangalore pincode</span>
          <div className="pincode-input-row">
            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 560001"
              value={customPincode}
              onChange={(e) => setCustomPincode(e.target.value.replace(/\D/g, ''))}
              className="pincode-input"
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={customPincode.length !== 6}
            >
              Check
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .location-modal-content {
          max-width: 460px;
          padding: 22px;
        }

        .location-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .location-modal-title-wrap {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .location-modal-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--primary-green);
          line-height: 1.2;
        }

        .location-modal-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .location-search-wrap {
          position: relative;
          margin-bottom: 16px;
        }

        .loc-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--primary-green);
          pointer-events: none;
        }

        .location-search-input {
          width: 100%;
          padding: 10px 14px 10px 38px;
          background-color: var(--bg-main);
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }

        .location-search-input:focus {
          border-color: var(--primary-green);
          outline: none;
          background-color: #FFFFFF;
        }

        .loc-section-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 8px;
        }

        .locations-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 18px;
          max-height: 240px;
          overflow-y: auto;
        }

        .location-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-color);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .location-item:hover {
          background-color: var(--surface-light-green);
          border-color: var(--secondary-green);
        }

        .location-item.selected {
          background-color: #EDF6EA;
          border-color: var(--primary-green);
        }

        .loc-item-icon {
          color: var(--primary-green);
        }

        .loc-item-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .loc-item-area {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .loc-item-city {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .loc-item-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .loc-time-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary-green);
          background: var(--surface-light-green);
          padding: 2px 6px;
          border-radius: var(--radius-pill);
        }

        .selected-check {
          color: var(--primary-green);
        }

        .custom-pincode-form {
          border-top: 1px solid var(--border-color);
          padding-top: 14px;
        }

        .pincode-input-row {
          display: flex;
          gap: 8px;
        }

        .pincode-input {
          flex: 1;
          padding: 8px 12px;
          background: var(--bg-main);
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }

        .pincode-input:focus {
          border-color: var(--primary-green);
          outline: none;
          background: #FFFFFF;
        }
      `}</style>
    </div>
  );
};
