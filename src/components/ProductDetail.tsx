
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  useWooProduct, 
  useWooProductVariation, 
  useWooOrder, 
  useWooCustomer 
} from '@/utils/woocommerce/hooks';
import { ErrorDialog } from '@/components/ui/error-dialog';

const ProductDetail = () => {
  const [productId, setProductId] = useState<number | null>(null);
  const [variationId, setVariationId] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [tempProductId, setTempProductId] = useState('');
  const [tempVariationId, setTempVariationId] = useState('');
  const [tempOrderId, setTempOrderId] = useState('');
  const [tempCustomerId, setTempCustomerId] = useState('');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Use our custom hooks to fetch data
  const { 
    data: product, 
    isLoading: isLoadingProduct, 
    error: productError 
  } = useWooProduct(productId);
  
  const { 
    data: variation, 
    isLoading: isLoadingVariation,
    error: variationError
  } = useWooProductVariation(productId, variationId);
  
  const {
    data: order,
    isLoading: isLoadingOrder,
    error: orderError
  } = useWooOrder(orderId);
  
  const {
    data: customer,
    isLoading: isLoadingCustomer,
    error: customerError
  } = useWooCustomer(customerId);

  // Handle form submissions
  const handleFetchProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(tempProductId);
    if (!isNaN(id)) {
      setProductId(id);
      // Reset variation when changing product
      setVariationId(null);
      setTempVariationId('');
    }
  };

  const handleFetchVariation = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(tempVariationId);
    if (!isNaN(id) && productId) {
      setVariationId(id);
    } else {
      setErrorMessage('You must enter a valid product ID first');
      setErrorDialogOpen(true);
    }
  };

  const handleFetchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(tempOrderId);
    if (!isNaN(id)) {
      setOrderId(id);
    }
  };

  const handleFetchCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(tempCustomerId);
    if (!isNaN(id)) {
      setCustomerId(id);
    }
  };

  // Handle errors from any of our queries
  const error = productError || variationError || orderError || customerError;
  if (error && !errorDialogOpen) {
    setErrorMessage(error.message);
    setErrorDialogOpen(true);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>MIN Products & Variations</CardTitle>
          <CardDescription>View MIN product details from the WooCommerce API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <form onSubmit={handleFetchProduct} className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="productId">Product ID</Label>
                <Input 
                  id="productId" 
                  type="number" 
                  placeholder="Enter product ID" 
                  value={tempProductId}
                  onChange={(e) => setTempProductId(e.target.value)}
                />
              </div>
              <Button type="submit">Fetch</Button>
            </form>
            
            {isLoadingProduct ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : product ? (
              <div className="space-y-2 border p-3 rounded-md">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-sm">Price: ${product.price}</p>
                <p className="text-sm">Stock: {product.stock_status}</p>
                {product.images && product.images[0] && (
                  <img 
                    src={product.images[0].src} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
              </div>
            ) : productId ? (
              <p className="text-sm text-red-500">Failed to load product</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <form onSubmit={handleFetchVariation} className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="variationId">Variation ID</Label>
                <Input 
                  id="variationId" 
                  type="number" 
                  placeholder="Enter variation ID" 
                  value={tempVariationId}
                  onChange={(e) => setTempVariationId(e.target.value)}
                  disabled={!productId}
                />
              </div>
              <Button type="submit" disabled={!productId}>Fetch</Button>
            </form>
            
            {isLoadingVariation ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : variation ? (
              <div className="space-y-2 border p-3 rounded-md">
                <h3 className="font-medium text-lg">Variation: {variation.sku || 'N/A'}</h3>
                <p className="text-sm">Price: ${variation.price}</p>
                <p className="text-sm">Stock: {variation.stock_status}</p>
                {variation.image && (
                  <img 
                    src={variation.image.src} 
                    alt="Product variation" 
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
              </div>
            ) : variationId ? (
              <p className="text-sm text-red-500">Failed to load variation</p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders & Customers</CardTitle>
          <CardDescription>View orders and customer details from the WooCommerce API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <form onSubmit={handleFetchOrder} className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="orderId">Order ID</Label>
                <Input 
                  id="orderId" 
                  type="number" 
                  placeholder="Enter order ID" 
                  value={tempOrderId}
                  onChange={(e) => setTempOrderId(e.target.value)}
                />
              </div>
              <Button type="submit">Fetch</Button>
            </form>
            
            {isLoadingOrder ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : order ? (
              <div className="space-y-2 border p-3 rounded-md">
                <h3 className="font-medium text-lg">Order #{order.id}</h3>
                <p className="text-sm">Status: {order.status}</p>
                <p className="text-sm">Total: ${order.total}</p>
                <p className="text-sm">Date: {new Date(order.date_created).toLocaleDateString()}</p>
                <p className="text-sm">Customer: {order.billing?.first_name} {order.billing?.last_name}</p>
                {order.line_items && (
                  <div>
                    <p className="text-sm font-medium">Items:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      {order.line_items.map((item, index) => (
                        <li key={index}>{item.name} x{item.quantity} (${item.total})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : orderId ? (
              <p className="text-sm text-red-500">Failed to load order</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <form onSubmit={handleFetchCustomer} className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="customerId">Customer ID</Label>
                <Input 
                  id="customerId" 
                  type="number" 
                  placeholder="Enter customer ID" 
                  value={tempCustomerId}
                  onChange={(e) => setTempCustomerId(e.target.value)}
                />
              </div>
              <Button type="submit">Fetch</Button>
            </form>
            
            {isLoadingCustomer ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : customer ? (
              <div className="space-y-2 border p-3 rounded-md">
                <h3 className="font-medium text-lg">{customer.first_name} {customer.last_name}</h3>
                <p className="text-sm">Email: {customer.email}</p>
                <p className="text-sm">Username: {customer.username}</p>
                <p className="text-sm">Orders: {customer.orders_count}</p>
                <p className="text-sm">Total spent: ${customer.total_spent}</p>
                {customer.billing && (
                  <div>
                    <p className="text-sm font-medium">Billing Address:</p>
                    <p className="text-xs">
                      {customer.billing.address_1}<br />
                      {customer.billing.city}, {customer.billing.state} {customer.billing.postcode}<br />
                      {customer.billing.country}
                    </p>
                  </div>
                )}
              </div>
            ) : customerId ? (
              <p className="text-sm text-red-500">Failed to load customer</p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <ErrorDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        title="API Error"
        description={errorMessage}
        errorType="api"
      />
    </div>
  );
};

export default ProductDetail;
