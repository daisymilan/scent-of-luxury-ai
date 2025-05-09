import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertCircle, 
  ArrowUpRight, 
  Check, 
  CheckCircle, 
  Download, 
  Eye, 
  Filter,
  Loader2, 
  RefreshCw, 
  Search, 
  Settings, 
  ShoppingBag, 
  ShoppingCart,
  Truck
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  WooCommerceConfig as WooCommerceConfigType, 
  saveWooCommerceConfig, 
  getWooCommerceConfig,
  HARDCODED_WOO_CONFIG,
  useWooProducts,
  useWooOrders,
  fetchWooCommerceData
} from '@/utils/woocommerce';

const WooCommerceConfig = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('config');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [config, setConfig] = useState<WooCommerceConfigType>({
    url: '',
    consumerKey: '',
    consumerSecret: '',
    version: '3'
  });
  
  // Real data hooks instead of mock data
  const { products, isLoading: isLoadingProducts, error: productsError } = useWooProducts(5);
  const { orders, isLoading: isLoadingOrders, error: ordersError } = useWooOrders(5);
  
  // Filter products based on search query
  const filteredProducts = products?.filter(product => 
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Check for existing config
  useEffect(() => {
    // Check for hardcoded config first
    const savedConfig = getWooCommerceConfig();
    if (savedConfig) {
      if (savedConfig === HARDCODED_WOO_CONFIG) {
        // Using hardcoded credentials
        setConfig({
          ...savedConfig,
          consumerKey: savedConfig.consumerKey.substring(0, 10) + '...',
          consumerSecret: savedConfig.consumerSecret.substring(0, 10) + '...'
        });
        setIsConfigured(true);
        
        toast({
          title: "Connected to MIN NEW YORK WooCommerce",
          description: "Using the official Min.com store API credentials",
        });
      } else {
        // Using localStorage config
        setConfig(savedConfig);
        setIsConfigured(true);
      }
    }
  }, [toast]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save configuration
  const handleSave = () => {
    // If using hardcoded config, don't allow changes
    if (HARDCODED_WOO_CONFIG) {
      toast({
        title: "Using Hardcoded Configuration",
        description: "The API is configured with hardcoded credentials that cannot be changed",
        variant: "destructive",
      });
      return;
    }
    
    // Simple validation
    if (!config.url || !config.consumerKey || !config.consumerSecret) {
      setShowError(true);
      setErrorMessage("Please fill in all required fields");
      setTimeout(() => setShowError(false), 5000);
      
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
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    
    toast({
      title: "Configuration Saved",
      description: "WooCommerce configuration has been saved",
    });
  };
  
  // Test connection
  const handleTest = async () => {
    setIsTestingConnection(true);
    
    try {
      // Get actual config for testing (not the display version with hidden credentials)
      const testConfig = HARDCODED_WOO_CONFIG || getWooCommerceConfig();
      
      if (!testConfig) {
        throw new Error("No configuration found");
      }
      
      // Attempt to make a simple request to test the connection
      const response = await fetch(
        `${testConfig.url}/wp-json/wc/v${testConfig.version}/products?per_page=1`,
        {
          headers: {
            'Authorization': `Basic ${btoa(`${testConfig.consumerKey}:${testConfig.consumerSecret}`)}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`API test failed: ${response.statusText}`);
      }
      
      await response.json(); // Just to confirm we got valid JSON back
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to MIN NEW YORK WooCommerce API",
      });
    } catch (error) {
      console.error('WooCommerce connection test error:', error);
      
      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      setTimeout(() => setShowError(false), 5000);
      
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };
  
  // Reset configuration
  const handleReset = () => {
    if (HARDCODED_WOO_CONFIG) {
      toast({
        title: "Cannot Reset Hardcoded Configuration",
        description: "The API is configured with hardcoded credentials that cannot be reset",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.removeItem('woocommerce_config');
    setConfig({
      url: '',
      consumerKey: '',
      consumerSecret: '',
      version: '3'
    });
    setIsConfigured(false);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    
    toast({
      title: "Configuration Reset",
      description: "WooCommerce configuration has been reset",
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">MIN NEW YORK WooCommerce Integration</CardTitle>
              <CardDescription>
                Connected to the official MIN NEW YORK WooCommerce store
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isConfigured ? "default" : "outline"} className={isConfigured ? "bg-green-500" : ""}>
                {isConfigured ? "Connected" : "Not Connected"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {HARDCODED_WOO_CONFIG && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Connected to MIN NEW YORK WooCommerce</AlertTitle>
              <AlertDescription>
                The application is now using live data from the official MIN NEW YORK WooCommerce store.
              </AlertDescription>
            </Alert>
          )}
          
          {showSuccess && !HARDCODED_WOO_CONFIG && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                {isConfigured ? "WooCommerce configuration has been saved" : "Configuration has been reset"}
              </AlertDescription>
            </Alert>
          )}
          
          {showError && (
            <Alert className="mb-4 bg-red-50 text-red-800 border-red-200" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {(productsError || ordersError) && (
            <Alert className="mb-4 bg-red-50 text-red-800 border-red-200" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>API Error</AlertTitle>
              <AlertDescription>
                {productsError?.message || ordersError?.message || "Error fetching data from WooCommerce API"}
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="config" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Configuration
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Orders
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Statistics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="config">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="url">
                    Store URL
                  </label>
                  <Input
                    id="url"
                    name="url"
                    value={config.url}
                    onChange={handleChange}
                    placeholder="https://min.com/int"
                    disabled={!!HARDCODED_WOO_CONFIG} 
                  />
                  <p className="text-xs text-gray-500">
                    {HARDCODED_WOO_CONFIG ? "Connected to MIN NEW YORK store" : "Enter the full URL of your WooCommerce store"}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="consumerKey">
                    Consumer Key
                  </label>
                  <Input
                    id="consumerKey"
                    name="consumerKey"
                    value={config.consumerKey}
                    onChange={handleChange}
                    type="password"
                    disabled={!!HARDCODED_WOO_CONFIG}
                  />
                  {HARDCODED_WOO_CONFIG && (
                    <p className="text-xs text-gray-500">Using MIN NEW YORK Consumer Key</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="consumerSecret">
                    Consumer Secret
                  </label>
                  <Input
                    id="consumerSecret"
                    name="consumerSecret"
                    value={config.consumerSecret}
                    onChange={handleChange}
                    type="password"
                    disabled={!!HARDCODED_WOO_CONFIG}
                  />
                  {HARDCODED_WOO_CONFIG ? (
                    <p className="text-xs text-gray-500">Using MIN NEW YORK Consumer Secret</p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      You can generate API keys in your WooCommerce dashboard under 
                      WooCommerce &gt; Settings &gt; Advanced &gt; REST API
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="version">
                    API Version
                  </label>
                  <Input
                    id="version"
                    name="version"
                    value={config.version}
                    onChange={handleChange}
                    placeholder="3"
                    disabled={!!HARDCODED_WOO_CONFIG}
                  />
                  <p className="text-xs text-gray-500">
                    Using WooCommerce API v3
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {!HARDCODED_WOO_CONFIG && (
                    <Button onClick={handleSave}>
                      Save Configuration
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={handleTest} 
                    disabled={isTestingConnection}
                  >
                    {isTestingConnection ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                  {isConfigured && !HARDCODED_WOO_CONFIG && (
                    <Button variant="destructive" onClick={handleReset}>
                      Reset Configuration
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="products">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Sales</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Date Created</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingProducts ? (
                          Array(5).fill(0).map((_, index) => (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-3">
                                <Skeleton className="h-6 w-32" />
                              </td>
                              <td className="px-4 py-3">
                                <Skeleton className="h-6 w-16" />
                              </td>
                              <td className="px-4 py-3">
                                <Skeleton className="h-6 w-16" />
                              </td>
                              <td className="px-4 py-3">
                                <Skeleton className="h-6 w-16" />
                              </td>
                              <td className="px-4 py-3">
                                <Skeleton className="h-6 w-24" />
                              </td>
                              <td className="px-4 py-3">
                                <Skeleton className="h-6 w-24" />
                              </td>
                            </tr>
                          ))
                        ) : filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <tr key={product.id} className="border-b hover:bg-muted/50">
                              <td className="px-4 py-3">
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-gray-500">ID: {product.id}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium">${product.price}</div>
                                {product.sale_price && (
                                  <div className="text-xs text-green-600">
                                    Sale: ${product.sale_price}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  product.stock_status === 'instock' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {product.stock_status === 'instock' 
                                    ? `In Stock ${product.stock_quantity ? `(${product.stock_quantity})` : ''}` 
                                    : 'Out of Stock'
                                  }
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {product.total_sales || 0}
                              </td>
                              <td className="px-4 py-3">
                                {product.date_created ? formatDate(product.date_created) : 'N/A'}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b">
                            <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                              {productsError ? "Error fetching products" : "No products found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders..."
                      className="pl-8"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Order</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingOrders ? (
                          Array(3).fill(0).map((_, index) => (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-3">
                                <Skeleton className="h-6 w-16" />
                              </td>
                              <td className="px-4 py-3">
                                <Skeleton className="h-6 w-32" />
                              </td>
                              <td className="px-4 py-3">
                                <Skeleton className="h-6 w-20" />
                              </td>
                              <td className="px-4 py-3">
                                <Skeleton className="h-6 w-16" />
                              </td>
                              <td className="px-4 py-3">
                                <Skeleton className="h-6 w-24" />
                              </td>
                              <td className="px-4 py-3">
                                <Skeleton className="h-6 w-24" />
                              </td>
                            </tr>
                          ))
                        ) : orders && orders.length > 0 ? (
                          orders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-muted/50">
                              <td className="px-4 py-3">
                                <div className="font-medium">#{order.id}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium">
                                  {order.billing?.first_name} {order.billing?.last_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {order.billing?.email}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  order.status === 'completed' 
                                    ? 'bg-green-100 text-green-800'
                                    : order.status === 'processing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Unknown'}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium">${order.total}</div>
                              </td>
                              <td className="px-4 py-3">
                                {order.date_created ? formatDate(order.date_created) : 'N/A'}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Truck className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b">
                            <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                              {ordersError ? "Error fetching orders" : "No orders found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Stats cards will be populated from real data */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Total Products</div>
                        <div className="text-3xl font-semibold mt-1">
                          {isLoadingProducts ? <Skeleton className="h-8 w-16" /> : products?.length || 0}
                        </div>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-md">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Total Orders</div>
                        <div className="text-3xl font-semibold mt-1">
                          {isLoadingOrders ? <Skeleton className="h-8 w-16" /> : orders?.length || 0}
                        </div>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-md">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Total Revenue</div>
                        <div className="text-3xl font-semibold mt-1">
                          {isLoadingOrders ? (
                            <Skeleton className="h-8 w-24" />
                          ) : (
                            `$${orders?.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0).toFixed(2) || '0.00'}`
                          )}
                        </div>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-md">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WooCommerceConfig;
