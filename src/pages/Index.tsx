
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/DashboardHeader';
import KpiOverview from '@/components/KpiOverview';
import B2BLeadGeneration from '@/components/B2BLeadGeneration';
import SEODashboard from '@/components/SEODashboard';
import AbandonedCartRecovery from '@/components/AbandonedCartRecovery';
import AiAssistant from '@/components/AiAssistant';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">CEO Dashboard</h1>
              <p className="text-gray-500">Welcome back to your MiN NEW YORK command center</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-sm text-gray-500 mr-2">Last updated:</span>
              <span className="text-sm font-medium">May 6, 2025, 10:24 AM</span>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">Overview</TabsTrigger>
              <TabsTrigger value="b2b" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">B2B Leads</TabsTrigger>
              <TabsTrigger value="seo" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">SEO</TabsTrigger>
              <TabsTrigger value="cart" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">Abandoned Carts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <KpiOverview />
            </TabsContent>
            
            <TabsContent value="b2b" className="space-y-6">
              <B2BLeadGeneration />
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-6">
              <SEODashboard />
            </TabsContent>
            
            <TabsContent value="cart" className="space-y-6">
              <AbandonedCartRecovery />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <AiAssistant />
    </div>
  );
};

export default Index;
