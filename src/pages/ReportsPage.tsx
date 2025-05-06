
import { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import WooCommerceConfig from '@/components/WooCommerceConfig';
import { useWooProducts, useWooOrders, useWooStats, getWooCommerceConfig } from '@/utils/woocommerceApi';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const isConfigured = !!getWooCommerceConfig();
  
  // Only fetch data if WooCommerce is configured
  const { stats, isLoading: isLoadingStats } = isConfigured ? useWooStats() : { stats: null, isLoading: false };
  const { products, isLoading: isLoadingProducts } = isConfigured ? useWooProducts(5) : { products: [], isLoading: false };
  const { orders, isLoading: isLoadingOrders } = isConfigured ? useWooOrders(5) : { orders: [], isLoading: false };

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
              <TabsTrigger value="woo-config">WooCommerce Config</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {!isConfigured ? (
                  <Card className="col-span-full">
                    <CardHeader>
                      <CardTitle>WooCommerce Not Configured</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">
                        Please configure your WooCommerce integration to see store analytics.
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
                    <Card>
                      <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">${stats?.totalRevenue || '0.00'}</div>
                        <p className="text-gray-500">From all orders</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Total Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{stats?.totalOrders || 0}</div>
                        <p className="text-gray-500">From WooCommerce</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Active Products</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{stats?.totalProducts || 0}</div>
                        <p className="text-gray-500">In your catalog</p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isConfigured ? (
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
                  {!isConfigured ? (
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
            
            <TabsContent value="woo-config">
              <WooCommerceConfig />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
