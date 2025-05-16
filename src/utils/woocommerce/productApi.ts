
/**
 * Product API functions - Communicates with our backend
 */
import { WooProduct, WooProductVariation } from './types';
import apiClient from '@/lib/apiClient';

// Get a product by ID
export const getProductById = async (id: number): Promise<WooProduct | null> => {
  try {
    const response = await apiClient.get(`/woocommerce/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

// Get all products with pagination
export const getAllProducts = async (page = 1, perPage = 10): Promise<{
  products: WooProduct[];
  totalPages: number;
}> => {
  try {
    const response = await apiClient.get('/woocommerce/products', {
      params: { page, per_page: perPage }
    });
    
    return {
      products: response.data.products,
      totalPages: response.data.totalPages
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      totalPages: 0
    };
  }
};

// Get product variations
export const getProductVariations = async (productId: number): Promise<WooProductVariation[]> => {
  try {
    const response = await apiClient.get(`/woocommerce/products/${productId}/variations`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching variations for product ${productId}:`, error);
    return [];
  }
};

// Update a product
export const updateProduct = async (
  id: number, 
  productData: Partial<WooProduct>
): Promise<WooProduct | null> => {
  try {
    const response = await apiClient.put(`/woocommerce/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    return null;
  }
};
