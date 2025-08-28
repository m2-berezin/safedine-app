import { fetchUserOrdersSecure } from './secureOrderClient';

/**
 * Fetches orders with proper authentication for both users and guests
 * @deprecated Use fetchUserOrdersSecure instead for better security
 */
export async function fetchUserOrders(userId: string | null) {
  console.warn('fetchUserOrders is deprecated, use fetchUserOrdersSecure instead');
  return fetchUserOrdersSecure(userId);
}