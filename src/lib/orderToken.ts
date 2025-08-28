// Utility functions for secure guest order token management

/**
 * Generates a secure random token for guest orders
 */
export function generateOrderToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Stores order token in localStorage for guest orders
 */
export function storeGuestOrderToken(orderId: string, token: string): void {
  const guestTokens = getGuestOrderTokens();
  guestTokens[orderId] = token;
  localStorage.setItem('safedine.guestOrderTokens', JSON.stringify(guestTokens));
}

/**
 * Retrieves all guest order tokens from localStorage
 */
export function getGuestOrderTokens(): Record<string, string> {
  try {
    const tokens = localStorage.getItem('safedine.guestOrderTokens');
    return tokens ? JSON.parse(tokens) : {};
  } catch {
    return {};
  }
}

/**
 * Gets token for a specific guest order
 */
export function getGuestOrderToken(orderId: string): string | null {
  const tokens = getGuestOrderTokens();
  return tokens[orderId] || null;
}

/**
 * Removes a guest order token (cleanup)
 */
export function removeGuestOrderToken(orderId: string): void {
  const tokens = getGuestOrderTokens();
  delete tokens[orderId];
  localStorage.setItem('safedine.guestOrderTokens', JSON.stringify(tokens));
}