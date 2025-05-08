
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Search, Filter, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WOO_API_BASE_URL, WOO_API_AUTH_PARAMS } from '@/utils/woocommerceApi';

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Fetch products with inventory information
  const { data: products, isLoading } = useQuery({
    queryKey: ['inventoryProducts', searchTerm],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${WOO_API_BASE_URL}/products?${searchTerm ? `search=${searchTerm}&` : ''}per_page=100&${WOO_API_AUTH_PARAMS}`, 
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching inventory products:', error);
        toast({
          title: "Data Fetch Error",
          description: "Could not load product inventory data from WooCommerce.",
          variant: "destructive",
        });
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">Inventory Management</h1>
              <p className="text-gray-500">Manage your inventory across all warehouses</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-sm text-gray-500 mr-2">Last updated:</span>
              <span className="text-sm font-medium">May 8, 2025, {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Inventory Status</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              ) : !products || products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>No inventory products found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku || 'N/A'}</TableCell>
                          <TableCell className="text-right">{product.price ? `€${product.price}` : 'N/A'}</TableCell>
                          <TableCell className="text-right">{product.stock_quantity ?? 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <span 
                              className={`px-2 py-1 rounded text-xs ${
                                product.stock_status === 'instock' 
                                  ? 'bg-green-100 text-green-800' 
                                  : product.stock_status === 'onbackorder'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.stock_status === 'instock' 
                                ? 'In Stock' 
                                : product.stock_status === 'onbackorder'
                                ? 'On Backorder'
                                : 'Out of Stock'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                  Low Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <div className="space-y-2">
                    {products && products
                      .filter(p => p.stock_quantity !== null && p.stock_quantity < 5 && p.stock_quantity > 0)
                      .map(product => (
                        <div key={`low-${product.id}`} className="flex justify-between items-center p-2 border-b">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-amber-500">{product.stock_quantity} left</span>
                        </div>
                      ))}
                    {(!products || products.filter(p => p.stock_quantity !== null && p.stock_quantity < 5 && p.stock_quantity > 0).length === 0) && (
                      <p className="text-center text-gray-500 py-4">No low stock items</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-primary" />
                  Stock Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Products</span>
                      <span className="font-bold">{products ? products.length : 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>In Stock</span>
                      <span className="font-bold">{products ? products.filter(p => p.stock_status === 'instock').length : 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Out of Stock</span>
                      <span className="font-bold">{products ? products.filter(p => p.stock_status === 'outofstock').length : 0}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryPage;
