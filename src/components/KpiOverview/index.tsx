
import { useWooStats, useWooOrders, useWooProducts } from '@/utils/woocommerce';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import KpiCards from './KpiCards';
import RevenueTrendChart from './RevenueTrendChart';
import TopSellingProducts from './TopSellingProducts';

const KpiOverview = () => {
  const { stats, isLoading: isStatsLoading } = useWooStats('week');
  const { orders, isLoading: isOrdersLoading } = useWooOrders(10); // Increased to fetch more orders
  const { products, isLoading: isProductsLoading } = useWooProducts(10); // Increased to fetch more products
  const [dailyChartData, setDailyChartData] = useState<{ name: string; value: number }[]>([]);
  const { toast } = useToast();

  // Debug logging
  useEffect(() => {
    console.log("WooCommerce stats:", stats);
    console.log("WooCommerce orders:", orders);
    console.log("WooCommerce products:", products);
  }, [stats, orders, products]);

  useEffect(() => {
    // Generate chart data from orders if available
    if (orders && orders.length > 0) {
      // Group orders by date and sum totals
      const ordersByDate = orders.reduce((acc: Record<string, number>, order) => {
        const date = new Date(order.date_created).toLocaleDateString();
        acc[date] = (acc[date] || 0) + parseFloat(order.total);
        return acc;
      }, {});

      // Convert to chart format
      const chartData = Object.entries(ordersByDate)
        .map(([date, value]) => ({
          name: date,
          value: Number(value.toFixed(2))
        }))
        .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
        .slice(-7); // Last 7 days

      console.log("Generated chart data from orders:", chartData);
      setDailyChartData(chartData);
    } else {
      console.log("No orders available for chart data, using sample data");
      // Use sample data if no orders
      generateSampleChartData();
    }
  }, [orders]);

  // Generate sample chart data if no real data is available
  const generateSampleChartData = () => {
    // Fallback to sample data
    const sampleDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString();
    });
    
    const sampleData = sampleDates.map(date => ({
      name: date,
      value: Math.floor(Math.random() * 5000) + 1000
    }));
    
    console.log("Using sample chart data:", sampleData);
    setDailyChartData(sampleData);
  };

  useEffect(() => {
    if (dailyChartData.length === 0) {
      generateSampleChartData();
    }
  }, [dailyChartData]);

  const isLoading = isStatsLoading || isOrdersLoading || isProductsLoading;

  // Calculate revenue metrics with fallbacks for empty data
  const dailyRevenue = stats?.totalRevenue ? parseFloat(stats.totalRevenue) : 0;
  const monthlyRevenue = dailyRevenue * 30; // Approximate monthly revenue
  const totalProductsSold = stats?.totalOrders || 0;
  const conversionRate = "3.2%"; // This could be calculated from actual data in the future

  // Format top products from WooCommerce data with fallbacks
  const topProductsList = products && products.length > 0
    ? products
        .filter(product => product.name && product.id) // Ensure we have valid products
        .sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0))
        .slice(0, 4)
        .map(product => ({
          id: product.id,
          name: product.name,
          sales: product.total_sales || 0,
          revenue: parseFloat(product.price || '0') * (product.total_sales || 0),
          image: product.images && product.images.length > 0 ? product.images[0].src : '/placeholder.svg'
        }))
    : [];

  // Notify if no data available but API connected
  useEffect(() => {
    if (!isLoading) {
      if (orders && orders.length === 0 && products && products.length > 0) {
        toast({
          title: "No order data available",
          description: "Connected to WooCommerce API but no orders found. Using sample data for visualization.",
          duration: 5000,
        });
      } else if (!stats && !orders?.length && !products?.length) {
        toast({
          title: "Data loading issue",
          description: "Could not load store data. Using sample data instead.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  }, [isLoading, stats, orders, products, toast]);

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
        topProductsList={topProductsList.length > 0 ? topProductsList : [
          { id: 1, name: "Sample Product 1", sales: 42, revenue: 4200, image: "/placeholder.svg" },
          { id: 2, name: "Sample Product 2", sales: 36, revenue: 3600, image: "/placeholder.svg" },
          { id: 3, name: "Sample Product 3", sales: 28, revenue: 2800, image: "/placeholder.svg" },
          { id: 4, name: "Sample Product 4", sales: 21, revenue: 2100, image: "/placeholder.svg" }
        ]}
      />
    </div>
  );
};

export default KpiOverview;
