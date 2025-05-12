
/**
 * WooCommerce Products Hooks
 */
import { useState, useEffect } from 'react';
import { WooProduct } from './types';
import { getWooCommerceConfig } from './config';

export const useWooProducts = (
  limit: number = 100,  // Increased default limit to get more products
  page: number = 1,     // Added pagination support
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
    const config = getWooCommerceConfig();
    if (!config) return;
    
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Build endpoint with query parameters
        let endpoint = `products?per_page=${limit}&page=${page}`;
        if (category) endpoint += `&category=${category}`;
        if (searchTerm) endpoint += `&search=${encodeURIComponent(searchTerm)}`;
        if (orderBy) endpoint += `&orderby=${orderBy}`;
        if (order) endpoint += `&order=${order}`;
        
        // Add authentication parameters directly in the URL
        const url = new URL(`${config.url}/wp-json/wc/v${config.version}/${endpoint}`);
        url.searchParams.append('consumer_key', config.consumerKey);
        url.searchParams.append('consumer_secret', config.consumerSecret);
        
        console.log('Fetching products from URL:', url.toString());
        
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
          setTotalProducts(parseInt(totalItems));
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
        console.log(`Fetched ${data.length} products successfully`);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err as Error);
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
    const config = getWooCommerceConfig();
    if (!config) return;
    
    const fetchAllProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First get total count
        const countUrl = new URL(`${config.url}/wp-json/wc/v${config.version}/products`);
        countUrl.searchParams.append('per_page', '1');
        countUrl.searchParams.append('consumer_key', config.consumerKey);
        countUrl.searchParams.append('consumer_secret', config.consumerSecret);
        
        const countResponse = await fetch(countUrl.toString(), {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        
        if (!countResponse.ok) {
          const errorText = await countResponse.text();
          console.error('Count API error response:', errorText);
          throw new Error(`API error: ${countResponse.status}`);
        }
        
        const totalHeader = countResponse.headers.get('x-wp-total');
        const totalCount = totalHeader ? parseInt(totalHeader) : 100;
        
        // Then fetch all products in one request with a large per_page
        const url = new URL(`${config.url}/wp-json/wc/v${config.version}/products`);
        url.searchParams.append('per_page', totalCount.toString());
        url.searchParams.append('consumer_key', config.consumerKey);
        url.searchParams.append('consumer_secret', config.consumerSecret);
        
        console.log('Fetching all products from URL:', url.toString());
        
        const response = await fetch(url.toString(), {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          cache: 'no-store'
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Products API error response:', errorText);
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Fetched all ${data.length} products successfully`);
        setAllProducts(data);
      } catch (err) {
        console.error('Error fetching all products:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllProducts();
  }, []);
  
  return { allProducts, isLoading, error };
};
