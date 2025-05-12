
/**
 * WooCommerce Order API functions
 */
import { WooCommerceConfig, getWooCommerceConfig } from './config';
import { WooOrder } from './types';
import { fetchWooCommerceData } from './apiClient';

// Get a single order by ID
export const getOrderById = async (
  orderId: number,
  config?: WooCommerceConfig
): Promise<WooOrder> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    return await fetchWooCommerceData<WooOrder>(`orders/${orderId}`, wooConfig);
  } catch (error) {
    console.error(`Error fetching WooCommerce order ${orderId}:`, error);
    throw error;
  }
};

// Create a new order in WooCommerce
export const createWooOrder = async (
  order: Partial<WooOrder>,
  config?: WooCommerceConfig
): Promise<WooOrder> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    return await fetchWooCommerceData<WooOrder>(
      'orders',
      wooConfig
    );
  } catch (error) {
    console.error('Error creating WooCommerce order:', error);
    throw error;
  }
};
