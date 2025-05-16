
/**
 * Order API functions - Communicates with our backend
 */
import { WooOrder } from './types';
import apiClient from '@/lib/apiClient';

// Get a single order by ID
export const getOrderById = async (orderId: number): Promise<WooOrder> => {
  try {
    const response = await apiClient.get(`/woocommerce/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

// Create a new order
export const createWooOrder = async (order: Partial<WooOrder>): Promise<WooOrder> => {
  try {
    const response = await apiClient.post('/woocommerce/orders', order);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get all orders with pagination
export const getAllOrders = async (page = 1, perPage = 10): Promise<{
  orders: WooOrder[];
  totalPages: number;
}> => {
  try {
    const response = await apiClient.get('/woocommerce/orders', {
      params: { page, per_page: perPage }
    });
    
    return {
      orders: response.data.orders,
      totalPages: response.data.totalPages
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
    const response = await apiClient.put(`/woocommerce/orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    return null;
  }
};
