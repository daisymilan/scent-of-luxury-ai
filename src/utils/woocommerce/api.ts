
/**
 * WooCommerce API utility functions - now forwards to our backend proxy
 */
import { wooProxy } from './wooFetch';

// Re-export this function for backward compatibility
export const fetchWooCommerceData = async (endpoint: string, params: Record<string, any> = {}) => {
  try {
    // API calls now go through our backend proxy
    return await wooProxy({ 
      endpoint, 
      method: 'GET',
      params 
    });
  } catch (error) {
    console.error(`Error fetching WooCommerce data from ${endpoint}:`, error);
    throw error;
  }
};
