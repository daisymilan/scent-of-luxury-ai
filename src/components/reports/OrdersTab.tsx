
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWooOrders, getWooCommerceConfig } from '@/utils/woocommerce';

interface OrdersTabProps {
  onError: (message: string) => void;
}

const OrdersTab = ({ onError }: OrdersTabProps) => {
  const isWooConfigured = !!getWooCommerceConfig();
  const { orders, isLoading: isLoadingOrders, error } = 
    isWooConfigured ? useWooOrders(5) : { orders: [], isLoading: false, error: null };
  
  // Handle errors
  if (error) {
    onError(`Failed to load orders: ${error.message}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>MIN NEW YORK Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {!isWooConfigured ? (
          <p className="text-gray-500">
            Please configure your WooCommerce integration to see order data.
          </p>
        ) : isLoadingOrders ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found in your WooCommerce store.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Order #</th>
                  <th className="text-left py-3">Customer</th>
                  <th className="text-right py-3">Date</th>
                  <th className="text-right py-3">Status</th>
                  <th className="text-right py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3">#{order.id}</td>
                    <td className="py-3">
                      {order.billing?.first_name} {order.billing?.last_name}
                    </td>
                    <td className="text-right py-3">
                      {order.date_created ? new Date(order.date_created).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="text-right py-3">
                      <span 
                        className={`px-2 py-1 rounded text-xs ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Unknown'}
                      </span>
                    </td>
                    <td className="text-right py-3">${order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersTab;
