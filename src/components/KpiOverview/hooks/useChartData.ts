
import { useState, useEffect } from 'react';
import { WooOrder } from '@/utils/woocommerce/types';

export const useChartData = (orders: WooOrder[] | undefined) => {
  const [dailyChartData, setDailyChartData] = useState<{ name: string; value: number }[]>([]);

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
      console.log("No orders available for chart data");
      setDailyChartData([]);
    }
  }, [orders]);

  return dailyChartData;
};
