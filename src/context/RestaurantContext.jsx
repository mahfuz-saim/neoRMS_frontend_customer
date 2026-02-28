/* ─────────────────────────────────────────────────────────────────
   RestaurantContext

   Provides the currently-selected restaurant to all child components.
   Also exposes `allRestaurants` for the Explore page.

   Usage:
     const { currentRestaurant, setCurrentRestaurant } = useRestaurant();

   `currentRestaurant` shape (mirrors backend response):
   {
     id          : string
     name        : string
     tagline?    : string
     description?: string
     location?   : string
     contactInfo?: string
     bannerImage?: string
   }
   ───────────────────────────────────────────────────────────────── */

import React, { createContext, useContext, useState, useCallback } from 'react';

export const RestaurantContext = createContext(null);

export const RestaurantProvider = ({ children }) => {
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [allRestaurants,    setAllRestaurants    ] = useState([]);

  /** Clear the active restaurant (e.g. when navigating back to the explorer). */
  const clearCurrentRestaurant = useCallback(() => {
    setCurrentRestaurant(null);
  }, []);

  const value = {
    currentRestaurant,
    setCurrentRestaurant,
    allRestaurants,
    setAllRestaurants,
    clearCurrentRestaurant,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

/** Convenience hook */
export const useRestaurant = () => {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurant must be used inside <RestaurantProvider>');
  return ctx;
};
