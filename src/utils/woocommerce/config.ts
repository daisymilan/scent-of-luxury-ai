
/**
 * WooCommerce Configuration - Frontend portion only
 * 
 * This only handles feature flags and UI configuration,
 * all actual credential management is done on the server
 */

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
