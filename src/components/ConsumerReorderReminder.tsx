
import React, { useState } from 'react';
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

interface Customer {
  id: string;
  name: string;
  email: string;
  lastPurchase: string;
  lastPurchaseDate: string;
  daysSince: number;
  purchaseCount: number;
}

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Jordan Smith',
    email: 'j.smith@example.com',
    lastPurchase: 'Moon Dust EDP 75ml',
    lastPurchaseDate: '2025-03-10',
    daysSince: 58,
    purchaseCount: 3
  },
  {
    id: '2',
    name: 'Alex Wong',
    email: 'alex.w@example.com',
    lastPurchase: 'Dune EDP 50ml',
    lastPurchaseDate: '2025-02-15',
    daysSince: 81,
    purchaseCount: 5
  },
  {
    id: '3',
    name: 'Taylor Johnson',
    email: 'taylor@example.com',
    lastPurchase: 'Coda EDP 75ml',
    lastPurchaseDate: '2025-04-01',
    daysSince: 36,
    purchaseCount: 2
  },
  {
    id: '4',
    name: 'Jamie Rivera',
    email: 'jamie.r@example.com',
    lastPurchase: 'Dahab EDP 50ml',
    lastPurchaseDate: '2024-12-12',
    daysSince: 146,
    purchaseCount: 8
  },
  {
    id: '5',
    name: 'Casey Lee',
    email: 'casey.lee@example.com',
    lastPurchase: 'Moon Dust EDP 75ml',
    lastPurchaseDate: '2025-01-20',
    daysSince: 107,
    purchaseCount: 4
  }
];

const ConsumerReorderReminder: React.FC = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [reminderType, setReminderType] = useState<string>('email');
  const [reminderSubject, setReminderSubject] = useState<string>('Time to reorder your favorite fragrance');
  const [reminderMessage, setReminderMessage] = useState<string>(
    'Hello valued customer,\n\nWe noticed it\'s been a while since you purchased your favorite MiN NEW YORK fragrance. We thought you might be running low and wanted to offer you a special 10% discount on your next purchase when you use code REORDER10.\n\nWarm regards,\nMiN NEW YORK Team'
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [sendingReminders, setSendingReminders] = useState<boolean>(false);
  
  const { toast } = useToast();
  
  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };
  
  const selectAllCustomers = () => {
    setSelectedCustomers(MOCK_CUSTOMERS.map(c => c.id));
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
              disabled={selectedCustomers.length === MOCK_CUSTOMERS.length}
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
              {MOCK_CUSTOMERS.map((customer) => (
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
                      <p className="text-xs text-gray-500">{customer.lastPurchaseDate}</p>
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
