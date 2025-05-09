
import { useWooStats, useWooOrders, useWooProducts } from '@/utils/woocommerce';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import KpiCards from './KpiCards';
import RevenueTrendChart from './RevenueTrendChart';
import TopSellingProducts from './TopSellingProducts';

const KpiOverview = () => {
  const { stats, isLoading: isStatsLoading } = useWooStats('week');
  const { orders, isLoading: isOrdersLoading } = useWooOrders(5);
  const { products, isLoading: isProductsLoading } = useWooProducts(5);
  const [dailyChartData, setDailyChartData] = useState<{ name: string; value: number }[]>([]);
  const { toast } = useToast();

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

      setDailyChartData(chartData);
    }
  }, [orders]);

  // Use mock data as fallback if no real data is available
  useEffect(() => {
    if (dailyChartData.length === 0) {
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
      
      setDailyChartData(sampleData);
    }
  }, [dailyChartData]);

  useEffect(() => {
    if (stats && !isStatsLoading) {
      console.log("WooCommerce stats loaded:", stats);
    }
  }, [stats, isStatsLoading]);

  const isLoading = isStatsLoading || isOrdersLoading || isProductsLoading;

  // Calculate revenue metrics
  const dailyRevenue = stats?.totalRevenue ? parseFloat(stats.totalRevenue) : 0;
  const monthlyRevenue = dailyRevenue * 30; // Approximate monthly revenue
  const totalProductsSold = stats?.totalOrders || 0;
  const conversionRate = "3.2%"; // This could be calculated from actual data in the future

  // Format top products from WooCommerce data
  const topProductsList = products
    ?.sort((a, b) => b.total_sales - a.total_sales)
    ?.slice(0, 4)
    ?.map(product => ({
      id: product.id,
      name: product.name,
      sales: product.total_sales || 0,
      revenue: parseFloat(product.price) * (product.total_sales || 0),
      image: product.images && product.images.length > 0 ? product.images[0].src : 'placeholder.svg'
    })) || [];

  // If there's an issue loading data, show a toast notification
  useEffect(() => {
    if (!isLoading && !stats && !orders?.length && !products?.length) {
      toast({
        title: "Data loading issue",
        description: "Could not load store data. Using sample data instead.",
        variant: "destructive",
      });
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
        topProductsList={topProductsList}
      />
    </div>
  );
};

export default KpiOverview;
