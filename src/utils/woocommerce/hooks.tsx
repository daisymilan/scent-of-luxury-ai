
/**
 * Shared Hooks and Contexts for WooCommerce Data
 */
import React, { createContext, useContext, useState } from "react";
import { WOO_API_BASE_URL } from "./index";
import { WooCommerceConfig, getWooCommerceConfig } from "./config";
import { WooProduct, WooProductVariation, WooOrder, WooCustomer } from "./types";
import { useQuery } from '@tanstack/react-query';

// Authentication parameters builder function
export const getWooAuthParams = (config?: WooCommerceConfig): string => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) return '';
  
  return `consumer_key=${wooConfig.consumerKey}&consumer_secret=${wooConfig.consumerSecret}`;
};

// We'll remove this export to avoid conflicts with config.ts
// and use the one from config.ts consistently
// export const WOO_API_AUTH_PARAMS = getWooAuthParams();

// WooCommerce Context for sharing config and auth state
export const WooCommerceContext = createContext<{
  isConfigured: boolean;
  setIsConfigured: (value: boolean) => void;
}>({
  isConfigured: false,
  setIsConfigured: () => {}
});

export const WooCommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConfigured, setIsConfigured] = useState<boolean>(!!getWooCommerceConfig());
  
  return (
    <WooCommerceContext.Provider value={{ isConfigured, setIsConfigured }}>
      {children}
    </WooCommerceContext.Provider>
  );
};

export const useWooCommerce = () => useContext(WooCommerceContext);

// Add additional hooks needed by ProductDetail component
export const useWooProduct = (productId: number | null) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const authParams = getWooAuthParams();
      const response = await fetch(`${WOO_API_BASE_URL}/products/${productId}?${authParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }
      
      return await response.json() as WooProduct;
    },
    enabled: !!productId
  });
};

export const useWooProductVariation = (productId: number | null, variationId: number | null) => {
  return useQuery({
    queryKey: ['productVariation', productId, variationId],
    queryFn: async () => {
      if (!productId || !variationId) return null;
      
      const authParams = getWooAuthParams();
      const response = await fetch(`${WOO_API_BASE_URL}/products/${productId}/variations/${variationId}?${authParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product variation: ${response.statusText}`);
      }
      
      return await response.json() as WooProductVariation;
    },
    enabled: !!productId && !!variationId
  });
};

export const useWooOrder = (orderId: number | null) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      const authParams = getWooAuthParams();
      const response = await fetch(`${WOO_API_BASE_URL}/orders/${orderId}?${authParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.statusText}`);
      }
      
      return await response.json() as WooOrder;
    },
    enabled: !!orderId
  });
};

export const useWooCustomer = (customerId: number | null) => {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      if (!customerId) return null;
      
      const authParams = getWooAuthParams();
      const response = await fetch(`${WOO_API_BASE_URL}/customers/${customerId}?${authParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch customer: ${response.statusText}`);
      }
      
      return await response.json() as WooCustomer;
    },
    enabled: !!customerId
  });
};
