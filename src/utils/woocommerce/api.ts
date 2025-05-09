
/**
 * WooCommerce API utility functions
 */
import { WooCommerceConfig, getWooCommerceConfig } from './config';
import { WooProduct, WooOrder } from './types';

// API Request functions
export const fetchWooCommerceData = async <T,>(
  endpoint: string,
  config: WooCommerceConfig
): Promise<T> => {
  // Try both authentication methods
  try {
    // First try query parameter authentication (more reliable for some servers)
    const response = await fetch(
      `${config.url}/wp-json/wc/v${config.version}/${endpoint}${endpoint.includes('?') ? '&' : '?'}consumer_key=${config.consumerKey}&consumer_secret=${config.consumerSecret}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('WooCommerce API fetch error with query params:', error);
    
    // Fall back to Basic Auth if query params fail
    try {
      const credentials = btoa(`${config.consumerKey}:${config.consumerSecret}`);
      const response = await fetch(
        `${config.url}/wp-json/wc/v${config.version}/${endpoint}`,
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`WooCommerce API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (secondError) {
      console.error('WooCommerce API fetch error with basic auth:', secondError);
      throw secondError;
    }
  }
};

// Get all products from WooCommerce
export const getProducts = async (
  params?: { 
    perPage?: number,
    category?: number,
    search?: string,
    orderBy?: 'date' | 'id' | 'title' | 'slug',
    order?: 'asc' | 'desc'
  },
  config?: WooCommerceConfig
): Promise<WooProduct[]> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    // Build query string from params
    const queryParams = params ? Object.entries(params)
      .map(([key, value]) => {
        // Convert camelCase to snake_case for WooCommerce API
        const paramKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return `${paramKey}=${encodeURIComponent(String(value))}`;
      })
      .join('&') : '';
    
    // Append query params to endpoint if they exist
    const endpoint = `products${queryParams ? `?${queryParams}` : ''}`;
    
    return await fetchWooCommerceData<WooProduct[]>(endpoint, wooConfig);
  } catch (error) {
    console.error('Error fetching WooCommerce products:', error);
    throw error;
  }
};

// Create a new product in WooCommerce
export const createWooProduct = async (
  product: Partial<WooProduct>,
  config?: WooCommerceConfig
): Promise<WooProduct> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    return await fetchWooCommerceData<WooProduct>(
      'products',
      wooConfig,
    );
  } catch (error) {
    console.error('Error creating WooCommerce product:', error);
    throw error;
  }
};

// Update an existing product in WooCommerce
export const updateWooProduct = async (
  id: number,
  product: Partial<WooProduct>,
  config?: WooCommerceConfig
): Promise<WooProduct> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    return await fetchWooCommerceData<WooProduct>(
      `products/${id}`,
      wooConfig
    );
  } catch (error) {
    console.error(`Error updating WooCommerce product ${id}:`, error);
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
