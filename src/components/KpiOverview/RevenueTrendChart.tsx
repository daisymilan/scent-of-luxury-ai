
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LineChart from '../ui/LineChart';
import { Skeleton } from '@/components/ui/skeleton';

interface RevenueTrendChartProps {
  isLoading: boolean;
  dailyChartData: { name: string; value: number }[];
}

const RevenueTrendChart = ({ isLoading, dailyChartData }: RevenueTrendChartProps) => {
  return (
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
  );
};

export default RevenueTrendChart;
