
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { WooCommerceConfig, saveWooCommerceConfig, getWooCommerceConfig } from '@/utils/woocommerceApi';

const WooCommerceConfig = () => {
  const { toast } = useToast();
  const [isConfigured, setIsConfigured] = useState(false);
  const [config, setConfig] = useState<WooCommerceConfig>({
    url: '',
    consumerKey: '',
    consumerSecret: '',
    version: '3',
  });
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const savedConfig = getWooCommerceConfig();
    if (savedConfig) {
      setConfig(savedConfig);
      setIsConfigured(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Simple validation
    if (!config.url || !config.consumerKey || !config.consumerSecret) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Save config to localStorage
    saveWooCommerceConfig(config);
    setIsConfigured(true);
    
    toast({
      title: "Configuration Saved",
      description: "WooCommerce configuration has been saved",
    });
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      // Test the connection by making a simple request
      const response = await fetch(
        `${config.url}/wp-json/wc/v${config.version}/products?per_page=1`,
        {
          headers: {
            'Authorization': `Basic ${btoa(`${config.consumerKey}:${config.consumerSecret}`)}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`API test failed: ${response.statusText}`);
      }
      
      await response.json(); // Just to confirm we got valid JSON back

      toast({
        title: "Connection Successful",
        description: "Successfully connected to WooCommerce API",
      });
    } catch (error) {
      console.error('WooCommerce connection test error:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('woocommerce_config');
    setConfig({
      url: '',
      consumerKey: '',
      consumerSecret: '',
      version: '3',
    });
    setIsConfigured(false);
    toast({
      title: "Configuration Reset",
      description: "WooCommerce configuration has been reset",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>WooCommerce Integration</CardTitle>
        <CardDescription>
          Connect to your WooCommerce store to display product and order data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Store URL</Label>
          <Input
            id="url"
            name="url"
            value={config.url}
            onChange={handleChange}
            placeholder="https://your-store.com"
          />
          <p className="text-xs text-gray-500">
            Enter the full URL of your WooCommerce store (e.g., https://your-store.com)
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="consumerKey">Consumer Key</Label>
          <Input
            id="consumerKey"
            name="consumerKey"
            value={config.consumerKey}
            onChange={handleChange}
            type="password"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="consumerSecret">Consumer Secret</Label>
          <Input
            id="consumerSecret"
            name="consumerSecret"
            value={config.consumerSecret}
            onChange={handleChange}
            type="password"
          />
          <p className="text-xs text-gray-500">
            You can generate API keys in your WooCommerce dashboard under 
            WooCommerce &gt; Settings &gt; Advanced &gt; REST API
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="version">API Version</Label>
          <Input
            id="version"
            name="version"
            value={config.version}
            onChange={handleChange}
            placeholder="3"
          />
          <p className="text-xs text-gray-500">
            Default is v3 for newer WooCommerce installations
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button onClick={handleSave}>Save Configuration</Button>
          <Button 
            variant="outline" 
            onClick={handleTest} 
            disabled={isTesting}
          >
            {isTesting ? "Testing..." : "Test Connection"}
          </Button>
          {isConfigured && (
            <Button variant="destructive" onClick={handleReset}>
              Reset Configuration
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WooCommerceConfig;
