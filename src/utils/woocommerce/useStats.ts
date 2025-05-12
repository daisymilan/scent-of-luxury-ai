
/**
 * WooCommerce Stats Hooks
 */
import { useState, useEffect } from 'react';
import { WooProduct, WooOrder } from './types';
import { fetchWooCommerceData } from './api';
import { getWooCommerceConfig } from './config';

export const useWooStats = (dateRange?: 'week' | 'month' | 'year') => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const config = getWooCommerceConfig();
    if (!config) {
      console.error('WooCommerce configuration not found');
      setIsLoading(false);
      setError(new Error('WooCommerce configuration not found'));
      return;
    }
    
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching WooCommerce stats with config:', config);
        // WooCommerce doesn't have a direct stats endpoint
        // So we fetch some key data to build our own stats
        const [products, orders] = await Promise.all([
          fetchWooCommerceData<WooProduct[]>('products?per_page=100', config),
          fetchWooCommerceData<WooOrder[]>('orders?per_page=100', config),
        ]);
        
        console.log('Successfully fetched products and orders:', { 
          productsCount: products?.length, 
          ordersCount: orders?.length 
        });
        
        // Get date range for filtering
        const now = new Date();
        let startDate = new Date();
        
        switch(dateRange) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
          default:
            startDate.setDate(now.getDate() - 30); // Default to 30 days
        }
        
        // Filter orders by date range
        const filteredOrders = dateRange 
          ? orders.filter(order => new Date(order.date_created) >= startDate)
          : orders;
        
        // Calculate some basic stats
        const totalProducts = products.length;
        const totalOrders = filteredOrders.length;
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
        
        // Calculate top selling products
        const productSales: Record<number, {name: string, units: number, revenue: number}> = {};
        
        filteredOrders.forEach(order => {
          order.line_items.forEach(item => {
            if (!productSales[item.product_id]) {
              productSales[item.product_id] = {
                name: item.name,
                units: 0,
                revenue: 0,
              };
            }
            productSales[item.product_id].units += item.quantity;
            productSales[item.product_id].revenue += parseFloat(item.total);
          });
        });
        
        // Sort products by revenue
        const topProducts = Object.entries(productSales)
          .map(([id, data]) => ({
            id: parseInt(id),
            ...data
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
        
        const statsData = {
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue.toFixed(2),
          averageOrderValue: totalOrders ? (totalRevenue / totalOrders).toFixed(2) : '0',
          topProducts,
          dateRange: {
            start: startDate.toISOString(),
            end: now.toISOString(),
          }
        };
        
        console.log('Calculated WooCommerce stats:', statsData);
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching WooCommerce stats:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [dateRange]);
  
  return { stats, isLoading, error };
};
