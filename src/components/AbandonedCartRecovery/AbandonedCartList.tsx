
import { ShoppingCart, Mail, Smartphone, MoreHorizontal, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AbandonedCart } from './utils';

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
          {carts.map((cart) => (
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
  );
};

export default AbandonedCartList;
