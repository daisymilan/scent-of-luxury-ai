
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useWooOrders, useWooCustomers, WooOrder, WooCustomer } from '@/utils/woocommerceApi';

interface Customer {
  id: string;
  name: string;
  email: string;
  lastPurchase: string;
  lastPurchaseDate: string;
  daysSince: number;
  purchaseCount: number;
}

const ConsumerReorderReminder: React.FC = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [reminderType, setReminderType] = useState<string>('email');
  const [reminderSubject, setReminderSubject] = useState<string>('Time to reorder your favorite fragrance');
  const [reminderMessage, setReminderMessage] = useState<string>(
    'Hello valued customer,\n\nWe noticed it\'s been a while since you purchased your favorite MiN NEW YORK fragrance. We thought you might be running low and wanted to offer you a special 10% discount on your next purchase when you use code REORDER10.\n\nWarm regards,\nMiN NEW YORK Team'
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [sendingReminders, setSendingReminders] = useState<boolean>(false);
  const [processedCustomers, setProcessedCustomers] = useState<Customer[]>([]);
  
  const { toast } = useToast();
  
  // Fetch orders and customers from WooCommerce API
  const { orders, isLoading: isLoadingOrders } = useWooOrders(100); // Get up to 100 orders
  const { customers, isLoading: isLoadingCustomers } = useWooCustomers(100); // Get up to 100 customers
  
  // Process the data to create our customer reorder list
  useEffect(() => {
    if (!isLoadingOrders && !isLoadingCustomers && orders && customers) {
      // Map of customer ID to their purchase info
      const customerPurchases: Record<number, {
        lastPurchase: string;
        lastPurchaseDate: string;
        daysSince: number;
        purchaseCount: number;
      }> = {};
      
      // Process orders to get purchase information
      orders.forEach(order => {
        const customerId = order.customer_id;
        const orderDate = new Date(order.date_created);
        const today = new Date();
        const daysSince = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Get the name of the first product in the order
        const productName = order.line_items[0]?.name || "Unknown Product";
        
        if (!customerPurchases[customerId] || new Date(customerPurchases[customerId].lastPurchaseDate) < orderDate) {
          // Update the last purchase info for this customer
          customerPurchases[customerId] = {
            lastPurchase: productName,
            lastPurchaseDate: order.date_created,
            daysSince: daysSince,
            purchaseCount: customerPurchases[customerId]?.purchaseCount + 1 || 1
          };
        } else {
          // Increment the purchase count
          customerPurchases[customerId].purchaseCount += 1;
        }
      });
      
      // Combine with customer info
      const processed: Customer[] = customers
        .filter(customer => customerPurchases[customer.id]) // Only include customers with purchases
        .map(customer => ({
          id: customer.id.toString(),
          name: `${customer.first_name} ${customer.last_name}`,
          email: customer.email,
          lastPurchase: customerPurchases[customer.id].lastPurchase,
          lastPurchaseDate: customerPurchases[customer.id].lastPurchaseDate,
          daysSince: customerPurchases[customer.id].daysSince,
          purchaseCount: customerPurchases[customer.id].purchaseCount
        }))
        .sort((a, b) => b.daysSince - a.daysSince); // Sort by days since last purchase (descending)
      
      setProcessedCustomers(processed);
    }
  }, [orders, customers, isLoadingOrders, isLoadingCustomers]);
  
  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };
  
  const selectAllCustomers = () => {
    setSelectedCustomers(processedCustomers.map(c => c.id));
  };
  
  const clearSelection = () => {
    setSelectedCustomers([]);
  };
  
  const sendReminders = () => {
    setSendingReminders(true);
    
    // Simulate API call
    setTimeout(() => {
      setSendingReminders(false);
      setDialogOpen(false);
      
      toast({
        title: 'Reminders Sent',
        description: `Successfully sent reminders to ${selectedCustomers.length} customers.`,
      });
      
      setSelectedCustomers([]);
    }, 1500);
  };
  
  // If there's no data yet, show a loading state
  if (isLoadingOrders || isLoadingCustomers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Consumer Reorder Reminders</CardTitle>
          <CardDescription>Loading customer data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p>Fetching customer data from WooCommerce...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If we have no customers or orders, show an empty state
  if (processedCustomers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Consumer Reorder Reminders</CardTitle>
          <CardDescription>No customer purchase data available</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <p className="mb-4">There are no customers with purchase history to display.</p>
          <p className="text-sm text-gray-500">
            This could be because there are no orders in your WooCommerce store, 
            or the orders don't have associated customer accounts.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumer Reorder Reminders</CardTitle>
        <CardDescription>Send targeted reminders to customers who may need to reorder products</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAllCustomers}
              disabled={selectedCustomers.length === processedCustomers.length}
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearSelection}
              disabled={selectedCustomers.length === 0}
            >
              Clear Selection
            </Button>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                disabled={selectedCustomers.length === 0}
              >
                Send Reorder Reminder ({selectedCustomers.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Reorder Reminder</DialogTitle>
                <DialogDescription>
                  Configure your reorder reminder for {selectedCustomers.length} selected customers.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Reminder Type</Label>
                  <Select value={reminderType} onValueChange={setReminderType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="both">Email & SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input 
                    value={reminderSubject}
                    onChange={(e) => setReminderSubject(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea 
                    rows={6}
                    value={reminderMessage}
                    onChange={(e) => setReminderMessage(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={sendReminders} disabled={sendingReminders}>
                  {sendingReminders ? 'Sending...' : 'Send Reminders'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <div className="flex items-center justify-center">#</div>
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Days Since</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedCustomers.map((customer) => (
                <TableRow key={customer.id} className={selectedCustomers.includes(customer.id) ? 'bg-primary/5' : ''}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => toggleCustomerSelection(customer.id)}
                        className="w-4 h-4"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{customer.lastPurchase}</p>
                      <p className="text-xs text-gray-500">{new Date(customer.lastPurchaseDate).toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>{customer.daysSince} days</TableCell>
                  <TableCell>
                    {customer.daysSince > 90 ? (
                      <Badge variant="destructive">Due for Reorder</Badge>
                    ) : customer.daysSince > 60 ? (
                      <Badge variant="default">Approaching Reorder</Badge>
                    ) : (
                      <Badge variant="outline">Recent Purchase</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsumerReorderReminder;
