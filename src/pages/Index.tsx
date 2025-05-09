import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import DashboardHeader from '@/components/DashboardHeader';
import RecentOrdersTable from '@/components/RecentOrdersTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KpiOverview from '@/components/KpiOverview';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, ArrowUpFromLine, MoreHorizontal, Clock } from 'lucide-react';
import AiAssistant from '@/components/AiAssistant';
import { getTotalSales, getTotalOrders } from '@/utils/woocommerce';
import { useToast } from '@/hooks/use-toast';

const IndexPage: React.FC = () => {
  const [totalSales, setTotalSales] = useState<number | null>(null);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const sales = await getTotalSales();
        setTotalSales(sales);
      } catch (error: any) {
        console.error("Failed to fetch total sales:", error);
        toast({
          title: "Error fetching sales data",
          description: error.message || "Failed to load sales data.",
          variant: "destructive",
        });
      }
    };

    const fetchOrdersData = async () => {
      try {
        const orders = await getTotalOrders();
        setTotalOrders(orders);
      } catch (error: any) {
        console.error("Failed to fetch total orders:", error);
        toast({
          title: "Error fetching orders data",
          description: error.message || "Failed to load orders data.",
          variant: "destructive",
        });
      }
    };

    fetchSalesData();
    fetchOrdersData();
  }, [toast]);

  const recentOrders = [
    {
      orderId: 1001,
      customerName: 'John Doe',
      orderDate: '2024-01-20',
      totalAmount: 150.00,
      status: 'Shipped',
    },
    {
      orderId: 1002,
      customerName: 'Jane Smith',
      orderDate: '2024-01-22',
      totalAmount: 220.50,
      status: 'Delivered',
    },
    {
      orderId: 1003,
      customerName: 'Alice Johnson',
      orderDate: '2024-01-25',
      totalAmount: 95.00,
      status: 'Pending',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - MiN New York</title>
        <meta name="description" content="Dashboard overview for MiN New York" />
      </Helmet>
      <div className="container mx-auto p-4">
        <DashboardHeader title="Dashboard Overview" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
              <CardDescription>Overall sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSales !== null ? totalSales.toFixed(2) : 'Loading...'}</div>
              <div className="text-sm text-gray-500">
                <ArrowUpFromLine className="inline-block mr-1 text-green-500" size={16} />
                12% increase from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
              <CardDescription>Number of orders placed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders !== null ? totalOrders : 'Loading...'}</div>
              <div className="text-sm text-gray-500">
                <ArrowDownToLine className="inline-block mr-1 text-red-500" size={16} />
                5% decrease from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Website Traffic</CardTitle>
              <CardDescription>Visits and user engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,450</div>
              <div className="text-sm text-gray-500">
                <ArrowUpFromLine className="inline-block mr-1 text-green-500" size={16} />
                8% increase from last month
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultvalue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">KPI Overview</TabsTrigger>
            <TabsTrigger value="recent">Recent Orders</TabsTrigger>
            <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <KpiOverview />
          </TabsContent>
          <TabsContent value="recent">
            <RecentOrdersTable orders={recentOrders} />
          </TabsContent>
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Monthly sales and order trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xl text-gray-700">
                  Interactive charts and graphs will be here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your store efficiently</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between">
              <Button>
                <Clock className="mr-2" size={16} />
                Schedule Report
              </Button>
              <Button variant="secondary">
                <MoreHorizontal className="mr-2" size={16} />
                View All Actions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AiAssistant />
    </>
  );
};

export default IndexPage;
