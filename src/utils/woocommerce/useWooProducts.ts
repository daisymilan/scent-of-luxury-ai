
import { useState, useEffect } from 'react';
import { WooProduct } from './types';
import { wooProxy } from './wooFetch';

export const useWooProducts = (
  limit: number = 100,
  page: number = 1,
  category?: number,
  searchTerm?: string,
  orderBy: string = 'date',
  order: 'asc' | 'desc' = 'desc'
) => {
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use the new wooProxy utility
        const data = await wooProxy({
          endpoint: 'products',
          params: {
            per_page: limit,
            page,
            orderby: orderBy,
            order,
            ...(category ? { category } : {}),
            ...(searchTerm ? { search: searchTerm } : {})
          }
        });

        if (!Array.isArray(data)) {
          console.warn('Unexpected products response format:', data);
          throw new Error('Unexpected WooCommerce API response format');
        }

        setProducts(data);
        setTotalPages(1);
        setTotalProducts(data.length);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [limit, page, category, searchTerm, orderBy, order]);

  return { products, isLoading, error, totalProducts, totalPages };
};
