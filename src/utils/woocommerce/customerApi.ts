
/**
 * WooCommerce Customer API functions
 */
import { WooCommerceConfig, getWooCommerceConfig } from './config';
import { WooCustomer } from './types';
import { fetchWooCommerceData } from './apiClient';

// Get a single customer by ID
export const getCustomerById = async (
  customerId: number,
  config?: WooCommerceConfig
): Promise<WooCustomer> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    return await fetchWooCommerceData<WooCustomer>(`customers/${customerId}`, wooConfig);
  } catch (error) {
    console.error(`Error fetching WooCommerce customer ${customerId}:`, error);
    throw error;
  }
};
