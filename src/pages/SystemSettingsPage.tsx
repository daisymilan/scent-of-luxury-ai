
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/DashboardHeader';
import N8nConfig from '@/components/N8nConfig';
import WooCommerceConfig from '@/components/WooCommerceConfig';
import GrokConfig from '@/components/GrokConfig';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Webhook, Zap, Settings } from 'lucide-react';

const SystemSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("integrations");
  const { user, hasPermission } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">System Settings</h1>
              <p className="text-gray-500">
                Configure system integrations and settings
                {user?.role && ` (${user.role} permissions)`}
              </p>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
              <TabsTrigger value="integrations" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">
                Integrations
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">
                User Management
              </TabsTrigger>
              <TabsTrigger value="backup" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">
                Backup & Restore
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">
                System Logs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="integrations">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-white shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">WooCommerce</CardTitle>
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="pb-4">
                      Connect to your WooCommerce store to display product and order data
                    </CardDescription>
                    <div className="text-sm text-primary font-medium cursor-pointer" 
                      onClick={() => setActiveTab("woocommerce")}>
                      Configure →
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">n8n Workflows</CardTitle>
                    <Webhook className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="pb-4">
                      Connect to your n8n instance for workflow automation
                    </CardDescription>
                    <div className="text-sm text-primary font-medium cursor-pointer"
                      onClick={() => setActiveTab("n8n")}>
                      Configure →
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Grok AI</CardTitle>
                    <Zap className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="pb-4">
                      Connect to Grok AI API for advanced analytics and insights
                    </CardDescription>
                    <div className="text-sm text-primary font-medium cursor-pointer"
                      onClick={() => setActiveTab("grok")}>
                      Configure →
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {activeTab === "woocommerce" && (
                <WooCommerceConfig />
              )}
              
              {activeTab === "n8n" && (
                <N8nConfig />
              )}
              
              {activeTab === "grok" && (
                <GrokConfig />
              )}
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage system users and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    This feature will allow you to manage users and their permissions.
                    Currently available roles: CEO, CCO, Commercial Director, Regional Manager, 
                    Marketing Manager, Production Manager, Customer Support, and Social Media Manager.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="backup">
              <Card>
                <CardHeader>
                  <CardTitle>Backup & Restore</CardTitle>
                  <CardDescription>
                    Backup and restore your system data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    This feature will allow you to create backups of your system data and restore from backups.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>
                    View system logs and activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    This feature will allow you to view system logs and activity.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SystemSettingsPage;
