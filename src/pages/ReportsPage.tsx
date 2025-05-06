
import { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import WooCommerceConfig from '@/components/WooCommerceConfig';
import N8nConfig from '@/components/N8nConfig';
import GrokConfig from '@/components/GrokConfig';
import { useWooProducts, useWooOrders, useWooStats, getWooCommerceConfig } from '@/utils/woocommerceApi';
import { getGrokApiConfig } from '@/utils/grokApi';
import { getN8nConfig } from '@/components/N8nConfig';
import { useAuth } from '@/contexts/AuthContext';
import DataCard from '@/components/ui/DataCard';
import { ShoppingCart, Search, Zap, Webhook } from 'lucide-react';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { hasPermission, user } = useAuth();
  const isWooConfigured = !!getWooCommerceConfig();
  const isGrokConfigured = !!getGrokApiConfig();
  const isN8nConfigured = !!getN8nConfig();
  
  // Only fetch data if WooCommerce is configured
  const { stats, isLoading: isLoadingStats } = isWooConfigured ? useWooStats() : { stats: null, isLoading: false };
  const { products, isLoading: isLoadingProducts } = isWooConfigured ? useWooProducts(5) : { products: [], isLoading: false };
  const { orders, isLoading: isLoadingOrders } = isWooConfigured ? useWooOrders(5) : { orders: [], isLoading: false };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">Reports & Analytics</h1>
              <p className="text-gray-500">View detailed reports and analytics including WooCommerce data</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-sm text-gray-500 mr-2">Last updated:</span>
              <span className="text-sm font-medium">May 6, 2025, 10:24 AM</span>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {!isWooConfigured ? (
                  <Card className="col-span-full">
                    <CardHeader>
                      <CardTitle>WooCommerce Not Configured</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">
                        Please configure your WooCommerce integration in the Integrations tab to see store analytics.
                      </p>
                    </CardContent>
                  </Card>
                ) : isLoadingStats ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle><Skeleton className="h-4 w-32" /></CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle><Skeleton className="h-4 w-32" /></CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle><Skeleton className="h-4 w-32" /></CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <DataCard 
                      title="Total Revenue" 
                      value={`$${stats?.totalRevenue || '0.00'}`} 
                      change={8.4} 
                      icon={<ShoppingCart className="h-4 w-4" />}
                    />
                    
                    <DataCard 
                      title="Total Orders" 
                      value={stats?.totalOrders || 0} 
                      change={3.2} 
                      icon={<ShoppingCart className="h-4 w-4" />}
                    />
                    
                    <DataCard 
                      title="Active Products" 
                      value={stats?.totalProducts || 0} 
                      change={0} 
                      icon={<Search className="h-4 w-4" />}
                    />
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DataCard 
                    title="Integrations Status" 
                    value={`${(isWooConfigured ? 1 : 0) + (isGrokConfigured ? 1 : 0) + (isN8nConfigured ? 1 : 0)}/3`} 
                    className="h-full"
                  />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                      <div className="flex items-center">
                        <ShoppingCart className="h-5 w-5 text-primary mr-2" />
                        <span>WooCommerce</span>
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
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
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
                  <CardTitle>Recent Orders</CardTitle>
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
                                {order.billing.first_name} {order.billing.last_name}
                              </td>
                              <td className="text-right py-3">
                                {new Date(order.date_created).toLocaleDateString()}
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
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
