
/**
 * WooCommerce API Client
 * Handles the core API request functionality
 */
import { WooCommerceConfig, getWooCommerceConfig } from './config';
import woo from '@/lib/api';

/**
 * Core function to fetch data from WooCommerce API with retry logic
 */
export const fetchWooCommerceData = async <T,>(
  endpoint: string,
  config?: WooCommerceConfig
): Promise<T> => {
  // Add proper error handling and retry logic
  const maxRetries = 2;
  let attempt = 0;
  let lastError: Error | null = null;
  
  while (attempt <= maxRetries) {
    try {
      console.log(`Fetching WooCommerce data (attempt ${attempt + 1}/${maxRetries + 1}): ${endpoint}`);
      
      // Use the woo client directly instead of constructing our own fetch call
      const response = await woo.get(endpoint);
      
      console.log(`Successfully fetched data for endpoint: ${endpoint}`);
      return response.data as T;
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
  try {
    // Try to fetch a single product to test the connection
    await woo.get('products?per_page=1');
    return true;
  } catch (error) {
    console.error('WooCommerce connection test failed:', error);
    return false;
  }
};
