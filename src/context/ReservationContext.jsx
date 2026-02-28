import React, { createContext, useState } from 'react';

export const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [currentReservation, setCurrentReservation] = useState(null);

  const value = {
    reservations,
    setReservations,
    currentReservation,
    setCurrentReservation,
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};
