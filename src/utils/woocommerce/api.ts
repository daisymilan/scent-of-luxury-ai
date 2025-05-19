
/**
 * WooCommerce API utility functions - now forwards to our backend proxy
 */
import { wooProxy } from './wooFetch';

// Re-export this function for backward compatibility
export const fetchWooCommerceData = async (endpoint: string, params: Record<string, any> = {}) => {
  try {
    // For orders endpoint, always use GET regardless of what method is specified
    const method = endpoint.includes('orders') ? 'GET' : 'GET';
    
    return await wooProxy({ 
      endpoint, 
      method,
      params 
    });
  } catch (error) {
    console.error(`Error fetching WooCommerce data from ${endpoint}:`, error);
    throw error;
  }
};

// Add a POST function for completeness - but ensure orders always uses GET
export const postWooCommerceData = async (endpoint: string, data: Record<string, any> = {}) => {
  try {
    const method = endpoint.includes('orders') ? 'GET' : 'POST';
    
    // If sending to orders endpoint, convert data to params for GET
    if (endpoint.includes('orders')) {
      return await wooProxy({ 
        endpoint, 
        method: 'GET',
        params: data
      });
    }
    
    return await wooProxy({ 
      endpoint, 
      method,
      data 
    });
  } catch (error) {
    console.error(`Error posting WooCommerce data to ${endpoint}:`, error);
    throw error;
  }
};

// Add PUT function - with orders endpoint safety
export const putWooCommerceData = async (endpoint: string, data: Record<string, any> = {}) => {
  try {
    const method = endpoint.includes('orders') ? 'GET' : 'PUT';
    
    // If sending to orders endpoint, convert data to params for GET
    if (endpoint.includes('orders')) {
      return await wooProxy({ 
        endpoint, 
        method: 'GET',
        params: data
      });
    }
    
    return await wooProxy({ 
      endpoint, 
      method,
      data 
    });
  } catch (error) {
    console.error(`Error updating WooCommerce data at ${endpoint}:`, error);
    throw error;
  }
};

// Add DELETE function - with orders endpoint safety
export const deleteWooCommerceData = async (endpoint: string) => {
  try {
    const method = endpoint.includes('orders') ? 'GET' : 'DELETE';
    
    return await wooProxy({ 
      endpoint, 
      method
    });
  } catch (error) {
    console.error(`Error deleting WooCommerce data at ${endpoint}:`, error);
    throw error;
  }
};
