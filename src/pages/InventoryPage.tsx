
import { useState } from 'react';
import { useWooProducts } from '@/utils/woocommerce/useProducts';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorDialog } from '@/components/ui/error-dialog';
import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

const { products: allProducts, isLoading, error } = useWooProducts();

  // Filter products based on search term
  const filteredProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle errors
  if (error && !errorDialogOpen) {
    setErrorMessage(`Failed to load inventory data: ${error.message}`);
    setErrorDialogOpen(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">MIN NEW YORK Inventory</h1>
              <p className="text-gray-500">Manage your product inventory</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-sm text-gray-500 mr-2">Total Products:</span>
              <span className="text-sm font-medium">{allProducts.length}</span>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex items-center w-full max-w-sm space-x-2">
                  <Input 
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No products found matching your search criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map(product => (
                        <TableRow key={product.id}>
                          <TableCell>
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0].src} 
                                alt={product.name} 
                                className="h-12 w-12 object-cover rounded"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                                No img
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku || 'N/A'}</TableCell>
                          <TableCell>
                            ${product.price || '0.00'}
                            {product.regular_price !== product.price && (
                              <span className="text-xs text-gray-500 ml-2 line-through">
                                ${product.regular_price}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {product.stock_quantity !== null ? product.stock_quantity : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <span 
                              className={`px-2 py-1 rounded text-xs ${
                                product.stock_status === 'instock' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
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
        </div>
      </main>

      {/* Error Dialog */}
      <ErrorDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        title="Error Loading Inventory"
        description={errorMessage}
        errorType="api"
      />
    </div>
  );
};

export default InventoryPage;
