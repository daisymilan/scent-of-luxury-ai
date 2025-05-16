
/**
 * WooCommerce Order API functions
 */
import { WooOrder } from './types';
import woo from '@/lib/api';

// Get a single order by ID
export const getOrderById = async (orderId: number): Promise<WooOrder> => {
  try {
    const response = await woo.get(`orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching WooCommerce order ${orderId}:`, error);
    throw error;
  }
};

// Create a new order in WooCommerce
export const createWooOrder = async (order: Partial<WooOrder>): Promise<WooOrder> => {
  try {
    const response = await woo.post('orders', order);
    return response.data;
  } catch (error) {
    console.error('Error creating WooCommerce order:', error);
    throw error;
  }
};

// Get all orders with pagination
export const getAllOrders = async (page = 1, perPage = 10): Promise<{
  orders: WooOrder[];
  totalPages: number;
}> => {
  try {
    const response = await woo.get('orders', {
      params: { page, per_page: perPage }
    });
    
    // Extract total pages from headers
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
    
    return {
      orders: response.data,
      totalPages
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      orders: [],
      totalPages: 0
    };
  }
};

// Update an existing order
export const updateOrder = async (
  id: number, 
  orderData: Partial<WooOrder>
): Promise<WooOrder | null> => {
  try {
    const response = await woo.put(`orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    return null;
  }
};
