
import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const PreferencesPage = () => {
  const [preferences, setPreferences] = useState({
    notifications: {
      emailAlerts: true,
      salesReports: true,
      inventoryAlerts: true,
      marketingUpdates: false
    },
    display: {
      theme: "light",
      dashboardLayout: "grid",
      language: "english"
    }
  });

  const handleNotificationToggle = (key: keyof typeof preferences.notifications) => {
    setPreferences({
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: !preferences.notifications[key]
      }
    });
  };

  const handleDisplayChange = (key: keyof typeof preferences.display, value: string) => {
    setPreferences({
      ...preferences,
      display: {
        ...preferences.display,
        [key]: value
      }
    });
  };

  const handleSavePreferences = () => {
    toast.success("Preferences saved successfully");
    // In a real app, you would save these preferences to a backend
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">User Preferences</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-alerts" className="text-base">Email Alerts</Label>
                  <p className="text-sm text-gray-500">Receive important notifications via email</p>
                </div>
                <Switch 
                  id="email-alerts" 
                  checked={preferences.notifications.emailAlerts}
                  onCheckedChange={() => handleNotificationToggle("emailAlerts")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sales-reports" className="text-base">Sales Reports</Label>
                  <p className="text-sm text-gray-500">Weekly sales performance updates</p>
                </div>
                <Switch 
                  id="sales-reports" 
                  checked={preferences.notifications.salesReports}
                  onCheckedChange={() => handleNotificationToggle("salesReports")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="inventory-alerts" className="text-base">Inventory Alerts</Label>
                  <p className="text-sm text-gray-500">Get notified when inventory is running low</p>
                </div>
                <Switch 
                  id="inventory-alerts" 
                  checked={preferences.notifications.inventoryAlerts}
                  onCheckedChange={() => handleNotificationToggle("inventoryAlerts")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-updates" className="text-base">Marketing Updates</Label>
                  <p className="text-sm text-gray-500">Get updates about marketing campaigns</p>
                </div>
                <Switch 
                  id="marketing-updates" 
                  checked={preferences.notifications.marketingUpdates}
                  onCheckedChange={() => handleNotificationToggle("marketingUpdates")}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Display Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize how the application appears</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme-select">Theme</Label>
                <Select 
                  value={preferences.display.theme}
                  onValueChange={(value) => handleDisplayChange("theme", value)}
                >
                  <SelectTrigger id="theme-select">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="layout-select">Dashboard Layout</Label>
                <Select 
                  value={preferences.display.dashboardLayout}
                  onValueChange={(value) => handleDisplayChange("dashboardLayout", value)}
                >
                  <SelectTrigger id="layout-select">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language-select">Language</Label>
                <Select 
                  value={preferences.display.language}
                  onValueChange={(value) => handleDisplayChange("language", value)}
                >
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSavePreferences}>Save Preferences</Button>
        </div>
      </main>
    </div>
  );
};

export default PreferencesPage;
