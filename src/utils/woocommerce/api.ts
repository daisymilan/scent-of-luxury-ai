
/**
 * WooCommerce API utility functions - now forwards to our backend proxy
 */
import apiClient from '@/lib/apiClient';
import { WOO_API_BASE_URL } from './config';

// Re-export this function for backward compatibility
export const fetchWooCommerceData = async (endpoint: string, params: Record<string, any> = {}) => {
  try {
    // API calls now go through our backend proxy
    const fullEndpoint = endpoint.startsWith('/') 
      ? `${WOO_API_BASE_URL}${endpoint}`
      : `${WOO_API_BASE_URL}/${endpoint}`;
      
    const response = await apiClient.get(fullEndpoint, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching WooCommerce data from ${endpoint}:`, error);
    throw error;
  }
};
