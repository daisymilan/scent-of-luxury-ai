
/**
 * WooCommerce Customers Hooks
 */
import { useState, useEffect } from 'react';
import { WooCustomer } from './types';
import { fetchWooCommerceData } from './api';
import { getWooCommerceConfig } from './config';

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
