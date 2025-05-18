import { useState, useEffect } from 'react';

export const useWooOrders = (
  limit: number = 10,
  page: number = 1,
  status?: string,
  customer?: number,
  dateAfter?: string,
  dateBefore?: string
) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params: Record<string, any> = {
          per_page: limit,
          page
        };
        if (status) params.status = status;
        if (customer) params.customer = customer;
        if (dateAfter) params.after = dateAfter;
        if (dateBefore) params.before = dateBefore;

        const response = await fetch('/api/woo-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: 'orders', params })
        });

        if (!response.ok) throw new Error('Failed to load orders');
        const data = await response.json();

        if (!Array.isArray(data)) {
          console.warn('Unexpected orders response format:', data);
          throw new Error('Unexpected WooCommerce API response format');
        }

        setOrders(data);
        setTotalPages(1);
        setTotalOrders(data.length);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [limit, page, status, customer, dateAfter, dateBefore]);

  return { orders, isLoading, error, totalOrders, totalPages };
};
