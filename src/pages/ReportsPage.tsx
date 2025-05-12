
import { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';

// Import our components
import OverviewTab from '@/components/reports/OverviewTab';
import ProductsTab from '@/components/reports/ProductsTab';
import OrdersTab from '@/components/reports/OrdersTab';
import IntegrationsTab from '@/components/reports/IntegrationsTab';
import PageHeader from '@/components/reports/PageHeader';
import TabsContainer, { TabItem } from '@/components/reports/TabsContainer';
import ErrorDisplay from '@/components/reports/ErrorDisplay';

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

  // Current date and time for the "last updated" display
  const currentDateTime = new Date().toLocaleString();

  // Define tabs configuration
  const tabs: TabItem[] = [
    {
      value: "overview",
      label: "Overview",
      content: <OverviewTab />
    },
    {
      value: "products",
      label: "Products",
      content: <ProductsTab onError={handleError} />
    },
    {
      value: "orders",
      label: "Orders",
      content: <OrdersTab onError={handleError} />
    },
    {
      value: "integrations",
      label: "Integrations",
      content: <IntegrationsTab />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader lastUpdated={currentDateTime} />
          <TabsContainer 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>
      </main>
      
      {/* Error Dialog */}
      <ErrorDisplay 
        isVisible={errorDialogOpen}
        message={errorMessage}
        onClose={() => setErrorDialogOpen(false)}
      />
    </div>
  );
};

export default ReportsPage;
