
/**
 * WooCommerce API utility for interacting with the WooCommerce REST API
 */

// Re-export everything from the individual files
export * from './config';
export * from './types';
export * from './api';
export * from './useProducts';
export * from './useOrders';
export * from './useCustomers';
export * from './useStats';
export * from './hooks';

// Export direct access to the MIN API endpoint with correct URL
export const MIN_API_URL = 'https://staging.min.com/int';

// Export constants for convenient access
export const WOO_API_VERSION = '3';
export const WOO_API_BASE_URL = `${MIN_API_URL}/wp-json/wc/v${WOO_API_VERSION}`;

// API endpoints for direct access
export const WOO_API_ENDPOINTS = {
  PRODUCTS: `${WOO_API_BASE_URL}/products`,
  ORDERS: `${WOO_API_BASE_URL}/orders`,
  CUSTOMERS: `${WOO_API_BASE_URL}/customers`,
  PRODUCT_VARIATIONS: (productId: number) => `${WOO_API_BASE_URL}/products/${productId}/variations`
};
