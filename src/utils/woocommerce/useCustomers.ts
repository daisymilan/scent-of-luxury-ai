
/**
 * WooCommerce Customers Hooks
 */
import { useState, useEffect } from 'react';
import { WooCustomer } from './types';
import { getWooCommerceConfig } from './config';

export const useWooCustomers = (
  limit: number = 10,
  page: number = 1,
  search?: string,
  role?: string
) => {
  const [customers, setCustomers] = useState<WooCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  useEffect(() => {
    const config = getWooCommerceConfig();
    if (!config) return;
    
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Build endpoint with query parameters
        let endpoint = `customers?per_page=${limit}&page=${page}`;
        if (search) endpoint += `&search=${encodeURIComponent(search)}`;
        if (role) endpoint += `&role=${role}`;
        
        // Add authentication parameters directly in the URL
        const url = new URL(`${config.url}/wp-json/wc/v${config.version}/${endpoint}`);
        url.searchParams.append('consumer_key', config.consumerKey);
        url.searchParams.append('consumer_secret', config.consumerSecret);
        
        console.log('Fetching customers from URL:', url.toString());
        
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
          setTotalCustomers(parseInt(totalItems));
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
        console.log(`Fetched ${data.length} customers successfully`);
        setCustomers(data);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomers();
  }, [limit, page, search, role]);
  
  return { customers, isLoading, error, totalCustomers, totalPages };
};
