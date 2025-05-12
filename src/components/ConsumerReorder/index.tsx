
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWooOrders, useWooCustomers } from '@/utils/woocommerce';
import { processCustomerData, Customer } from './customerUtils';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import TableActions from './TableActions';
import ReminderDialog from './ReminderDialog';
import CustomerTable from './CustomerTable';
import { RefreshCw } from 'lucide-react';

const ConsumerReorderReminder: React.FC = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [reminderType, setReminderType] = useState<string>('email');
  const [reminderSubject, setReminderSubject] = useState<string>('Time to reorder your favorite fragrance');
  const [reminderMessage, setReminderMessage] = useState<string>(
    'Hello valued customer,\n\nWe noticed it\'s been a while since you purchased your favorite MiN NEW YORK fragrance. We thought you might be running low and wanted to offer you a special 10% discount on your next purchase when you use code REORDER10.\n\nWarm regards,\nMiN NEW YORK Team'
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [sendingReminders, setSendingReminders] = useState<boolean>(false);
  const [processedCustomers, setProcessedCustomers] = useState<Customer[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const { toast } = useToast();
  
  // Fix: Update the hook calls to match the expected arguments
  const { orders, isLoading: isLoadingOrders, error: ordersError } = useWooOrders(100); 
  const { customers, isLoading: isLoadingCustomers, error: customersError } = useWooCustomers(100);
  
  useEffect(() => {
    // Reset error state on refresh
    setError(null);
    
    // Check for API errors
    if (ordersError) {
      setError(`Order data error: ${ordersError.message}`);
      console.error('Orders error:', ordersError);
      return;
    }
    
    if (customersError) {
      setError(`Customer data error: ${customersError.message}`);
      console.error('Customers error:', customersError);
      return;
    }
    
    // Process the data to create our customer reorder list
    if (!isLoadingOrders && !isLoadingCustomers && orders && customers) {
      console.log('Processing customer data with:', { 
        ordersCount: orders.length, 
        customersCount: customers.length 
      });
      
      try {
        const processed = processCustomerData(orders, customers);
        console.log('Processed customers:', processed);
        setProcessedCustomers(processed);
        setIsRefreshing(false);
      } catch (err) {
        console.error('Error processing customer data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error processing customer data');
      }
    }
  }, [orders, customers, isLoadingOrders, isLoadingCustomers, ordersError, customersError, refreshKey]);
  
  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };
  
  const selectAllCustomers = () => {
    processedCustomers.length > 0 && setSelectedCustomers(processedCustomers.map(c => c.id));
  };
  
  const clearSelection = () => {
    setSelectedCustomers([]);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Force refresh by incrementing the refresh key
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Refreshing data",
      description: "Reloading customer and order data..."
    });
  };
  
  const sendReminders = () => {
    setSendingReminders(true);
    
    // Simulate API call
    setTimeout(() => {
      setSendingReminders(false);
      setDialogOpen(false);
      
      toast({
        title: 'Reminders Sent',
        description: `Successfully sent reminders to ${selectedCustomers.length} customers.`,
      });
      
      setSelectedCustomers([]);
    }, 1500);
  };
  
  // If there's an error, show the error state
  if (error) {
    return <ErrorState errorMessage={error} onRetry={handleRefresh} />;
  }
  
  // If there's no data yet, show a loading state
  if (isLoadingOrders || isLoadingCustomers || isRefreshing) {
    return <LoadingState />;
  }
  
  // If we have no customers or orders, or no processed customers, show an empty state
  if (!orders?.length || !customers?.length || processedCustomers.length === 0) {
    return (
      <EmptyState 
        ordersCount={orders?.length || 0} 
        customersCount={customers?.length || 0}
        onRetry={handleRefresh}
      />
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Consumer Reorder Reminders</CardTitle>
          <CardDescription>Send targeted reminders to customers who may need to reorder products</CardDescription>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <TableActions 
            selectedCount={selectedCustomers.length}
            totalCount={processedCustomers.length}
            onSelectAll={selectAllCustomers}
            onClearSelection={clearSelection}
          />
          
          <Button onClick={() => setDialogOpen(true)} disabled={selectedCustomers.length === 0} className="ml-auto">
            Send Reminder ({selectedCustomers.length})
          </Button>
          
          <ReminderDialog 
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            selectedCustomerCount={selectedCustomers.length}
            reminderType={reminderType}
            setReminderType={setReminderType}
            reminderSubject={reminderSubject}
            setReminderSubject={setReminderSubject}
            reminderMessage={reminderMessage}
            setReminderMessage={setReminderMessage}
            onSend={sendReminders}
            isSending={sendingReminders}
          />
        </div>
        
        <CustomerTable 
          customers={processedCustomers}
          selectedCustomers={selectedCustomers}
          toggleCustomerSelection={toggleCustomerSelection}
        />
      </CardContent>
    </Card>
  );
};

export default ConsumerReorderReminder;
