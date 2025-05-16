
/**
 * WooCommerce Customers Hooks with backend API
 */
import { useState, useEffect } from 'react';
import { WooCustomer } from './types';
import apiClient from '@/lib/apiClient';

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
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Prepare query parameters
        const params: Record<string, any> = {
          per_page: limit,
          page
        };
        
        if (search) params.search = search;
        if (role) params.role = role;
        
        const response = await apiClient.get('/woocommerce/customers', { params });
        
        setCustomers(response.data.customers);
        setTotalPages(response.data.totalPages);
        setTotalCustomers(response.data.customers.length); // In a real API this would come from the response
        
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomers();
  }, [limit, page, search, role]);
  
  return { customers, isLoading, error, totalCustomers, totalPages };
};
