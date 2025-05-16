
/**
 * WooCommerce API Client
 * Handles the core API request functionality through our backend
 */
import apiClient from '@/lib/apiClient';

/**
 * Core function to fetch data from our backend API (which connects to WooCommerce)
 */
export const fetchWooCommerceData = async <T,>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> => {
  // Add proper error handling and retry logic
  const maxRetries = 2;
  let attempt = 0;
  let lastError: Error | null = null;
  
  while (attempt <= maxRetries) {
    try {
      console.log(`Fetching data (attempt ${attempt + 1}/${maxRetries + 1}): ${endpoint}`);
      
      // Make request to our backend API
      const response = await apiClient.get(`/woocommerce/${endpoint}`, { params });
      
      console.log(`Successfully fetched data for endpoint: ${endpoint}`);
      return response.data as T;
    } catch (error) {
      console.error(`API fetch error (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Add a small delay before retrying
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
      
      attempt++;
    }
  }
  
  throw lastError || new Error('Failed to fetch data after multiple attempts');
};

// Connection test function
export const testApiConnection = async (): Promise<boolean> => {
  try {
    // Try to fetch a single product to test the connection
    await apiClient.get('/woocommerce/status');
    console.log('API connection test successful');
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};
