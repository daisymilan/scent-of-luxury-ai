
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  return (
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
                <Button size="sm" variant="ghost">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerTable;
