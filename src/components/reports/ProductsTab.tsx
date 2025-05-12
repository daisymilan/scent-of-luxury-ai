
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { useWooProducts, getWooCommerceConfig } from '@/utils/woocommerce';

interface ProductsTabProps {
  onError: (message: string) => void;
}

const ProductsTab = ({ onError }: ProductsTabProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const isWooConfigured = !!getWooCommerceConfig();
  
  const { products, isLoading: isLoadingProducts, error: productsError, totalPages } = 
    isWooConfigured ? useWooProducts(20, currentPage) : { products: [], isLoading: false, error: null, totalPages: 0 };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle errors
  if (productsError) {
    onError(`Failed to load products: ${productsError.message}`);
  }

  return (
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
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Stock Status</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0].src} 
                            alt={product.name} 
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-xs">
                            No img
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku || 'N/A'}</TableCell>
                      <TableCell>${product.price}</TableCell>
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
                      <TableCell className="text-right">{product.total_sales || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNumber = i + 1;
                      // Show current page, first, last, and pages around current
                      if (
                        pageNumber === 1 || 
                        pageNumber === totalPages || 
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink 
                              isActive={pageNumber === currentPage}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsTab;
