/**
 * WooCommerce API utility functions
 */
import { WooCommerceConfig, getWooCommerceConfig } from './config';
import { WooProduct, WooOrder, WooCustomer, WooProductVariation } from './types';

// API Request functions
export const fetchWooCommerceData = async <T,>(
  endpoint: string,
  config: WooCommerceConfig
): Promise<T> => {
  // Add proper error handling and retry logic
  const maxRetries = 2;
  let attempt = 0;
  let lastError: Error | null = null;
  
  while (attempt <= maxRetries) {
    try {
      // First attempt with query parameters (most reliable)
      const queryChar = endpoint.includes('?') ? '&' : '?';
      const url = `${config.url}/wp-json/wc/v${config.version}/${endpoint}${queryChar}consumer_key=${config.consumerKey}&consumer_secret=${config.consumerSecret}`;
      
      console.log(`Fetching WooCommerce data (attempt ${attempt + 1}/${maxRetries + 1}): ${endpoint}`);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        // Adding cache: 'no-store' to prevent caching issues
        cache: 'no-store'
      });
      
      if (!response.ok) {
        console.error(`WooCommerce API error (${response.status}): ${response.statusText}`);
        throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`WooCommerce API fetch error (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Try basic auth on next attempt if we failed with query params
      if (attempt === 0) {
        try {
          const credentials = btoa(`${config.consumerKey}:${config.consumerSecret}`);
          const response = await fetch(
            `${config.url}/wp-json/wc/v${config.version}/${endpoint}`,
            {
              headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json',
              },
              cache: 'no-store'
            }
          );
          
          if (!response.ok) {
            throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          return data as T;
        } catch (secondError) {
          console.error('WooCommerce API fetch error with basic auth:', secondError);
        }
      }
      
      attempt++;
      
      // Add a small delay before retrying
      if (attempt <= maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  throw lastError || new Error('Failed to fetch WooCommerce data after multiple attempts');
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

// Get a single product by ID
export const getProductById = async (
  productId: number,
  config?: WooCommerceConfig
): Promise<WooProduct> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    return await fetchWooCommerceData<WooProduct>(`products/${productId}`, wooConfig);
  } catch (error) {
    console.error(`Error fetching WooCommerce product ${productId}:`, error);
    throw error;
  }
};

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

// Get a product variation by product ID and variation ID
export const getProductVariation = async (
  productId: number,
  variationId: number,
  config?: WooCommerceConfig
): Promise<WooProductVariation> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    return await fetchWooCommerceData<WooProductVariation>(
      `products/${productId}/variations/${variationId}`, 
      wooConfig
    );
  } catch (error) {
    console.error(`Error fetching product variation ${variationId} for product ${productId}:`, error);
    throw error;
  }
};
