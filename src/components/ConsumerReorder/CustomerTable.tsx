
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Customer {
  id: string;
  name: string;
  email: string;
  lastPurchase: string;
  lastPurchaseDate: string;
  daysSince: number;
  purchaseCount: number;
}

interface CustomerTableProps {
  customers: Customer[];
  selectedCustomers: string[];
  toggleCustomerSelection: (customerId: string) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  selectedCustomers,
  toggleCustomerSelection
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDetailsDialogOpen(true);
  };

  return (
    <>
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
            {customers.map((customer) => (
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
                  <Button size="sm" variant="ghost" onClick={() => handleViewDetails(customer)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View detailed information about this customer and their purchase history.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Name</Label>
                  <p className="font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Email</Label>
                  <p className="font-medium">{selectedCustomer.email}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">Last Purchase</Label>
                <p className="font-medium">{selectedCustomer.lastPurchase}</p>
                <p className="text-sm text-gray-500">
                  {new Date(selectedCustomer.lastPurchaseDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Days Since Purchase</Label>
                  <p className="font-medium">{selectedCustomer.daysSince} days</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Purchase Count</Label>
                  <p className="font-medium">{selectedCustomer.purchaseCount}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">Status</Label>
                <div className="mt-1">
                  {selectedCustomer.daysSince > 90 ? (
                    <Badge variant="destructive">Due for Reorder</Badge>
                  ) : selectedCustomer.daysSince > 60 ? (
                    <Badge variant="default">Approaching Reorder</Badge>
                  ) : (
                    <Badge variant="outline">Recent Purchase</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerTable;
