
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

// Get credentials from environment variables with fallbacks
const API_URL = import.meta.env.VITE_WOOCOMMERCE_API_URL || 'https://staging.min.com/int';
const CONSUMER_KEY = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY || 'ck_83b6276178dfd425fb2618461bfb02aad3fd6d67';
const CONSUMER_SECRET = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET || 'cs_a9ffe2c31156740acaa6dc82c50489717cb6d4d7';

// Updated configuration with proper URL formatting - removing trailing slashes to ensure consistent URLs
export const HARDCODED_WOO_CONFIG: WooCommerceConfig | null = {
  url: API_URL.replace(/\/+$/, ''), // Remove trailing slashes
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
  version: '3'
};

// Export constants for direct use in components
export const WOO_API_VERSION = '3';
export const WOO_API_BASE_URL = `${HARDCODED_WOO_CONFIG.url}/wp-json/wc/v${WOO_API_VERSION}`;
export const WOO_API_CREDENTIALS = 'Basic ' + btoa(`${HARDCODED_WOO_CONFIG.consumerKey}:${HARDCODED_WOO_CONFIG.consumerSecret}`);
export const WOO_API_AUTH_PARAMS = `consumer_key=${HARDCODED_WOO_CONFIG.consumerKey}&consumer_secret=${HARDCODED_WOO_CONFIG.consumerSecret}`;

// Store credentials in localStorage (temporary solution)
export const saveWooCommerceConfig = (config: WooCommerceConfig) => {
  localStorage.setItem('woocommerce_config', JSON.stringify(config));
};

export const getWooCommerceConfig = (): WooCommerceConfig | null => {
  // Return hardcoded config first, if not available check localStorage
  const storedConfig = localStorage.getItem('woocommerce_config');
  return HARDCODED_WOO_CONFIG || (storedConfig ? JSON.parse(storedConfig) : null);
};

// Add a function to test the WooCommerce connection
export const testWooCommerceConnection = async (): Promise<boolean> => {
  const config = getWooCommerceConfig();
  if (!config) return false;
  
  try {
    const url = new URL(`${config.url}/wp-json/wc/v${config.version}/products`);
    url.searchParams.append('consumer_key', config.consumerKey);
    url.searchParams.append('consumer_secret', config.consumerSecret);
    url.searchParams.append('per_page', '1'); // Just get one product to test connection
    
    console.log('Testing WooCommerce connection to:', url.toString());
    
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('WooCommerce connection test error:', errorText);
    }
    
    return response.ok;
  } catch (error) {
    console.error('WooCommerce connection test failed:', error);
    return false;
  }
};
