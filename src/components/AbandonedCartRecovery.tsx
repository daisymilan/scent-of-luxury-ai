
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

const AbandonedCartRecovery = () => {
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
                  <p className="text-lg font-semibold">23</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Recovered</p>
                  <p className="text-lg font-semibold">7</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Recovery Rate</p>
                  <p className="text-lg font-semibold">30.4%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Value Recovered</p>
                  <p className="text-lg font-semibold">$2,180</p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="active">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active Recovery (12)</TabsTrigger>
                <TabsTrigger value="completed">Completed (11)</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
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
                      {abandonedCarts.map((cart) => (
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
                            ${cart.value}
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
