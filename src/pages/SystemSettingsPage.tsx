
import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import WooCommerceConfig from "@/components/WooCommerceConfig";
import N8nConfig from "@/components/N8nConfig";

const SystemSettingsPage = () => {
  const [apiKeys, setApiKeys] = useState({
    googleAnalytics: "GA-12345-6",
    salesforceAPI: "SF-ABCDE-7890",
    inventorySystem: "INV-XYZ-9876",
  });
  
  const [integration, setIntegration] = useState({
    googleAnalytics: true,
    salesforce: true,
    shopify: false,
    mailchimp: true
  });

  const [backupSchedule, setBackupSchedule] = useState("daily");
  
  const handleApiKeyChange = (key: keyof typeof apiKeys, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = (section: string) => {
    toast.success(`${section} settings saved successfully`);
    // In a real app, these would be saved to a backend
  };

  const handleToggleIntegration = (key: keyof typeof integration) => {
    setIntegration(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">System Settings</h1>
        
        <Tabs defaultValue="integrations" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>
          
          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4">
            {/* WooCommerce Integration */}
            <WooCommerceConfig />
            
            {/* n8n Integration */}
            <N8nConfig />
            
            <Card>
              <CardHeader>
                <CardTitle>API Integrations</CardTitle>
                <CardDescription>Manage your third-party service connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="ga-key">Google Analytics</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleToggleIntegration("googleAnalytics")}
                    >
                      {integration.googleAnalytics ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                  <Input 
                    id="ga-key"
                    value={apiKeys.googleAnalytics}
                    onChange={(e) => handleApiKeyChange("googleAnalytics", e.target.value)}
                    disabled={!integration.googleAnalytics}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="sf-key">Salesforce</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleIntegration("salesforce")}
                    >
                      {integration.salesforce ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                  <Input 
                    id="sf-key"
                    value={apiKeys.salesforceAPI}
                    onChange={(e) => handleApiKeyChange("salesforceAPI", e.target.value)}
                    disabled={!integration.salesforce}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="inv-key">Inventory System</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleIntegration("shopify")}
                    >
                      {integration.shopify ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                  <Input 
                    id="inv-key"
                    value={apiKeys.inventorySystem}
                    onChange={(e) => handleApiKeyChange("inventorySystem", e.target.value)}
                    disabled={!integration.shopify}
                  />
                </div>
                
                <div className="pt-4">
                  <Button onClick={() => handleSaveSettings("API")}>Save API Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure account security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input type="checkbox" id="mfa" className="w-4 h-4" />
                    <Label htmlFor="mfa">Enable Two-Factor Authentication</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input type="checkbox" id="session-timeout" className="w-4 h-4" defaultChecked />
                    <Label htmlFor="session-timeout">Auto Session Timeout</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input type="checkbox" id="ip-restriction" className="w-4 h-4" />
                    <Label htmlFor="ip-restriction">IP Address Restriction</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeout-period">Session Timeout Period (minutes)</Label>
                    <Input id="timeout-period" type="number" defaultValue="30" />
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={() => handleSaveSettings("Security")}>Save Security Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Backup Tab */}
          <TabsContent value="backup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Recovery</CardTitle>
                <CardDescription>Configure system backup options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-schedule">Backup Schedule</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={backupSchedule === "daily" ? "default" : "outline"} 
                      onClick={() => setBackupSchedule("daily")}
                    >
                      Daily
                    </Button>
                    <Button 
                      variant={backupSchedule === "weekly" ? "default" : "outline"} 
                      onClick={() => setBackupSchedule("weekly")}
                    >
                      Weekly
                    </Button>
                    <Button 
                      variant={backupSchedule === "monthly" ? "default" : "outline"} 
                      onClick={() => setBackupSchedule("monthly")}
                    >
                      Monthly
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-time">Backup Time</Label>
                  <Input id="backup-time" type="time" defaultValue="02:00" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="retention-period">Retention Period (days)</Label>
                  <Input id="retention-period" type="number" defaultValue="30" />
                </div>
                
                <div className="pt-4">
                  <Button onClick={() => handleSaveSettings("Backup")}>Save Backup Settings</Button>
                </div>
                
                <div className="pt-6">
                  <Button variant="outline" className="w-full">Trigger Manual Backup</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SystemSettingsPage;
