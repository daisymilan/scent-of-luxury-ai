
import { useState, useEffect } from 'react';
import { WooOrder } from '@/utils/woocommerce/types';

interface MetricsResult {
  dailyRevenue: number;
  monthlyRevenue: number;
  totalProductsSold: number;
  conversionRate: string;
}

export const useMetricsCalculator = (orders: WooOrder[] | undefined, stats: any): MetricsResult => {
  const [metrics, setMetrics] = useState<MetricsResult>({
    dailyRevenue: 0,
    monthlyRevenue: 0,
    totalProductsSold: 0,
    conversionRate: "0.0%",
  });

  useEffect(() => {
    // Calculate revenue metrics from real data only
    let dailyRevenue = 0;
    let monthlyRevenue = 0;
    let totalProductsSold = 0;
    let conversionRate = "0.0%";

    // Calculate metrics from orders if available
    if (orders && orders.length > 0) {
      // For daily revenue, sum orders from the last 24 hours
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      dailyRevenue = orders
        .filter(order => new Date(order.date_created) >= oneDayAgo)
        .reduce((sum, order) => sum + parseFloat(order.total), 0);
      
      // For monthly revenue, sum all orders or multiply daily by 30 if limited data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const monthlyOrders = orders.filter(order => new Date(order.date_created) >= thirtyDaysAgo);
      if (monthlyOrders.length > 0) {
        monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      } else {
        // If we don't have 30 days of data, estimate based on what we have
        monthlyRevenue = dailyRevenue * 30;
      }
      
      // Calculate total products sold from order line items
      totalProductsSold = orders.reduce((sum, order) => {
        return sum + order.line_items.reduce((itemSum, item) => itemSum + item.quantity, 0);
      }, 0);
      
      // Calculate conversion rate if we have stats
      if (stats && stats.totalOrders && stats.totalVisitors) {
        const rate = (stats.totalOrders / stats.totalVisitors) * 100;
        conversionRate = `${rate.toFixed(1)}%`;
      }
    } else if (stats) {
      // Fallback to stats if available
      dailyRevenue = stats.totalRevenue ? parseFloat(stats.totalRevenue) / 7 : 0; // Divide weekly revenue by 7
      monthlyRevenue = stats.totalRevenue ? parseFloat(stats.totalRevenue) * 4 : 0; // Multiply weekly revenue by 4
      totalProductsSold = stats.totalItems || 0;
    }

    setMetrics({
      dailyRevenue,
      monthlyRevenue,
      totalProductsSold,
      conversionRate
    });
  }, [orders, stats]);

  return metrics;
};
