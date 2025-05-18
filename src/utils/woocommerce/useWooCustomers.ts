
import { useState, useEffect } from 'react';
import { wooProxy } from './wooFetch';

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

        const data = await wooProxy({
          endpoint: 'customers', 
          params
        });

        if (!Array.isArray(data)) {
          console.warn('Unexpected customers response format:', data);
          throw new Error('Unexpected WooCommerce API response format');
        }

        setCustomers(data);
        setTotalPages(1);
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
