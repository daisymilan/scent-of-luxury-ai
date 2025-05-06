
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Webhook } from 'lucide-react';

// Define the n8n configuration type
interface N8nConfigType {
  url: string;
  apiKey?: string;
  webhookUrl?: string;
}

// Save n8n config to localStorage
const saveN8nConfig = (config: N8nConfigType) => {
  localStorage.setItem('n8n_config', JSON.stringify(config));
};

// Get n8n config from localStorage
const getN8nConfig = (): N8nConfigType | null => {
  const config = localStorage.getItem('n8n_config');
  return config ? JSON.parse(config) : null;
};

const N8nConfig = () => {
  const { toast } = useToast();
  const [isConfigured, setIsConfigured] = useState(false);
  const [config, setConfig] = useState<N8nConfigType>({
    url: '',
    apiKey: '',
    webhookUrl: '',
  });
  const [isTesting, setIsTesting] = useState(false);
  const [useAuth, setUseAuth] = useState(false);

  useEffect(() => {
    const savedConfig = getN8nConfig();
    if (savedConfig) {
      setConfig(savedConfig);
      setIsConfigured(true);
      setUseAuth(!!savedConfig.apiKey);
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
    if (!config.url) {
      toast({
        title: "Validation Error",
        description: "Please fill in the n8n instance URL",
        variant: "destructive",
      });
      return;
    }

    // If auth is enabled but no API key is provided
    if (useAuth && !config.apiKey) {
      toast({
        title: "Validation Error",
        description: "Please provide an API key when authentication is enabled",
        variant: "destructive",
      });
      return;
    }

    // Save config to localStorage
    saveN8nConfig(useAuth ? config : { url: config.url, webhookUrl: config.webhookUrl });
    setIsConfigured(true);
    
    toast({
      title: "Configuration Saved",
      description: "n8n configuration has been saved",
    });
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      // Attempt to fetch the n8n health endpoint to test connectivity
      const response = await fetch(`${config.url}/api/v1/health`, {
        headers: useAuth && config.apiKey ? {
          'X-N8N-API-KEY': config.apiKey,
        } : {},
      });
      
      if (!response.ok) {
        throw new Error(`Connection test failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('n8n connection test response:', data);

      toast({
        title: "Connection Successful",
        description: "Successfully connected to n8n instance",
      });
    } catch (error) {
      console.error('n8n connection test error:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to n8n instance",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('n8n_config');
    setConfig({
      url: '',
      apiKey: '',
      webhookUrl: '',
    });
    setIsConfigured(false);
    setUseAuth(false);
    toast({
      title: "Configuration Reset",
      description: "n8n configuration has been reset",
    });
  };

  const handleTriggerWebhook = async () => {
    if (!config.webhookUrl) {
      toast({
        title: "Validation Error",
        description: "Please provide a webhook URL to trigger",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          source: window.location.origin,
          event: 'test_trigger',
        }),
      });

      toast({
        title: "Webhook Triggered",
        description: "The n8n webhook has been triggered successfully",
      });
    } catch (error) {
      console.error('Error triggering webhook:', error);
      toast({
        title: "Webhook Error",
        description: "Failed to trigger the n8n webhook",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>n8n Integration</CardTitle>
          <CardDescription>
            Connect to your n8n instance for workflow automation
          </CardDescription>
        </div>
        <Webhook className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">n8n Instance URL</Label>
          <Input
            id="url"
            name="url"
            value={config.url}
            onChange={handleChange}
            placeholder="https://your-n8n-instance.com"
          />
          <p className="text-xs text-gray-500">
            Enter the full URL of your n8n instance (e.g., https://your-n8n-instance.com)
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="use-auth" 
            checked={useAuth}
            onCheckedChange={setUseAuth}
          />
          <Label htmlFor="use-auth">Enable API Key Authentication</Label>
        </div>
        
        {useAuth && (
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              name="apiKey"
              value={config.apiKey}
              onChange={handleChange}
              type="password"
            />
            <p className="text-xs text-gray-500">
              API key for authenticating with your n8n instance
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input
            id="webhookUrl"
            name="webhookUrl"
            value={config.webhookUrl}
            onChange={handleChange}
            placeholder="https://your-n8n-instance.com/webhook/1234..."
          />
          <p className="text-xs text-gray-500">
            Webhook URL from n8n that you want to trigger from this application
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
          {isConfigured && config.webhookUrl && (
            <Button variant="secondary" onClick={handleTriggerWebhook}>
              Trigger Webhook
            </Button>
          )}
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

export default N8nConfig;
