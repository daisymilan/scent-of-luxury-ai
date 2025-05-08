
import { BarChart2, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import DataCard from '../ui/DataCard';
import { Skeleton } from '@/components/ui/skeleton';

interface KpiCardsProps {
  isLoading: boolean;
  dailyRevenue: number;
  monthlyRevenue: number;
  totalProductsSold: number;
  conversionRate: string;
}

const KpiCards = ({ 
  isLoading,
  dailyRevenue,
  monthlyRevenue,
  totalProductsSold,
  conversionRate
}: KpiCardsProps) => {
  if (isLoading) {
    return (
      <>
        <div>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-10 w-32" />
        </div>
      </>
    );
  }

  return (
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
  );
};

export default KpiCards;
