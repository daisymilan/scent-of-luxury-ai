
/**
 * WooCommerce Customers Hooks
 */
import { useState, useEffect } from 'react';
import { WooCustomer } from './types';
import { fetchWooCommerceData } from './api';
import { getWooCommerceConfig } from './config';

export const useWooCustomers = (
  limit: number = 100,
  page: number = 1,
  searchTerm?: string, 
  role?: string
) => {
  const [customers, setCustomers] = useState<WooCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const config = getWooCommerceConfig();
    if (!config) {
      setError(new Error('WooCommerce configuration not found'));
      return;
    }
    
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Build endpoint with query parameters
        let endpoint = `customers?per_page=${limit}&page=${page}`;
        if (searchTerm) endpoint += `&search=${encodeURIComponent(searchTerm)}`;
        if (role) endpoint += `&role=${role}`;
        
        console.log(`Fetching customers with endpoint: ${endpoint}`);
        const data = await fetchWooCommerceData<WooCustomer[]>(endpoint, config);
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
  }, [limit, page, searchTerm, role]);
  
  return { customers, isLoading, error };
};
