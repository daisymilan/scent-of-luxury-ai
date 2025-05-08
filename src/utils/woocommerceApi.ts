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

// Hardcoded configuration for immediate use with Min.com
export const HARDCODED_WOO_CONFIG: WooCommerceConfig | null = {
  url: 'https://staging.min.com/int',
  consumerKey: 'ck_83b6276178dfd425fb2618461bfb02aad3fd6d67',
  consumerSecret: 'cs_a9ffe2c31156740acaa6dc82c50489717cb6d4d7',
  version: '3'
};

// Export constants for direct use in components
export const WOO_API_BASE_URL = 'https://staging.min.com/int/wp-json/wc/v3';
export const WOO_API_CREDENTIALS = 'Basic ' + btoa(`${HARDCODED_WOO_CONFIG.consumerKey}:${HARDCODED_WOO_CONFIG.consumerSecret}`);
export const WOO_API_AUTH_PARAMS = `consumer_key=${HARDCODED_WOO_CONFIG.consumerKey}&consumer_secret=${HARDCODED_WOO_CONFIG.consumerSecret}`;

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
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
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
    phone?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  shipping?: {
    first_name: string;
    last_name: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  line_items: Array<{
    product_id: number;
    name: string;
    quantity: number;
    total: string;
    price: string;
  }>;
  payment_method?: string;
  payment_method_title?: string;
  transaction_id?: string;
  customer_note?: string;
}

export interface WooCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  orders_count: number;
  total_spent: string;
  avatar_url: string;
  billing: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    email: string;
    phone?: string;
  };
  shipping?: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  date_created: string;
  date_modified: string;
}

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

// React hooks for WooCommerce data
export const useWooProducts = (limit: number = 10, category?: number, searchTerm?: string) => {
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const config = getWooCommerceConfig();
    if (!config) return;
    
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Build endpoint with query parameters
        let endpoint = `products?per_page=${limit}`;
        if (category) endpoint += `&category=${category}`;
        if (searchTerm) endpoint += `&search=${encodeURIComponent(searchTerm)}`;
        
        const data = await fetchWooCommerceData<WooProduct[]>(endpoint, config);
        setProducts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [limit, category, searchTerm]);
  
  return { products, isLoading, error };
};

export const useWooOrders = (
  limit: number = 10, 
  status?: string, 
  customer?: number, 
  dateAfter?: string, 
  dateBefore?: string
) => {
  const [orders, setOrders] = useState<WooOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const config = getWooCommerceConfig();
    if (!config) return;
    
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // Build endpoint with query parameters
        let endpoint = `orders?per_page=${limit}`;
        if (status) endpoint += `&status=${status}`;
        if (customer) endpoint += `&customer=${customer}`;
        if (dateAfter) endpoint += `&after=${dateAfter}`;
        if (dateBefore) endpoint += `&before=${dateBefore}`;
        
        const data = await fetchWooCommerceData<WooOrder[]>(endpoint, config);
        setOrders(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [limit, status, customer, dateAfter, dateBefore]);
  
  return { orders, isLoading, error };
};

export const useWooCustomers = (
  limit: number = 10, 
  searchTerm?: string, 
  role?: string
) => {
  const [customers, setCustomers] = useState<WooCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const config = getWooCommerceConfig();
    if (!config) return;
    
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        // Build endpoint with query parameters
        let endpoint = `customers?per_page=${limit}`;
        if (searchTerm) endpoint += `&search=${encodeURIComponent(searchTerm)}`;
        if (role) endpoint += `&role=${role}`;
        
        const data = await fetchWooCommerceData<WooCustomer[]>(endpoint, config);
        setCustomers(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomers();
  }, [limit, searchTerm, role]);
  
  return { customers, isLoading, error };
};

export const useWooStats = (dateRange?: 'week' | 'month' | 'year') => {
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
        
        // Get date range for filtering
        const now = new Date();
        let startDate = new Date();
        
        switch(dateRange) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
          default:
            startDate.setDate(now.getDate() - 30); // Default to 30 days
        }
        
        // Filter orders by date range
        const filteredOrders = dateRange 
          ? orders.filter(order => new Date(order.date_created) >= startDate)
          : orders;
        
        // Calculate some basic stats
        const totalProducts = products.length;
        const totalOrders = filteredOrders.length;
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
        
        // Calculate top selling products
        const productSales: Record<number, {name: string, units: number, revenue: number}> = {};
        
        filteredOrders.forEach(order => {
          order.line_items.forEach(item => {
            if (!productSales[item.product_id]) {
              productSales[item.product_id] = {
                name: item.name,
                units: 0,
                revenue: 0,
              };
            }
            productSales[item.product_id].units += item.quantity;
            productSales[item.product_id].revenue += parseFloat(item.total);
          });
        });
        
        // Sort products by revenue
        const topProducts = Object.entries(productSales)
          .map(([id, data]) => ({
            id: parseInt(id),
            ...data
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
        
        setStats({
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue.toFixed(2),
          averageOrderValue: totalOrders ? (totalRevenue / totalOrders).toFixed(2) : '0',
          topProducts,
          dateRange: {
            start: startDate.toISOString(),
            end: now.toISOString(),
          }
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [dateRange]);
  
  return { stats, isLoading, error };
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
