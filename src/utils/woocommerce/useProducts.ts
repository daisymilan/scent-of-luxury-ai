
/**
 * WooCommerce Products Hooks
 */
import { useState, useEffect } from 'react';
import { WooProduct } from './types';
import { fetchWooCommerceData } from './api';
import { getWooCommerceConfig } from './config';

export const useWooProducts = (limit: number = 10, category?: number, searchTerm?: string) => {
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const config = getWooCommerceConfig();
    if (!config) return;
    
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Build endpoint with query parameters
        let endpoint = `products?per_page=${limit}`;
        if (category) endpoint += `&category=${category}`;
        if (searchTerm) endpoint += `&search=${encodeURIComponent(searchTerm)}`;
        
        const data = await fetchWooCommerceData<WooProduct[]>(endpoint, config);
        setProducts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [limit, category, searchTerm]);
  
  return { products, isLoading, error };
};
