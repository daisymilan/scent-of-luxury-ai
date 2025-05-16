
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
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params: Record<string, any> = {
          per_page: limit,
          page
        };
        if (search) params.search = search;
        if (role) params.role = role;

        const res = await fetch('/api/woo-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: 'customers', params })
        });

        if (!res.ok) throw new Error('Failed to load customers');
        const data = await res.json();
        setCustomers(data);
        setTotalPages(1); // Optional: update if totalPages is returned
        setTotalCustomers(data.length);
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
