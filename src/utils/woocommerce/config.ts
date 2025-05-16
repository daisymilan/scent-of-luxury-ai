
/**
 * WooCommerce Configuration - Frontend portion only
 * 
 * This only handles feature flags and UI configuration,
 * all actual credential management is done on the server
 */

// WooCommerce API base URL and version
export const WOO_API_BASE_URL = '/api/woocommerce'; // Now points to our backend proxy
export const WOO_API_VERSION = 'v3'; // WooCommerce API version

// WooCommerce feature flags - no credentials needed on frontend
export interface WooCommerceUIConfig {
  features: {
    productsEnabled: boolean;
    ordersEnabled: boolean;
    customersEnabled: boolean;
    b2bkingEnabled: boolean;
  };
}

// Default UI configuration
export const DEFAULT_UI_CONFIG: WooCommerceUIConfig = {
  features: {
    productsEnabled: true,
    ordersEnabled: true,
    customersEnabled: true,
    b2bkingEnabled: false
  }
};

// Hardcoded configuration for frontend reference only
// This doesn't include actual credentials
export const HARDCODED_WOO_CONFIG = {
  url: 'https://staging.min.com/int',
  consumerKey: '[Available on server only]',
  consumerSecret: '[Available on server only]',
  version: '3'
};

// Load UI configuration from localStorage if available
export const getWooCommerceUIConfig = (): WooCommerceUIConfig => {
  try {
    const stored = localStorage.getItem('woo_ui_config');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading WooCommerce UI config:', error);
  }
  
  return DEFAULT_UI_CONFIG;
};

// Save UI configuration to localStorage
export const saveWooCommerceUIConfig = (config: WooCommerceUIConfig): void => {
  try {
    localStorage.setItem('woo_ui_config', JSON.stringify(config));
  } catch (error) {
    console.error('Error saving WooCommerce UI config:', error);
  }
};

// For backward compatibility with existing code
export const getWooCommerceConfig = getWooCommerceUIConfig;
export const saveWooCommerceConfig = saveWooCommerceUIConfig;

// Authentication parameters for public API calls
export const WOO_API_AUTH_PARAMS = 'auth_handled_by_backend=true';

// Test if the connection is available (calls backend)
export const testWooCommerceConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/woocommerce/test-connection');
    return response.ok;
  } catch (error) {
    console.error('WooCommerce connection test failed:', error);
    return false;
  }
};
