
/**
 * WooCommerce Products Hooks with backend API
 */
import { useState, useEffect } from 'react';
import { WooProduct } from './types';
import apiClient from '@/lib/apiClient';

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
        // Prepare query parameters
        const params: Record<string, any> = {
          per_page: limit,
          page,
          orderby: orderBy,
          order
        };
        
        if (category) params.category = category;
        if (searchTerm) params.search = searchTerm;
        
        const response = await apiClient.get('/woocommerce/products', { params });
        
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setTotalProducts(response.data.products.length); // In a real API this would come from the response
        
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

// Helper function to fetch all products for inventory management
export const useAllWooProducts = () => {
  const [allProducts, setAllProducts] = useState<WooProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get products with a large per_page to get as many as possible in one request
        const response = await apiClient.get('/woocommerce/products', {
          params: { per_page: 100 } // Maximum allowed by many APIs
        });
        
        setAllProducts(response.data.products);
        
      } catch (err) {
        console.error('Error fetching all products:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllProducts();
  }, []);
  
  return { allProducts, isLoading, error };
};
