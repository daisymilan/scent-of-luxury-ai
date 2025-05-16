/**
 * WooCommerce Configuration - Frontend portion only
 * 
 * This only handles feature flags and UI configuration,
 * all actual credential management is done on the server
 */

// WooCommerce API base URL and version
export const WOO_API_BASE_URL = '/api/woocommerce'; // Points to our backend proxy
export const WOO_API_VERSION = 'v3'; // WooCommerce API version

// WooCommerce feature flags - no credentials needed on frontend
export interface WooCommerceUIConfig {
  features: {
    productsEnabled: boolean;
    ordersEnabled: boolean;
    customersEnabled: boolean;
    b2bkingEnabled: boolean;
  };
  url?: string;
  consumerKey?: string;
  consumerSecret?: string;
  version?: string;
}

export interface WooCommerceConfig {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  version: string;
  features?: {
    productsEnabled: boolean;
    ordersEnabled: boolean;
    customersEnabled: boolean;
    b2bkingEnabled: boolean;
  };
}

export const DEFAULT_UI_CONFIG: WooCommerceUIConfig = {
  features: {
    productsEnabled: true,
    ordersEnabled: true,
    customersEnabled: true,
    b2bkingEnabled: false
  }
};

export const HARDCODED_WOO_CONFIG: WooCommerceConfig = {
  url: 'https://staging.min.com/int',
  consumerKey: '[Available on server only]',
  consumerSecret: '[Available on server only]',
  version: '3',
  features: {
    productsEnabled: true,
    ordersEnabled: true,
    customersEnabled: true,
    b2bkingEnabled: false
  }
};

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

export const saveWooCommerceUIConfig = (config: WooCommerceUIConfig): void => {
  try {
    localStorage.setItem('woo_ui_config', JSON.stringify(config));
  } catch (error) {
    console.error('Error saving WooCommerce UI config:', error);
  }
};

export const getWooCommerceConfig = (): WooCommerceConfig => {
  return HARDCODED_WOO_CONFIG;
};

export const saveWooCommerceConfig = (config: WooCommerceConfig): void => {
  saveWooCommerceUIConfig({
    features: config.features || DEFAULT_UI_CONFIG.features,
    url: config.url,
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret,
    version: config.version
  });
};

export const WOO_API_AUTH_PARAMS = 'auth_handled_by_backend=true';

export const testWooCommerceConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/woocommerce/test-connection');
    return response.ok;
  } catch (error) {
    console.error('WooCommerce connection test failed:', error);
    return false;
  }
};
