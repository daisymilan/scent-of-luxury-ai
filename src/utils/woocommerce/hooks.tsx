
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
import { useToast } from '@/hooks/use-toast';
import { ErrorDialog } from '@/components/ui/error-dialog';
import { useState } from 'react';

/**
 * Hook to fetch a single product by ID
 */
export const useWooProduct = (productId: number | null) => {
  const config = getWooCommerceConfig();
  const { toast } = useToast();
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  
  const result = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId || !config) return null;
      try {
        return await getProductById(productId, config);
      } catch (error) {
        console.error(`Failed to fetch product ${productId}:`, error);
        toast({
          title: "Product Data Error",
          description: "Could not load product data. Check your connection.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!productId && !!config,
    retry: 2,
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2000 : 1000, 30000),
  });

  // Show error dialog for persistent errors
  if (result.isError && !isErrorDialogOpen) {
    setIsErrorDialogOpen(true);
  }

  return {
    ...result,
    errorDialog: result.isError ? (
      <ErrorDialog
        open={isErrorDialogOpen}
        onOpenChange={setIsErrorDialogOpen}
        title="Product Data Error"
        description="Could not load product data from MIN NEW YORK WooCommerce API."
        errorType="api"
      />
    ) : null,
  };
};

/**
 * Hook to fetch a product variation by product ID and variation ID
 */
export const useWooProductVariation = (
  productId: number | null, 
  variationId: number | null
) => {
  const config = getWooCommerceConfig();
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['product-variation', productId, variationId],
    queryFn: async () => {
      if (!productId || !variationId || !config) return null;
      try {
        return await getProductVariation(productId, variationId, config);
      } catch (error) {
        console.error(`Failed to fetch product variation ${variationId} for product ${productId}:`, error);
        toast({
          title: "Product Variation Error",
          description: "Could not load product variation data.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!productId && !!variationId && !!config,
    retry: 2,
  });
};

/**
 * Hook to fetch a single order by ID
 */
export const useWooOrder = (orderId: number | null) => {
  const config = getWooCommerceConfig();
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId || !config) return null;
      try {
        return await getOrderById(orderId, config);
      } catch (error) {
        console.error(`Failed to fetch order ${orderId}:`, error);
        toast({
          title: "Order Data Error",
          description: "Could not load order data.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!orderId && !!config,
    retry: 2,
  });
};

/**
 * Hook to fetch a single customer by ID
 */
export const useWooCustomer = (customerId: number | null) => {
  const config = getWooCommerceConfig();
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      if (!customerId || !config) return null;
      try {
        return await getCustomerById(customerId, config);
      } catch (error) {
        console.error(`Failed to fetch customer ${customerId}:`, error);
        toast({
          title: "Customer Data Error",
          description: "Could not load customer data.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!customerId && !!config,
    retry: 2,
  });
};
