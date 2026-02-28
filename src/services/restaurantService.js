/* ─────────────────────────────────────────────────────────────────
   Restaurant Service — all restaurant-related API calls.
   Uses the same apiFetch helper and BASE_URL as authService.
   ───────────────────────────────────────────────────────────────── */

import { apiFetch } from './authService';

/**
 * Fetch all restaurants.
 * GET /restaurant
 */
export const getAllRestaurants = () => apiFetch('/restaurant');

/**
 * Fetch a single restaurant by its ID.
 * GET /restaurant/:id
 */
export const getRestaurantById = (id) => apiFetch(`/restaurant/${id}`);

/**
 * Fetch menu products for a specific restaurant.
 * GET /menuProduct/:restaurantId
 *
 * Unwraps the backend envelope { success, data: [...] } and returns the
 * items array directly so callers never need to deal with wrapper objects.
 */
export const getRestaurantMenu = (restaurantId) =>
  apiFetch(`/menuProduct/${restaurantId}`).then((res) => {
    // Backend may return the array directly, or wrap it:
    // { success, data: [...] }  /  { items: [...] }  /  { menu: [...] }  etc.
    if (Array.isArray(res)) return res;
    return res?.data ?? res?.items ?? res?.menu ?? res?.menuProducts ?? [];
  });
