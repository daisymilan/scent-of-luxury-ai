
import { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import WooCommerceConfig from '@/components/WooCommerceConfig';
import N8nConfig from '@/components/N8nConfig';
import GrokConfig from '@/components/GrokConfig';
import { useWooProducts, useWooOrders, useWooStats, getWooCommerceConfig, WOO_API_BASE_URL, WOO_API_AUTH_PARAMS } from '@/utils/woocommerce';
import { getGrokApiConfig } from '@/utils/grokApi';
import { getN8nConfig } from '@/components/N8nConfig';
import { useAuth } from '@/contexts/AuthContext';
import KpiOverview from '@/components/KpiOverview';
import { ShoppingCart, Search, Zap, Webhook } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { hasPermission, user } = useAuth();
  const isWooConfigured = !!getWooCommerceConfig();
  const isGrokConfigured = !!getGrokApiConfig();
  const isN8nConfigured = !!getN8nConfig();

  // Additional API data fetching for reports
  const { data: reportStats, isLoading: isLoadingReportStats } = useQuery({
    queryKey: ['wooReportStats'],
    queryFn: async () => {
      try {
        const response = await fetch(`${WOO_API_BASE_URL}/reports/sales?period=month&${WOO_API_AUTH_PARAMS}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching report stats:', error);
        return null;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: isWooConfigured,
  });
  
  // Only fetch data if WooCommerce is configured
  const { stats, isLoading: isLoadingStats } = isWooConfigured ? useWooStats('week') : { stats: null, isLoading: false };
  const { products, isLoading: isLoadingProducts } = isWooConfigured ? useWooProducts(5) : { products: [], isLoading: false };
  const { orders, isLoading: isLoadingOrders } = isWooConfigured ? useWooOrders(5) : { orders: [], isLoading: false };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">MIN NEW YORK Reports & Analytics</h1>
              <p className="text-gray-500">View detailed reports and analytics using real WooCommerce data</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-sm text-gray-500 mr-2">Last updated:</span>
              <span className="text-sm font-medium">{new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              {isWooConfigured ? (
                <KpiOverview />
              ) : (
                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>WooCommerce Integration Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">
                      Please configure WooCommerce integration to see MIN NEW YORK sales data.
                      Go to the Integrations tab to set up your WooCommerce connection.
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="col-span-full md:col-span-1">
                  <CardHeader>
                    <CardTitle>Integrations Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                        <div className="flex items-center">
                          <ShoppingCart className="h-5 w-5 text-primary mr-2" />
                          <span>MIN NEW YORK WooCommerce</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${isWooConfigured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {isWooConfigured ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                        <div className="flex items-center">
                          <Zap className="h-5 w-5 text-primary mr-2" />
                          <span>Grok AI</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${isGrokConfigured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {isGrokConfigured ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                        <div className="flex items-center">
                          <Webhook className="h-5 w-5 text-primary mr-2" />
                          <span>n8n Workflows</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${isN8nConfigured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {isN8nConfigured ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>MIN NEW YORK Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isWooConfigured ? (
                    <p className="text-gray-500">
                      Please configure your WooCommerce integration to see product data.
                    </p>
                  ) : isLoadingProducts ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      ))}
                    </div>
                  ) : products.length === 0 ? (
                    <p className="text-gray-500">No products found in your WooCommerce store.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3">Name</th>
                            <th className="text-right py-3">Price</th>
                            <th className="text-right py-3">Stock Status</th>
                            <th className="text-right py-3">Sales</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(product => (
                            <tr key={product.id} className="border-b">
                              <td className="py-3">{product.name}</td>
                              <td className="text-right py-3">${product.price}</td>
                              <td className="text-right py-3">
                                <span 
                                  className={`px-2 py-1 rounded text-xs ${
                                    product.stock_status === 'instock' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </td>
                              <td className="text-right py-3">{product.total_sales || 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
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
            </TabsContent>
            
            <TabsContent value="integrations">
              <div className="space-y-6">
                <Tabs defaultValue="woocommerce">
                  <TabsList className="mb-4">
                    <TabsTrigger value="woocommerce">WooCommerce</TabsTrigger>
                    <TabsTrigger value="grok">Grok AI</TabsTrigger>
                    <TabsTrigger value="n8n">n8n</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="woocommerce">
                    <WooCommerceConfig />
                  </TabsContent>
                  
                  <TabsContent value="grok">
                    <GrokConfig />
                  </TabsContent>
                  
                  <TabsContent value="n8n">
                    <N8nConfig />
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
