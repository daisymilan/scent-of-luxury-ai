
/**
 * WooCommerce Orders Hooks
 */
import { useState, useEffect } from 'react';
import { WooOrder } from './types';
import { getWooCommerceConfig } from './config';

export const useWooOrders = (
  limit: number = 10,
  page: number = 1,
  status?: string,
  customer?: number,
  dateAfter?: string,
  dateBefore?: string
) => {
  const [orders, setOrders] = useState<WooOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  useEffect(() => {
    const config = getWooCommerceConfig();
    if (!config) return;
    
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Build endpoint with query parameters
        let endpoint = `orders?per_page=${limit}&page=${page}`;
        if (status) endpoint += `&status=${status}`;
        if (customer) endpoint += `&customer=${customer}`;
        if (dateAfter) endpoint += `&after=${dateAfter}`;
        if (dateBefore) endpoint += `&before=${dateBefore}`;
        
        // Add authentication parameters directly in the URL
        const url = new URL(`${config.url}/wp-json/wc/v${config.version}/${endpoint}`);
        url.searchParams.append('consumer_key', config.consumerKey);
        url.searchParams.append('consumer_secret', config.consumerSecret);
        
        console.log('Fetching orders from URL:', url.toString());
        
        const response = await fetch(url.toString(), {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          cache: 'no-store'
        });
        
        // Get total from headers
        const totalItems = response.headers.get('x-wp-total');
        const totalPagesHeader = response.headers.get('x-wp-totalpages');
        
        if (totalItems) {
          setTotalOrders(parseInt(totalItems));
        }
        
        if (totalPagesHeader) {
          setTotalPages(parseInt(totalPagesHeader));
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
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
  }, [limit, page, status, customer, dateAfter, dateBefore]);
  
  return { orders, isLoading, error, totalOrders, totalPages };
};
