
/**
 * Shared Hooks and Contexts for WooCommerce Data
 */
import React, { createContext, useContext, useState } from "react";
import apiClient from '@/lib/apiClient';
import { WooProduct, WooProductVariation, WooOrder, WooCustomer } from "./types";
import { useQuery } from '@tanstack/react-query';

// WooCommerce Context for sharing connection state
export const WooCommerceContext = createContext<{
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
}>({
  isConnected: false,
  setIsConnected: () => {}
});

export const WooCommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  return (
    <WooCommerceContext.Provider value={{ isConnected, setIsConnected }}>
      {children}
    </WooCommerceContext.Provider>
  );
};

export const useWooCommerce = () => useContext(WooCommerceContext);

// Add additional hooks needed by components
export const useWooProduct = (productId: number | null) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const response = await apiClient.get(`/woocommerce/products/${productId}`);
      return response.data as WooProduct;
    },
    enabled: !!productId
  });
};

export const useWooProductVariation = (productId: number | null, variationId: number | null) => {
  return useQuery({
    queryKey: ['productVariation', productId, variationId],
    queryFn: async () => {
      if (!productId || !variationId) return null;
      
      const response = await apiClient.get(`/woocommerce/products/${productId}/variations/${variationId}`);
      return response.data as WooProductVariation;
    },
    enabled: !!productId && !!variationId
  });
};

export const useWooOrder = (orderId: number | null) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      const response = await apiClient.get(`/woocommerce/orders/${orderId}`);
      return response.data as WooOrder;
    },
    enabled: !!orderId
  });
};

export const useWooCustomer = (customerId: number | null) => {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      if (!customerId) return null;
      
      const response = await apiClient.get(`/woocommerce/customers/${customerId}`);
      return response.data as WooCustomer;
    },
    enabled: !!customerId
  });
};

// Test API connection hook
export const useApiConnectionTest = () => {
  return useQuery({
    queryKey: ['apiConnectionTest'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/woocommerce/test-connection');
        return response.data.success;
      } catch (error) {
        console.error('API connection test failed:', error);
        return false;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1
  });
};
