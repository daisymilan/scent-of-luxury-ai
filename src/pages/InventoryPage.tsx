import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import DashboardHeader from '@/components/DashboardHeader';
import { getProducts } from '@/utils/woocommerce';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchIcon, ArrowDownIcon, ArrowUpIcon, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error: any) {
        console.error('Failed to fetch products:', error);
        toast({
          title: "Error fetching products",
          description: error.message || "Failed to load products. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchProducts();
  }, [toast]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedProducts = React.useMemo(() => {
    if (!sortColumn) return products;

    return [...products].sort((a: any, b: any) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === null || aValue === undefined) return sortOrder === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortOrder === 'asc' ? 1 : -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [products, sortColumn, sortOrder]);

  const filteredProducts = sortedProducts.filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Helmet>
        <title>Inventory - MIN NEW YORK</title>
      </Helmet>
      <DashboardHeader title="Inventory" />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Products Overview</CardTitle>
          <CardDescription>Manage your product inventory and track stock levels.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="instock">In Stock</TabsTrigger>
              <TabsTrigger value="outofstock">Out of Stock</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 shadow-sm"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="relative mt-4 overflow-auto">
                <Table>
                  <TableCaption>A comprehensive list of products in your inventory.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('name')}>
                          Product Name
                          {sortColumn === 'name' && (
                            <>
                              {sortOrder === 'asc' ? (
                                <ArrowDownIcon className="ml-1 h-4 w-4" />
                              ) : (
                                <ArrowUpIcon className="ml-1 h-4 w-4" />
                              )}
                            </>
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('sku')}>
                          SKU
                          {sortColumn === 'sku' && (
                            <>
                              {sortOrder === 'asc' ? (
                                <ArrowDownIcon className="ml-1 h-4 w-4" />
                              ) : (
                                <ArrowUpIcon className="ml-1 h-4 w-4" />
                              )}
                            </>
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('stock_quantity')}>
                          Stock
                          {sortColumn === 'stock_quantity' && (
                            <>
                              {sortOrder === 'asc' ? (
                                <ArrowDownIcon className="ml-1 h-4 w-4" />
                              ) : (
                                <ArrowUpIcon className="ml-1 h-4 w-4" />
                              )}
                            </>
                          )}
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>
                          {product.stock_quantity !== null ? product.stock_quantity : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">${product.price}</TableCell>
                      </TableRow>
                    ))}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="instock">
              <div>
                <h2>In Stock Products</h2>
                {/* Content for in-stock products */}
              </div>
            </TabsContent>
            <TabsContent value="outofstock">
              <div>
                <h2>Out of Stock Products</h2>
                {/* Content for out-of-stock products */}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;
