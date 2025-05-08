
import { BarChart2, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import DataCard from './ui/DataCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LineChart from './ui/LineChart';
import { useWooStats, useWooOrders, useWooProducts } from '@/utils/woocommerceApi';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

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
      {isLoading ? (
        <>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <DataCard
            title="Daily Revenue"
            value={`$${dailyRevenue.toLocaleString()}`}
            change={8.4}
            icon={<DollarSign />}
          />
          <DataCard
            title="Monthly Revenue"
            value={`$${monthlyRevenue.toLocaleString()}`}
            change={5.2}
            icon={<BarChart2 />}
          />
          <DataCard
            title="Total Products Sold"
            value={totalProductsSold.toString()}
            change={4.6}
            icon={<ShoppingBag />}
          />
          <DataCard
            title="Conversion Rate"
            value={conversionRate}
            change={0.8}
            icon={<TrendingUp />}
          />
        </>
      )}
      
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Revenue Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-60 w-full" />
          ) : (
            <LineChart 
              data={dailyChartData}
              height={240}
              showGrid={true}
              showAxis={true}
            />
          )}
        </CardContent>
      </Card>
      
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-14 w-14 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {topProductsList.length === 0 ? (
                <p className="text-muted-foreground">No product data available</p>
              ) : (
                topProductsList.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <div className="h-14 w-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{product.name}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                        <p>{product.sales} units sold</p>
                        <p className="font-medium">${product.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KpiOverview;
