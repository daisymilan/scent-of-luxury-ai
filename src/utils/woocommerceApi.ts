
/**
 * WooCommerce API utility for interacting with the WooCommerce REST API
 */
import { useState, useEffect } from 'react';

// WooCommerce API Configuration Types
export interface WooCommerceConfig {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  version: string;
}

// Hardcoded configuration for immediate use
// In a production environment, this would be loaded from a secure environment variable
export const HARDCODED_WOO_CONFIG: WooCommerceConfig | null = {
  url: 'https://your-woocommerce-store.com', // User should update this with their actual store URL
  consumerKey: 'ck_59d0971533bd5f96218e14f128433353a511056b',
  consumerSecret: 'cs_e6fcd21c6f4287ac5cd1282aae76bed64c2ead70',
  version: '3'
};

// Store credentials in localStorage (temporary solution)
export const saveWooCommerceConfig = (config: WooCommerceConfig) => {
  localStorage.setItem('woocommerce_config', JSON.stringify(config));
};

export const getWooCommerceConfig = (): WooCommerceConfig | null => {
  // Return hardcoded config first, if not available check localStorage
  return HARDCODED_WOO_CONFIG || 
    (localStorage.getItem('woocommerce_config') ? 
      JSON.parse(localStorage.getItem('woocommerce_config')!) : null);
};

// Types for WooCommerce data
export interface WooProduct {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_quantity: number | null;
  stock_status: string;
  total_sales: number;
  date_created: string;
}

export interface WooOrder {
  id: number;
  status: string;
  date_created: string;
  total: string;
  customer_id: number;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
  };
  line_items: Array<{
    product_id: number;
    name: string;
    quantity: number;
    total: string;
  }>;
}

// API Request functions
export const fetchWooCommerceData = async <T,>(
  endpoint: string,
  config: WooCommerceConfig
): Promise<T> => {
  // WooCommerce REST API requires OAuth 1.0a signature
  // For browser-based requests, we'll use basic auth (less secure but simpler)
  const credentials = btoa(`${config.consumerKey}:${config.consumerSecret}`);
  
  try {
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
  } catch (error) {
    console.error('WooCommerce API fetch error:', error);
    throw error;
  }
};

// React hooks for WooCommerce data
export const useWooProducts = (limit: number = 10) => {
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const config = getWooCommerceConfig();
    if (!config) return;
    
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWooCommerceData<WooProduct[]>(`products?per_page=${limit}`, config);
        setProducts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [limit]);
  
  return { products, isLoading, error };
};

export const useWooOrders = (limit: number = 10) => {
  const [orders, setOrders] = useState<WooOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const config = getWooCommerceConfig();
    if (!config) return;
    
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWooCommerceData<WooOrder[]>(`orders?per_page=${limit}`, config);
        setOrders(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [limit]);
  
  return { orders, isLoading, error };
};

export const useWooStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const config = getWooCommerceConfig();
    if (!config) return;
    
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // WooCommerce doesn't have a direct stats endpoint
        // So we fetch some key data to build our own stats
        const [products, orders] = await Promise.all([
          fetchWooCommerceData<WooProduct[]>('products?per_page=100', config),
          fetchWooCommerceData<WooOrder[]>('orders?per_page=100', config),
        ]);
        
        // Calculate some basic stats
        const totalProducts = products.length;
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
        
        setStats({
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue.toFixed(2),
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return { stats, isLoading, error };
};
