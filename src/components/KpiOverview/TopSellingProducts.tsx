
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  image: string;
}

interface TopSellingProductsProps {
  isLoading: boolean;
  topProductsList: TopProduct[];
}

const TopSellingProducts = ({ isLoading, topProductsList }: TopSellingProductsProps) => {
  return (
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
  );
};

export default TopSellingProducts;
