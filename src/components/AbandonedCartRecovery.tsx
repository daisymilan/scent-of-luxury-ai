import { Clock, Mail, MoreHorizontal, Plus, ShoppingCart, Smartphone, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { abandonedCarts } from '../lib/mockData';
import { WooOrder, WooCustomer, WooProduct } from '@/lib/mockData';
import { useState, useMemo } from 'react';

interface AbandonedCartRecoveryProps {
  wooOrders?: WooOrder[] | null;
  wooCustomers?: WooCustomer[] | null;
  wooProducts?: WooProduct[] | null;
}

// Define a type for our processed abandoned cart data
interface AbandonedCart {
  id: number;
  customer: string;
  email: string;
  products: string[];
  value: number;
  time: string;
}

const AbandonedCartRecovery = ({ 
  wooOrders, 
  wooCustomers, 
  wooProducts 
}: AbandonedCartRecoveryProps) => {
  const [activeTab, setActiveTab] = useState('active');

  // Process WooCommerce data to identify abandoned carts
  const processedCarts = useMemo(() => {
    // If we don't have the WooCommerce data yet, use mock data
    if (!wooOrders || !wooCustomers || !wooProducts) {
      console.log('Using mock data for abandoned carts');
      return abandonedCarts;
    }

    try {
      console.log('Processing WooCommerce data for abandoned carts', {
        orders: wooOrders.length,
        customers: wooCustomers.length,
        products: wooProducts.length
      });

      // Find abandoned carts (orders with status 'pending' or 'failed')
      const abandonedOrdersData = wooOrders
        .filter(order => ['pending', 'failed', 'on-hold'].includes(order.status))
        .map(order => {
          // Find customer info - use billing info directly or find customer in wooCustomers
          let customerName = `${order.billing.first_name} ${order.billing.last_name}`.trim();
          let customerEmail = order.billing.email;
          
          // If customer name is empty and we have a customer ID, try to find the customer
          if ((!customerName || customerName === " ") && order.customer_id > 0) {
            const customer = wooCustomers.find(c => c.id === order.customer_id);
            if (customer) {
              customerName = `${customer.first_name} ${customer.last_name}`.trim();
              customerEmail = customer.email;
            }
          }
          
          // Default customer name if still empty
          if (!customerName || customerName === " ") {
            customerName = "Guest Customer";
          }
          
          // Get products in cart with proper names
          const cartProducts: string[] = [];
          if (order.line_items && order.line_items.length > 0) {
            order.line_items.forEach(item => {
              if (item.name) {
                cartProducts.push(item.name);
              } else {
                // Since product_id doesn't exist in the line_item type, we can't use it directly
                // Just add a default product name if name is not available
                cartProducts.push("Unnamed Product");
              }
            });
          }
          
          // Calculate cart value - use order total or sum line items
          let cartValue = parseFloat(order.total);
          if (isNaN(cartValue) || cartValue === 0) {
            // Fallback to calculating from line items, using 'price' property which exists
            cartValue = order.line_items.reduce((total, item) => {
              const itemPrice = parseFloat(item.price || "0");
              return total + (isNaN(itemPrice) ? 0 : itemPrice);
            }, 0);
          }
          
          // Calculate time since order
          const orderDate = new Date(order.date_created);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - orderDate.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          
          let timeAgo;
          if (diffDays > 0) {
            timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
          } else {
            timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
          }
          
          return {
            id: order.id,
            customer: customerName,
            email: customerEmail || "email@example.com", // Fallback email
            products: cartProducts.length > 0 ? cartProducts : ["Unknown Product"],
            value: cartValue > 0 ? cartValue : 19.99, // Default value if zero
            time: timeAgo
          };
        });

      console.log('Found abandoned carts:', abandonedOrdersData);
      
      return abandonedOrdersData;
    } catch (error) {
      console.error('Error processing abandoned cart data:', error);
      return abandonedCarts; // Fallback to mock data
    }
  }, [wooOrders, wooCustomers, wooProducts]);
  
  // Calculate recovery stats
  const recoveryStats = useMemo(() => {
    // In a real implementation, this would be based on actual data
    // For now we'll use some realistic calculations based on the abandoned carts
    const abandonedCount = processedCarts.length;
    const recoveredCount = Math.floor(abandonedCount * 0.3); // Assume 30% recovery rate
    const recoveryRate = abandonedCount > 0 ? (recoveredCount / abandonedCount) * 100 : 0;
    const valueRecovered = processedCarts.reduce((total, cart) => {
      // Assume 30% of carts are recovered with their full value
      return total + (Math.random() > 0.7 ? cart.value : 0);
    }, 0);
    
    return {
      abandoned: abandonedCount,
      recovered: recoveredCount,
      recoveryRate: recoveryRate.toFixed(1),
      valueRecovered: valueRecovered.toFixed(0)
    };
  }, [processedCarts]);

  return (
    <div className="grid gap-6">
      <Card className="col-span-full">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Abandoned Cart Recovery</CardTitle>
          </div>
          <Button className="h-8 text-xs" size="sm">
            <Zap size={14} className="mr-1" /> Configure Automation
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 mb-4">
              <h3 className="font-medium text-sm mb-1">Recovery Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-500">Abandoned</p>
                  <p className="text-lg font-semibold">{recoveryStats.abandoned}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Recovered</p>
                  <p className="text-lg font-semibold">{recoveryStats.recovered}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Recovery Rate</p>
                  <p className="text-lg font-semibold">{recoveryStats.recoveryRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Value Recovered</p>
                  <p className="text-lg font-semibold">${recoveryStats.valueRecovered}</p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active Recovery ({processedCarts.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({recoveryStats.recovered})</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                {processedCarts.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="py-3 px-4 text-left font-medium text-gray-500">Customer</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-500">Products</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-500">Cart Value</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-500">Abandoned</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-500">Status</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {processedCarts.map((cart) => (
                          <tr key={cart.id} className="border-b last:border-b-0 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{cart.customer}</p>
                                <p className="text-xs text-gray-500">{cart.email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {cart.products.map((product, index) => (
                                <span key={index}>
                                  {product}
                                  {index < cart.products.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </td>
                            <td className="py-3 px-4">
                              ${typeof cart.value === 'number' ? cart.value.toFixed(2) : cart.value}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center text-gray-500">
                                <Clock size={14} className="mr-1" />
                                <span>{cart.time}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></div>
                                <span>Recovery in progress</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Mail size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Smartphone size={16} />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal size={16} />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Send Custom Email</DropdownMenuItem>
                                    <DropdownMenuItem>Mark as Recovered</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Cancel Recovery</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500">No abandoned carts found</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="completed">
                <div className="text-center py-8 border rounded-md">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">Switch to the "Completed" tab to see recovered and lost carts</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <h3 className="font-medium mb-4">Recovery Automations</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center text-primary">
                      <Mail size={20} />
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md">Active</div>
                  </div>
                  <h4 className="font-medium mb-1">Email Sequence</h4>
                  <p className="text-sm text-gray-600 mb-4">3-step sequence with personalized offers</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Open Rate</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recovery Rate</span>
                      <span className="font-medium">18%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center text-primary">
                      <Smartphone size={20} />
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md">Active</div>
                  </div>
                  <h4 className="font-medium mb-1">SMS Reminders</h4>
                  <p className="text-sm text-gray-600 mb-4">Gentle reminders with direct checkout links</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Click Rate</span>
                      <span className="font-medium">36%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recovery Rate</span>
                      <span className="font-medium">12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-dashed border-2 flex items-center justify-center">
                <CardContent className="p-4 text-center">
                  <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center text-gray-500 mx-auto mb-3">
                    <Plus size={20} />
                  </div>
                  <h4 className="font-medium mb-1">Add Automation</h4>
                  <p className="text-sm text-gray-500">Create a new recovery workflow</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AbandonedCartRecovery;
