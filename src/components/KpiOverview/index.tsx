import { useState, useEffect } from 'react';
import { useWooStats, useWooOrders, useWooProducts } from '@/utils/woocommerce';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import KpiCards from './KpiCards';
import RevenueTrendChart from './RevenueTrendChart';
import TopSellingProducts from './TopSellingProducts';
import RecentOrdersTable from '@/components/RecentOrdersTable';
import { useChartData } from './hooks/useChartData';
import { useMetricsCalculator } from './hooks/useMetricsCalculator';
import { useFormattedProducts } from './hooks/useFormattedProducts';
import { useFormattedOrders } from './hooks/useFormattedOrders';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

const KpiOverview = () => {
  const { stats, isLoading: isStatsLoading, error: statsError } = useWooStats('week');
  const { orders, isLoading: isOrdersLoading, error: ordersError } = useWooOrders(10); 
  const { products, isLoading: isProductsLoading, error: productsError } = useWooProducts(10);
  const { toast: toastUI } = useToast();
  
  // Use custom hooks to process data
  const dailyChartData = useChartData(orders);
  const { dailyRevenue, monthlyRevenue, totalProductsSold, conversionRate } = useMetricsCalculator(orders, stats);
  const topProductsList = useFormattedProducts(products);
  const recentOrders = useFormattedOrders(orders);
  
  const isLoading = isStatsLoading || isOrdersLoading || isProductsLoading;
  const hasError = !!(statsError || ordersError || productsError);
  const errorMessage = statsError?.message || ordersError?.message || productsError?.message;
  const hasData = !!((orders && orders.length > 0) || (products && products.length > 0) || stats);

  // Debug logging
  useEffect(() => {
    console.log("KpiOverview component state:", {
      isLoading,
      hasError,
      errorMessage,
      hasData,
      stats: stats || "No stats available",
      orders: orders?.length || 0,
      products: products?.length || 0
    });
  }, [isLoading, hasError, hasData, stats, orders, products, errorMessage]);

  // Notify if no data available but API connected
  useEffect(() => {
    if (!isLoading) {
      if (hasError) {
        console.error("WooCommerce API error:", errorMessage);
        toastUI({
          title: "API Connection Error",
          description: `Could not connect to WooCommerce API: ${errorMessage}`,
          variant: "destructive"
        });
        
        // Also use Sonner for a more visible toast
        toast.error("WooCommerce API Connection Error", {
          description: "Please check your API connection and credentials.",
        });
      } else if (!hasData) {
        toastUI({
          title: "No data available",
          description: "Could not load store data from WooCommerce API. Please check your API connection.",
          variant: "destructive"
        });
        
        toast.warning("No WooCommerce data available", {
          description: "Please check your API connection or ensure your store has products and orders.",
        });
      }
    }
  }, [isLoading, hasError, hasData, toastUI, errorMessage]);

  return (
    <div className="space-y-6">
      {/* API Status Alert */}
      {hasError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>WooCommerce API Error</AlertTitle>
          <AlertDescription>
            {errorMessage || "Error connecting to WooCommerce API. Please check your connection and credentials."}
          </AlertDescription>
        </Alert>
      )}
      
      {!isLoading && !hasError && hasData && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>WooCommerce Connected</AlertTitle>
          <AlertDescription>
            Successfully connected to WooCommerce API and loaded data.
          </AlertDescription>
        </Alert>
      )}
    
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
    </div>
  );
};

export default KpiOverview;
