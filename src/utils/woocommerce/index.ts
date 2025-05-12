
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

// Export direct access to the staging MIN API endpoint
export const MIN_API_URL = 'https://staging.min.com/int';

