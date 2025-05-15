
/**
 * WooCommerce API utility functions
 * 
 * This file re-exports all API functions from their modular files
 */

// Re-export the API client functions
export * from './apiClient';

// Re-export product-related API functions
export * from './productApi';

// Re-export order-related API functions
export * from './orderApi';

// Re-export customer-related API functions
export * from './customerApi';

// Re-export B2BKing-related API functions
export * from './b2bkingApi';

// Re-export testWooCommerceConnection from config.ts with a specific name
// This ensures we don't have conflicts with the one from apiClient.ts
export { testWooCommerceConnection } from './config';

