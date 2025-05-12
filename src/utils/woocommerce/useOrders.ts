
/**
 * WooCommerce Orders Hooks
 */
import { useState, useEffect } from 'react';
import { WooOrder } from './types';
import { fetchWooCommerceData } from './api';
import { getWooCommerceConfig } from './config';

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
    if (!config) {
      setError(new Error('WooCommerce configuration not found'));
      return;
    }
    
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Build endpoint with query parameters
        let endpoint = `orders?per_page=${limit}`;
        if (status) endpoint += `&status=${status}`;
        if (customer) endpoint += `&customer=${customer}`;
        if (dateAfter) endpoint += `&after=${dateAfter}`;
        if (dateBefore) endpoint += `&before=${dateBefore}`;
        
        console.log(`Fetching orders with endpoint: ${endpoint}`);
        const data = await fetchWooCommerceData<WooOrder[]>(endpoint, config);
        console.log(`Fetched ${data.length} orders successfully`);
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [limit, status, customer, dateAfter, dateBefore]);
  
  return { orders, isLoading, error };
};
