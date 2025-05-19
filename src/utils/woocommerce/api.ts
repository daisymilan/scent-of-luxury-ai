
/**
 * WooCommerce API utility functions - now forwards to our backend proxy
 */
import { wooProxy } from './wooFetch';

// Re-export this function for backward compatibility
export const fetchWooCommerceData = async (endpoint: string, params: Record<string, any> = {}) => {
  try {
    // Make sure method is explicitly set to GET
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

// Add a POST function for completeness
export const postWooCommerceData = async (endpoint: string, data: Record<string, any> = {}) => {
  try {
    return await wooProxy({ 
      endpoint, 
      method: 'POST',
      data 
    });
  } catch (error) {
    console.error(`Error posting WooCommerce data to ${endpoint}:`, error);
    throw error;
  }
};

// Add PUT function
export const putWooCommerceData = async (endpoint: string, data: Record<string, any> = {}) => {
  try {
    return await wooProxy({ 
      endpoint, 
      method: 'PUT',
      data 
    });
  } catch (error) {
    console.error(`Error updating WooCommerce data at ${endpoint}:`, error);
    throw error;
  }
};

// Add DELETE function
export const deleteWooCommerceData = async (endpoint: string) => {
  try {
    return await wooProxy({ 
      endpoint, 
      method: 'DELETE'
    });
  } catch (error) {
    console.error(`Error deleting WooCommerce data at ${endpoint}:`, error);
    throw error;
  }
};
