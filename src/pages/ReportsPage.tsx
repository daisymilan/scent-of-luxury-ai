
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
  const [tabErrors, setTabErrors] = useState<Record<string, string>>({});

  // Handler for errors from child components
  const handleError = (message: string, tabId?: string) => {
    if (tabId) {
      // Store error with the specific tab
      setTabErrors(prev => ({
        ...prev,
        [tabId]: message
      }));
    } else if (!errorDialogOpen) {
      // Show as a dialog for general errors
      setErrorMessage(message);
      setErrorDialogOpen(true);
    }
  };

  const clearTabError = (tabId?: string) => {
    if (tabId) {
      setTabErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[tabId];
        return newErrors;
      });
    } else {
      setTabErrors({});
    }
  };

  // Clear error when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setErrorDialogOpen(false);
  };

  // Current date and time for the "last updated" display
  const currentDateTime = new Date().toLocaleString();

  // Define tabs configuration
  const tabs: TabItem[] = [
    {
      value: "overview",
      label: "Overview",
      content: <OverviewTab />,
      hasError: !!tabErrors["overview"],
      errorMessage: tabErrors["overview"]
    },
    {
      value: "products",
      label: "Products",
      content: <ProductsTab onError={(msg) => handleError(msg, "products")} />,
      hasError: !!tabErrors["products"],
      errorMessage: tabErrors["products"]
    },
    {
      value: "orders",
      label: "Orders",
      content: <OrdersTab onError={(msg) => handleError(msg, "orders")} />,
      hasError: !!tabErrors["orders"],
      errorMessage: tabErrors["orders"]
    },
    {
      value: "integrations",
      label: "Integrations",
      content: <IntegrationsTab />,
      hasError: !!tabErrors["integrations"],
      errorMessage: tabErrors["integrations"]
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
            onTabChange={handleTabChange}
            onErrorClose={() => clearTabError(activeTab)}
          />
        </div>
      </main>
      
      {/* Error Dialog */}
      <ErrorDisplay 
        isVisible={errorDialogOpen}
        message={errorMessage}
        onClose={() => setErrorDialogOpen(false)}
        errorType={errorMessage.includes('401') ? 'auth' : 'api'}
      />
    </div>
  );
};

export default ReportsPage;
