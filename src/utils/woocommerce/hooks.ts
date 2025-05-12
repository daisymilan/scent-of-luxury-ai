
/**
 * Custom hooks for WooCommerce API
 */
import { useQuery } from '@tanstack/react-query';
import { 
  getProductById, 
  getOrderById, 
  getCustomerById, 
  getProductVariation 
} from './api';
import { getWooCommerceConfig } from './config';

/**
 * Hook to fetch a single product by ID
 */
export const useWooProduct = (productId: number | null) => {
  const config = getWooCommerceConfig();
  
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId || !config) return null;
      return await getProductById(productId, config);
    },
    enabled: !!productId && !!config,
  });
};

/**
 * Hook to fetch a product variation by product ID and variation ID
 */
export const useWooProductVariation = (
  productId: number | null, 
  variationId: number | null
) => {
  const config = getWooCommerceConfig();
  
  return useQuery({
    queryKey: ['product-variation', productId, variationId],
    queryFn: async () => {
      if (!productId || !variationId || !config) return null;
      return await getProductVariation(productId, variationId, config);
    },
    enabled: !!productId && !!variationId && !!config,
  });
};

/**
 * Hook to fetch a single order by ID
 */
export const useWooOrder = (orderId: number | null) => {
  const config = getWooCommerceConfig();
  
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId || !config) return null;
      return await getOrderById(orderId, config);
    },
    enabled: !!orderId && !!config,
  });
};

/**
 * Hook to fetch a single customer by ID
 */
export const useWooCustomer = (customerId: number | null) => {
  const config = getWooCommerceConfig();
  
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      if (!customerId || !config) return null;
      return await getCustomerById(customerId, config);
    },
    enabled: !!customerId && !!config,
  });
};

