import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const POPULAR_LOCATIONS = [
  { area: 'Indiranagar', city: 'Bangalore', pincode: '560038', time: '45-60 mins' },
  { area: 'Koramangala', city: 'Bangalore', pincode: '560034', time: '60-90 mins' },
  { area: 'HSR Layout', city: 'Bangalore', pincode: '560102', time: '60-90 mins' },
  { area: 'Whitefield', city: 'Bangalore', pincode: '560066', time: '75-90 mins' },
  { area: 'JP Nagar', city: 'Bangalore', pincode: '560078', time: '60-90 mins' },
  { area: 'Jayanagar', city: 'Bangalore', pincode: '560041', time: '60-90 mins' }
];

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_location');
      return saved ? JSON.parse(saved) : POPULAR_LOCATIONS[0];
    } catch {
      return POPULAR_LOCATIONS[0];
    }
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('madurfresh_location', JSON.stringify(currentLocation));
    } catch (e) {
      console.error('Failed to save location', e);
    }
  }, [currentLocation]);

  const selectLocation = (loc) => {
    setCurrentLocation(loc);
    setIsLocationModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        selectLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        popularLocations: POPULAR_LOCATIONS
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
