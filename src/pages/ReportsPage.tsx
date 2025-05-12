
import { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorDialog } from '@/components/ui/error-dialog';

// Import our new component tabs
import OverviewTab from '@/components/reports/OverviewTab';
import ProductsTab from '@/components/reports/ProductsTab';
import OrdersTab from '@/components/reports/OrdersTab';
import IntegrationsTab from '@/components/reports/IntegrationsTab';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handler for errors from child components
  const handleError = (message: string) => {
    if (!errorDialogOpen) {
      setErrorMessage(message);
      setErrorDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">MIN NEW YORK Reports & Analytics</h1>
              <p className="text-gray-500">View detailed reports and analytics using real WooCommerce data</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-sm text-gray-500 mr-2">Last updated:</span>
              <span className="text-sm font-medium">{new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>
            
            <TabsContent value="products">
              <ProductsTab onError={handleError} />
            </TabsContent>
            
            <TabsContent value="orders">
              <OrdersTab onError={handleError} />
            </TabsContent>
            
            <TabsContent value="integrations">
              <IntegrationsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Error Dialog */}
      <ErrorDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        title="Error Loading Data"
        description={errorMessage}
        errorType="api"
      />
    </div>
  );
};

export default ReportsPage;
