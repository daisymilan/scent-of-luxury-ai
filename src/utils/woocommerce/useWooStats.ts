
/**
 * WooCommerce Stats Hooks with backend API
 */
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

export const useWooStats = (dateRange?: 'week' | 'month' | 'year') => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/woocommerce/stats', {
          params: { dateRange }
        });
        
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching WooCommerce stats:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [dateRange]);
  
  return { stats, isLoading, error };
};
