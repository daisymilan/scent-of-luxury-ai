
import { useState, useEffect } from 'react';
import { useWooStats, useWooOrders, useWooProducts } from '@/utils/woocommerce';
import { useToast } from '@/hooks/use-toast';
import KpiCards from './KpiCards';
import RevenueTrendChart from './RevenueTrendChart';
import TopSellingProducts from './TopSellingProducts';
import RecentOrdersTable from '@/components/RecentOrdersTable';
import { useChartData } from './hooks/useChartData';
import { useMetricsCalculator } from './hooks/useMetricsCalculator';
import { useFormattedProducts } from './hooks/useFormattedProducts';
import { useFormattedOrders } from './hooks/useFormattedOrders';

const KpiOverview = () => {
  const { stats, isLoading: isStatsLoading } = useWooStats('week');
  const { orders, isLoading: isOrdersLoading } = useWooOrders(10); 
  const { products, isLoading: isProductsLoading } = useWooProducts(10);
  const { toast } = useToast();
  
  // Use custom hooks to process data
  const dailyChartData = useChartData(orders);
  const { dailyRevenue, monthlyRevenue, totalProductsSold, conversionRate } = useMetricsCalculator(orders, stats);
  const topProductsList = useFormattedProducts(products);
  const recentOrders = useFormattedOrders(orders);
  
  const isLoading = isStatsLoading || isOrdersLoading || isProductsLoading;

  // Notify if no data available but API connected
  useEffect(() => {
    if (!isLoading) {
      if (!orders?.length && !products?.length && !stats) {
        toast({
          title: "No data available",
          description: "Could not load store data from WooCommerce API. Please check your API connection.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  }, [isLoading, stats, orders, products, toast]);

  // Debug logging
  useEffect(() => {
    console.log("WooCommerce stats:", stats);
    console.log("WooCommerce orders:", orders);
    console.log("WooCommerce products:", products);
  }, [stats, orders, products]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <KpiCards 
        isLoading={isLoading}
        dailyRevenue={dailyRevenue}
        monthlyRevenue={monthlyRevenue}
        totalProductsSold={totalProductsSold}
        conversionRate={conversionRate}
      />
      
      <RevenueTrendChart 
        isLoading={isLoading} 
        dailyChartData={dailyChartData} 
      />
      
      <TopSellingProducts 
        isLoading={isLoading}
        topProductsList={topProductsList}
      />
      
      <div className="col-span-full mt-6">
        <RecentOrdersTable 
          orders={recentOrders}
        />
      </div>
    </div>
  );
};

export default KpiOverview;
