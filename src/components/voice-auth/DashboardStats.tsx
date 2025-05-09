
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DashboardStats {
  sales: number;
  orders: number;
  customers: number;
}

interface Order {
  id: number;
  customer: string;
  total: number;
}

interface DashboardStatsProps {
  stats: DashboardStats;
  recentOrders: Order[];
  processedCommand?: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  stats, 
  recentOrders,
  processedCommand 
}) => {
  return (
    <div className="space-y-4">
      {processedCommand && (
        <div className="bg-muted p-2 rounded-md text-sm">
          <p>Your command: "{processedCommand}"</p>
        </div>
      )}

      <h3 className="text-sm font-medium uppercase tracking-wide">Dashboard Information</h3>
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-primary/5">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Sales</p>
            <p className="text-2xl font-semibold">${stats.sales.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Orders</p>
            <p className="text-2xl font-semibold">{stats.orders}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Customers</p>
            <p className="text-2xl font-semibold">{stats.customers}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border">
        <h4 className="px-4 py-2 text-sm font-medium">Recent Orders</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="text-right">${order.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
