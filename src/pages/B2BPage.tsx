
import DashboardHeader from '@/components/DashboardHeader';
import B2BLeadGeneration from '@/components/B2BLeadGeneration';
import N8nConfig from '@/components/N8nConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const B2BPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">B2B Management</h1>
              <p className="text-gray-500">Manage your B2B leads and accounts</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-sm text-gray-500 mr-2">Last updated:</span>
              <span className="text-sm font-medium">May 6, 2025, 10:24 AM</span>
            </div>
          </div>
          
          <Tabs defaultValue="leads" className="space-y-4">
            <TabsList>
              <TabsTrigger value="leads">Lead Management</TabsTrigger>
              <TabsTrigger value="automation">Automation Config</TabsTrigger>
            </TabsList>
            <TabsContent value="leads">
              <B2BLeadGeneration />
            </TabsContent>
            <TabsContent value="automation">
              <N8nConfig />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default B2BPage;
