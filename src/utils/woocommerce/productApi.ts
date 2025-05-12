
/**
 * WooCommerce Product API functions
 */
import { WooCommerceConfig, getWooCommerceConfig } from './config';
import { WooProduct, WooProductVariation } from './types';
import { fetchWooCommerceData } from './apiClient';

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
