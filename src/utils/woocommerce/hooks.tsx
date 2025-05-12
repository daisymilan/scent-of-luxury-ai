
/**
 * Shared Hooks and Contexts for WooCommerce Data
 */
import { createContext, useContext, useState } from "react";
import { WOO_API_BASE_URL } from "./index";
import { WooCommerceConfig, getWooCommerceConfig } from "./config";

// Authentication parameters builder function
export const getWooAuthParams = (config?: WooCommerceConfig): string => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) return '';
  
  return `consumer_key=${wooConfig.consumerKey}&consumer_secret=${wooConfig.consumerSecret}`;
};

// Export constants for convenient access
export const WOO_API_AUTH_PARAMS = getWooAuthParams();

// WooCommerce Context for sharing config and auth state
export const WooCommerceContext = createContext<{
  isConfigured: boolean;
  setIsConfigured: (value: boolean) => void;
}>({
  isConfigured: false,
  setIsConfigured: () => {}
});

export const WooCommerceProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConfigured, setIsConfigured] = useState<boolean>(!!getWooCommerceConfig());
  
  return (
    <WooCommerceContext.Provider value={{ isConfigured, setIsConfigured }}>
      {children}
    </WooCommerceContext.Provider>
  );
};

export const useWooCommerce = () => useContext(WooCommerceContext);
