
/**
 * WooCommerce Customer API functions
 */
import { WooCustomer } from './types';
import woo from '@/lib/api';

// Get a customer by ID
export const getCustomerById = async (id: number): Promise<WooCustomer | null> => {
  try {
    const response = await woo.get(`customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    return null;
  }
};

// Get a customer by email
export const getCustomerByEmail = async (email: string): Promise<WooCustomer | null> => {
  try {
    // Search for customer by email
    const response = await woo.get(`customers`, { 
      params: { email, per_page: 1 }
    });
    
    // If customer is found, return the first one
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching customer by email ${email}:`, error);
    return null;
  }
};

// Create a new customer
export const createCustomer = async (customerData: Partial<WooCustomer>): Promise<WooCustomer | null> => {
  try {
    const response = await woo.post('customers', customerData);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    return null;
  }
};

// Update an existing customer
export const updateCustomer = async (id: number, customerData: Partial<WooCustomer>): Promise<WooCustomer | null> => {
  try {
    const response = await woo.put(`customers/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error);
    return null;
  }
};

// Delete a customer
export const deleteCustomer = async (id: number): Promise<boolean> => {
  try {
    await woo.delete(`customers/${id}`, { params: { force: true } });
    return true;
  } catch (error) {
    console.error(`Error deleting customer ${id}:`, error);
    return false;
  }
};
