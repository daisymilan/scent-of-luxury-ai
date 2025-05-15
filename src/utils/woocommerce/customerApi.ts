
/**
 * WooCommerce Customer API functions
 */
import { WooCommerceConfig, getWooCommerceConfig } from './config';
import { WooCustomer } from './types';
import { fetchWooCommerceData } from './apiClient';
import { supabase } from "@/integrations/supabase/client";

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

// Get customer by email
export const getCustomerByEmail = async (
  email: string,
  config?: WooCommerceConfig
): Promise<WooCustomer | null> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    // Search for customers by email
    const customers = await fetchWooCommerceData<WooCustomer[]>(`customers?email=${encodeURIComponent(email)}`, wooConfig);
    
    // Return the first customer that matches the email, or null if none found
    return customers && customers.length > 0 ? customers[0] : null;
  } catch (error) {
    console.error(`Error fetching WooCommerce customer by email ${email}:`, error);
    return null; // Return null instead of throwing to handle gracefully
  }
};

// Ensure WooCommerce ID field exists in database
export const ensureWooCommerceIdField = async () => {
  try {
    // Check if woocommerce_id column exists
    const { data, error } = await supabase
      .from('users')
      .select('woocommerce_id')
      .limit(1);
      
    if (error) {
      console.error('Error checking woocommerce_id column:', error);
      // If the column doesn't exist, we'll get a specific error
      if (error.message.includes('column "woocommerce_id" does not exist')) {
        console.warn('WooCommerce ID field missing - please contact your database administrator');
      }
    }
  } catch (err) {
    console.error('Exception checking woocommerce_id column:', err);
  }
};

// Update customer data
export const updateCustomer = async (
  customerId: number,
  customerData: Partial<WooCustomer>,
  config?: WooCommerceConfig
): Promise<WooCustomer> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    // Build the URL with authentication parameters
    const baseUrl = `${wooConfig.url}/wp-json/wc/v${wooConfig.version}/customers/${customerId}`;
    const url = new URL(baseUrl);
    url.searchParams.append('consumer_key', wooConfig.consumerKey);
    url.searchParams.append('consumer_secret', wooConfig.consumerSecret);
    
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error updating WooCommerce customer ${customerId}:`, errorText);
      throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating WooCommerce customer ${customerId}:`, error);
    throw error;
  }
};

// Create a new customer
export const createCustomer = async (
  customerData: Partial<WooCustomer>,
  config?: WooCommerceConfig
): Promise<WooCustomer> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    // Build the URL with authentication parameters
    const baseUrl = `${wooConfig.url}/wp-json/wc/v${wooConfig.version}/customers`;
    const url = new URL(baseUrl);
    url.searchParams.append('consumer_key', wooConfig.consumerKey);
    url.searchParams.append('consumer_secret', wooConfig.consumerSecret);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error creating WooCommerce customer:', errorText);
      throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating WooCommerce customer:', error);
    throw error;
  }
};
