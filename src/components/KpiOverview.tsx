
import { BarChart2, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import DataCard from './ui/DataCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LineChart from './ui/LineChart';
import { salesData, topProducts } from '../lib/mockData';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const KpiOverview = () => {
  const dailyChartData = salesData.daily.labels.map((label, index) => ({
    name: label,
    value: salesData.daily.datasets[index]
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <DataCard
        title="Daily Revenue"
        value={`$${salesData.daily.total.toLocaleString()}`}
        change={salesData.daily.change}
        icon={<DollarSign />}
      />
      <DataCard
        title="Monthly Revenue"
        value={`$${salesData.monthly.total.toLocaleString()}`}
        change={salesData.monthly.change}
        icon={<BarChart2 />}
      />
      <DataCard
        title="Total Products Sold"
        value="383"
        change={4.6}
        icon={<ShoppingBag />}
      />
      <DataCard
        title="Conversion Rate"
        value="3.2%"
        change={0.8}
        icon={<TrendingUp />}
      />
      
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Revenue Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart 
            data={dailyChartData}
            height={240}
            showGrid={true}
            showAxis={true}
          />
        </CardContent>
      </Card>
      
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover"
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KpiOverview;
