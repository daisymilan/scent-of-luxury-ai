
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';

// Import our components
import OverviewTab from '@/components/reports/OverviewTab';
import ProductsTab from '@/components/reports/ProductsTab';
import OrdersTab from '@/components/reports/OrdersTab';
import IntegrationsTab from '@/components/reports/IntegrationsTab';
import PageHeader from '@/components/reports/PageHeader';
import TabsContainer, { TabItem } from '@/components/reports/TabsContainer';
import ErrorDisplay from '@/components/reports/ErrorDisplay';
import { logEnvironmentInfo } from '@/utils/debugUtils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tabErrors, setTabErrors] = useState<Record<string, string>>({});
  const [debugMode, setDebugMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});

  // Log environment info on mount for debugging
  useEffect(() => {
    logEnvironmentInfo();
    
    // Collect debug info
    setDebugInfo({
      apiBaseUrl: import.meta.env.VITE_BACKEND_URL || 'Not set',
      environment: import.meta.env.MODE,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }, []);

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

  // Check if we have any authentication errors
  const hasAuthError = Object.values(tabErrors).some(
    error => error.includes('401') || error.toLowerCase().includes('auth')
  );

  // Check if we have any method not allowed errors (405)
  const hasMethodNotAllowedError = Object.values(tabErrors).some(
    error => error.includes('405') || error.toLowerCase().includes('method not allowed')
  );

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

  const navigateToIntegrations = () => {
    setActiveTab("integrations");
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader 
            lastUpdated={currentDateTime} 
            onNavigateToIntegrations={navigateToIntegrations}
            hasAuthError={hasAuthError}
          />
          
          {hasMethodNotAllowedError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>API Method Error</AlertTitle>
              <AlertDescription>
                Your request was rejected with a 405 Method Not Allowed error. This indicates a possible CORS issue
                or proxy configuration problem. Try refreshing the page or check network settings.
              </AlertDescription>
            </Alert>
          )}
          
          {debugMode && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertTitle>Debug Information</AlertTitle>
              <AlertDescription>
                <pre className="text-xs mt-2 bg-slate-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
                <button 
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => console.log('Full Environment Info:', debugInfo)}
                >
                  Log Full Debug Info to Console
                </button>
              </AlertDescription>
            </Alert>
          )}
          
          <TabsContainer 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            onErrorClose={() => clearTabError(activeTab)}
          />
          
          <div className="mt-6 text-center">
            <button 
              onClick={toggleDebugMode}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {debugMode ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
          </div>
        </div>
      </main>
      
      {/* Error Dialog */}
      <ErrorDisplay 
        isVisible={errorDialogOpen}
        message={errorMessage}
        onClose={() => setErrorDialogOpen(false)}
        errorType="api"
      />
    </div>
  );
};

export default ReportsPage;
