
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Zap, Webhook } from 'lucide-react';
import KpiOverview from '@/components/KpiOverview';
import { useApiConnectionTest } from '@/utils/woocommerce/hooks';
import { getGrokApiConfig } from '@/utils/grokApi';
import { getN8nConfig } from '@/components/N8nConfig';

const OverviewTab = () => {
  const { data: isApiConnected, isLoading } = useApiConnectionTest();
  const isGrokConfigured = !!getGrokApiConfig();
  const isN8nConfigured = !!getN8nConfig();
  
  return (
    <>
      {isApiConnected ? (
        <KpiOverview />
      ) : (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Backend API Connection Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              {isLoading ? 'Checking API connection...' : 
                'Please ensure the backend API server is running and properly configured to connect to WooCommerce.'}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Integrations Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-primary mr-2" />
                  <span>MIN NEW YORK WooCommerce</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${isApiConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {isLoading ? 'Checking...' : (isApiConnected ? 'Connected' : 'Not Connected')}
                </span>
              </div>
              
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-primary mr-2" />
                  <span>Grok AI</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${isGrokConfigured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {isGrokConfigured ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                <div className="flex items-center">
                  <Webhook className="h-5 w-5 text-primary mr-2" />
                  <span>n8n Workflows</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${isN8nConfigured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {isN8nConfigured ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OverviewTab;
