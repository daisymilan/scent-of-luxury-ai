
// AbandonedCartList.tsx
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WooOrder, WooProduct, WooCustomer } from '@/utils/woocommerce/types';

// Define a simple table structure if shadcn/ui table components aren't properly set up
const Table = ({ children, ...props }) => <table className="w-full" {...props}>{children}</table>;
const TableHeader = ({ children, ...props }) => <thead {...props}>{children}</thead>;
const TableBody = ({ children, ...props }) => <tbody {...props}>{children}</tbody>;
const TableRow = ({ children, ...props }) => <tr {...props}>{children}</tr>;
const TableHead = ({ children, ...props }) => <th className="px-4 py-3 text-left text-sm font-medium text-gray-500" {...props}>{children}</th>;
const TableCell = ({ children, ...props }) => <td className="px-4 py-4 text-sm" {...props}>{children}</td>;

// Define the AbandonedCart type here if it's not imported correctly
export interface AbandonedCart {
  id: string;
  customer: string;
  email: string;
  products: string[];
  value: number;
  time: string;
  status: 'pending' | 'in_progress' | 'recovered' | 'cancelled';
}

interface AbandonedCartListProps {
  carts: AbandonedCart[];
  onSendEmail?: (cartId: string) => void;
  onSendSMS?: (cartId: string) => void;
  onViewDetails?: (cartId: string) => void;
  onSendCustomEmail?: (cartId: string) => void;
  onMarkRecovered?: (cartId: string) => void;
  onCancelRecovery?: (cartId: string) => void;
  // Add these new props to accept WooCommerce data
  wooOrders?: WooOrder[];
  wooProducts?: WooProduct[];
  wooCustomers?: WooCustomer[];
}

const AbandonedCartList = ({ 
  carts,
  onSendEmail,
  onSendSMS,
  onViewDetails,
  onSendCustomEmail,
  onMarkRecovered,
  onCancelRecovery,
  // Include new props in destructuring, but we don't need to use them directly in this component
  wooOrders,
  wooProducts,
  wooCustomers
}: AbandonedCartListProps) => {
  // Helper function to format currency
  const formatCurrency = (value: number | string) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: AbandonedCart['status']) => {
    const statusConfig = {
      pending: { bgColor: 'bg-gray-400', label: 'Pending' },
      in_progress: { bgColor: 'bg-yellow-400', label: 'Recovery in progress' },
      recovered: { bgColor: 'bg-green-400', label: 'Recovered' },
      cancelled: { bgColor: 'bg-red-400', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <div className="flex items-center">
        <div className={`h-2 w-2 rounded-full ${config.bgColor} mr-2`}></div>
        <span>{config.label}</span>
      </div>
    );
  };

  // Render empty state if no carts
  if (!carts || carts.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <LucideIcons.ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-500">No abandoned carts found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Cart Value</TableHead>
            <TableHead>Abandoned</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carts.map((cart) => (
            <TableRow key={cart.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{cart.customer}</p>
                  <p className="text-xs text-gray-500">{cart.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="line-clamp-2">
                  {cart.products.map((product, index) => (
                    <span key={index} className="text-sm">
                      {product}
                      {index < cart.products.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium">${formatCurrency(cart.value)}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-gray-500">
                  <LucideIcons.Clock size={14} className="mr-1 flex-shrink-0" />
                  <span className="text-sm">{cart.time}</span>
                </div>
              </TableCell>
              <TableCell>
                {renderStatusBadge(cart.status || 'in_progress')}
              </TableCell>
              <TableCell>
                <div className="flex justify-end space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    title="Send Email Reminder"
                    onClick={() => onSendEmail?.(cart.id)}
                  >
                    <LucideIcons.Mail size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    title="Send SMS Reminder"
                    onClick={() => onSendSMS?.(cart.id)}
                  >
                    <LucideIcons.Smartphone size={16} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <LucideIcons.MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails?.(cart.id)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSendCustomEmail?.(cart.id)}>
                        Send Custom Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onMarkRecovered?.(cart.id)}>
                        Mark as Recovered
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onCancelRecovery?.(cart.id)}
                      >
                        Cancel Recovery
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AbandonedCartList;
