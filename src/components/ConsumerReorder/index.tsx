
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useWooOrders, useWooCustomers } from '@/utils/woocommerce';
import { processCustomerData, Customer } from './customerUtils';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import TableActions from './TableActions';
import ReminderDialog from './ReminderDialog';
import CustomerTable from './CustomerTable';

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
  
  const { toast } = useToast();
  
  // Fix: Update the hook calls to match the expected number of arguments
  // useWooOrders accepts (limit, status, customer, dateAfter, dateBefore)
  const { orders, isLoading: isLoadingOrders } = useWooOrders(100); 
  // useWooCustomers accepts (limit, searchTerm, role)
  const { customers, isLoading: isLoadingCustomers } = useWooCustomers(100);
  
  // Process the data to create our customer reorder list
  useEffect(() => {
    if (!isLoadingOrders && !isLoadingCustomers && orders && customers) {
      console.log('Processing customer data with:', { 
        ordersCount: orders.length, 
        customersCount: customers.length 
      });
      
      const processed = processCustomerData(orders, customers);
      setProcessedCustomers(processed);
    }
  }, [orders, customers, isLoadingOrders, isLoadingCustomers, refreshKey]);
  
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
  
  const handleRetry = () => {
    // Force refresh by incrementing the refresh key
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Refreshing data",
      description: "Attempting to reload customer and order data..."
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
  
  // If there's no data yet, show a loading state
  if (isLoadingOrders || isLoadingCustomers) {
    return <LoadingState />;
  }
  
  // If we have no customers or orders, or no processed customers, show an empty state
  if (!orders?.length || !customers?.length || processedCustomers.length === 0) {
    return (
      <EmptyState 
        ordersCount={orders?.length || 0} 
        customersCount={customers?.length || 0}
        onRetry={handleRetry}
      />
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumer Reorder Reminders</CardTitle>
        <CardDescription>Send targeted reminders to customers who may need to reorder products</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <TableActions 
            selectedCount={selectedCustomers.length}
            totalCount={processedCustomers.length}
            onSelectAll={selectAllCustomers}
            onClearSelection={clearSelection}
          />
          
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
