
/**
 * WooCommerce API Client
 * Handles the core API request functionality
 */
import { WooCommerceConfig, getWooCommerceConfig } from './config';

/**
 * Core function to fetch data from WooCommerce API with retry logic
 */
export const fetchWooCommerceData = async <T,>(
  endpoint: string,
  config: WooCommerceConfig
): Promise<T> => {
  // Add proper error handling and retry logic
  const maxRetries = 2;
  let attempt = 0;
  let lastError: Error | null = null;
  
  while (attempt <= maxRetries) {
    try {
      // Build the URL differently - use URL parameters instead of query parameters
      // This can help with some server configurations that don't handle query parameters well
      const baseUrl = `${config.url}/wp-json/wc/v${config.version}/${endpoint}`;
      const url = new URL(baseUrl);
      
      // Add authentication parameters
      url.searchParams.append('consumer_key', config.consumerKey);
      url.searchParams.append('consumer_secret', config.consumerSecret);
      
      console.log(`Fetching WooCommerce data (attempt ${attempt + 1}/${maxRetries + 1}): ${endpoint}`);
      
      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Adding cache: 'no-store' to prevent caching issues
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error response for ${endpoint}:`, errorText);
        throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched data for endpoint: ${endpoint}`, data);
      return data as T;
    } catch (error) {
      console.error(`WooCommerce API fetch error (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Add a small delay before retrying
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
      
      attempt++;
    }
  }
  
  throw lastError || new Error('Failed to fetch WooCommerce data after multiple attempts');
};

// Renamed from testWooCommerceConnection to avoid conflict with config.ts
export const testApiConnection = async (config?: WooCommerceConfig): Promise<boolean> => {
  const wooConfig = config || getWooCommerceConfig();
  
  if (!wooConfig) {
    return false;
  }
  
  try {
    // Try to fetch a single product to test the connection
    await fetchWooCommerceData<unknown>('products?per_page=1', wooConfig);
    return true;
  } catch (error) {
    console.error('WooCommerce connection test failed:', error);
    return false;
  }
};
