
/**
 * WooCommerce API utility for interacting with the WooCommerce REST API
 */

// Import config first to avoid circular dependencies
import { 
  WOO_API_BASE_URL, 
  WOO_API_VERSION,
  HARDCODED_WOO_CONFIG,
  WooCommerceUIConfig,
  WooCommerceConfig
} from './config';

// Re-export everything from the individual files
export * from './config';
export * from './types';
export * from './api';
export * from './useWooProducts';
export * from './useWooOrders';
export * from './useWooCustomers';
export * from './useWooStats';
export * from './useB2BKing';
export * from './b2bkingApi';
export * from './hooks';

// Export direct access to the MIN API endpoint with correct URL
export const MIN_API_URL = 'https://staging.min.com/int';

// API endpoints for direct access
export const WOO_API_ENDPOINTS = {
  PRODUCTS: `${WOO_API_BASE_URL}/products`,
  ORDERS: `${WOO_API_BASE_URL}/orders`,
  CUSTOMERS: `${WOO_API_BASE_URL}/customers`,
  PRODUCT_VARIATIONS: (productId: number) => `${WOO_API_BASE_URL}/products/${productId}/variations`,
  B2BKING: {
    GROUPS: `${WOO_API_BASE_URL}/b2bking/groups`,
    USERS: `${WOO_API_BASE_URL}/b2bking/users`,
    RULES: `${WOO_API_BASE_URL}/b2bking/rules`,
  }
};
