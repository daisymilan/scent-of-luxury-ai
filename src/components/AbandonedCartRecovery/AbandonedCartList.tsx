
import { ShoppingCart, Mail, Smartphone, MoreHorizontal, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AbandonedCart } from './utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AbandonedCartListProps {
  carts: AbandonedCart[];
}

const AbandonedCartList = ({ carts }: AbandonedCartListProps) => {
  if (carts.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
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
            <TableHead>Actions</TableHead>
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
                {cart.products.map((product, index) => (
                  <span key={index}>
                    {product}
                    {index < cart.products.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </TableCell>
              <TableCell>
                ${typeof cart.value === 'number' ? cart.value.toFixed(2) : cart.value}
              </TableCell>
              <TableCell>
                <div className="flex items-center text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>{cart.time}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></div>
                  <span>Recovery in progress</span>
                </div>
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AbandonedCartList;
