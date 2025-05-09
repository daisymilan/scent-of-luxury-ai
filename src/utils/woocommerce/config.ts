
/**
 * WooCommerce API Configuration
 */

// WooCommerce API Configuration Types
export interface WooCommerceConfig {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  version: string;
}

// Hardcoded configuration for immediate use with Min.com
export const HARDCODED_WOO_CONFIG: WooCommerceConfig | null = {
  url: 'https://staging.min.com/int',
  consumerKey: 'ck_83b6276178dfd425fb2618461bfb02aad3fd6d67',
  consumerSecret: 'cs_a9ffe2c31156740acaa6dc82c50489717cb6d4d7',
  version: '3'
};

// Export constants for direct use in components
export const WOO_API_BASE_URL = 'https://staging.min.com/int/wp-json/wc/v3';
export const WOO_API_CREDENTIALS = 'Basic ' + btoa(`${HARDCODED_WOO_CONFIG.consumerKey}:${HARDCODED_WOO_CONFIG.consumerSecret}`);
export const WOO_API_AUTH_PARAMS = `consumer_key=${HARDCODED_WOO_CONFIG.consumerKey}&consumer_secret=${HARDCODED_WOO_CONFIG.consumerSecret}`;

// Store credentials in localStorage (temporary solution)
export const saveWooCommerceConfig = (config: WooCommerceConfig) => {
  localStorage.setItem('woocommerce_config', JSON.stringify(config));
};

export const getWooCommerceConfig = (): WooCommerceConfig | null => {
  // Return hardcoded config first, if not available check localStorage
  return HARDCODED_WOO_CONFIG || 
    (localStorage.getItem('woocommerce_config') ? 
      JSON.parse(localStorage.getItem('woocommerce_config')!) : null);
};
