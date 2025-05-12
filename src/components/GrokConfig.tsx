
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Zap } from 'lucide-react';
import { 
  GrokApiConfig, 
  saveGrokApiConfig, 
  getGrokApiConfig, 
  DEFAULT_GROK_CONFIG,
  HARDCODED_GROK_CONFIG,
  callGrokApi
} from '@/utils/grokApi';

const GrokConfig = () => {
  const { toast } = useToast();
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [config, setConfig] = useState<GrokApiConfig>({
    apiKey: '',
    model: 'grok-1',
  });

  useEffect(() => {
    // Check for hardcoded config first
    if (HARDCODED_GROK_CONFIG) {
      setConfig({
        ...HARDCODED_GROK_CONFIG,
        apiKey: HARDCODED_GROK_CONFIG.apiKey.substring(0, 12) + '...' // Show only part of API key for security
      });
      setIsConfigured(true);
      toast({
        title: "Using Hardcoded Configuration",
        description: "Grok API is configured with hardcoded credentials",
      });
    } else {
      const savedConfig = getGrokApiConfig();
      if (savedConfig) {
        setConfig(savedConfig);
        setIsConfigured(true);
      }
    }
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModelChange = (value: string) => {
    setConfig((prev) => ({
      ...prev,
      model: value,
    }));
  };

  const handleSave = () => {
    // Simple validation
    if (!config.apiKey && !HARDCODED_GROK_CONFIG) {
      toast({
        title: "Validation Error",
        description: "Please provide a Grok API key",
        variant: "destructive",
      });
      return;
    }

    // Save config to localStorage if not using hardcoded
    if (!HARDCODED_GROK_CONFIG) {
      saveGrokApiConfig(config);
    }
    setIsConfigured(true);
    
    toast({
      title: "Configuration Saved",
      description: "Grok API configuration has been saved",
    });
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      // Test the API with a simple query
      const response = await callGrokApi("What's the status of sales today?");
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Grok API",
      });
      
      console.log('Test response:', response);
    } catch (error) {
      console.error('Grok API test error:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Grok API",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleReset = () => {
    if (HARDCODED_GROK_CONFIG) {
      toast({
        title: "Cannot Reset Hardcoded Configuration",
        description: "The API is configured with hardcoded credentials that cannot be reset",
        variant: "destructive", 
      });
      return;
    }
    
    localStorage.removeItem('grok_api_config');
    setConfig(DEFAULT_GROK_CONFIG);
    setIsConfigured(false);
    toast({
      title: "Configuration Reset",
      description: "Grok API configuration has been reset",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Grok AI Integration</CardTitle>
          <CardDescription>
            {HARDCODED_GROK_CONFIG 
              ? "Using hardcoded Grok API credentials for immediate use" 
              : "Connect to Grok AI API for advanced analytics and insights"}
          </CardDescription>
        </div>
        <Zap className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            name="apiKey"
            value={config.apiKey}
            onChange={handleChange}
            type="password"
            placeholder="xai-lgYF3e2MO1TvHnXhq0UCKYSwDtUOBkNmL0fnOEw4FBniTHDnC6KG..."
            disabled={!!HARDCODED_GROK_CONFIG}
          />
          <p className="text-xs text-gray-500">
            {HARDCODED_GROK_CONFIG 
              ? "Using hardcoded API key" 
              : "Enter your Grok API key to enable AI-powered insights"}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select 
            value={config.model} 
            onValueChange={handleModelChange}
            disabled={!!HARDCODED_GROK_CONFIG}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grok-1">Grok-1</SelectItem>
              <SelectItem value="grok-2">Grok-2</SelectItem>
              <SelectItem value="grok-3">Grok-3</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            {HARDCODED_GROK_CONFIG 
              ? "Using hardcoded model selection" 
              : "Select the Grok model to use for queries"}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {!HARDCODED_GROK_CONFIG && (
            <Button onClick={handleSave} disabled={!!HARDCODED_GROK_CONFIG}>
              Save Configuration
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handleTest} 
            disabled={isTesting}
          >
            {isTesting ? "Testing..." : "Test Connection"}
          </Button>
          {isConfigured && !HARDCODED_GROK_CONFIG && (
            <Button variant="destructive" onClick={handleReset}>
              Reset Configuration
            </Button>
          )}
        </div>
        
        {HARDCODED_GROK_CONFIG && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
            <p className="font-medium">Using hardcoded Grok API configuration</p>
            <p className="mt-1">The API is ready to use with pre-configured credentials.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GrokConfig;
