
import { useState, useEffect } from 'react';
import { Plus, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { B2BLead, mergeLeadSources } from '@/utils/b2bUtils';
import B2BLeadImport from './B2BLeadImport';
import { B2BLeadDisplay, B2BLeadGenerationProps, SequenceStep } from './b2b/types';
import LeadTable from './b2b/LeadTable';
import OutreachSidebar from './b2b/OutreachSidebar';
import EmailDialog from './b2b/EmailDialog';
import SequenceDialog from './b2b/SequenceDialog';
import LeadDetailDialog from './b2b/LeadDetailDialog';

const B2BLeadGeneration = ({ wooCustomers, wooOrders, wooProducts }: B2BLeadGenerationProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<B2BLeadDisplay | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [sequenceModalOpen, setSequenceModalOpen] = useState(false);
  const [leadDetailModalOpen, setLeadDetailModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [leads, setLeads] = useState<B2BLeadDisplay[]>([]);
  
  // Outreach sequence state
  const [sequence, setSequence] = useState<SequenceStep[]>([
    { id: 1, name: 'Initial Contact Email', status: 'completed', scheduledDate: 'Sent 2 days ago' },
    { id: 2, name: 'Follow-up Email', status: 'scheduled', scheduledDate: 'Tomorrow' },
    { id: 3, name: 'Final Follow-up', status: 'scheduled', scheduledDate: 'Next week' },
  ]);
  
  // Process WooCommerce data into leads if available
  useEffect(() => {
    if (wooCustomers && wooOrders) {
      try {
        // Process WooCommerce customers into leads
        const processedLeads = wooCustomers
          .filter(customer => customer.billing?.company) // Only include customers with company names (B2B)
          .map(customer => {
            // Find all orders for this customer
            const customerOrders = wooOrders.filter(order => order.customer_id === customer.id);
            
            // Calculate total spent
            const totalSpent = customerOrders.reduce((sum, order) => {
              return sum + parseFloat(order.total || '0');
            }, 0);
            
            // Get last order date
            const lastOrder = customerOrders.length > 0 
              ? new Date(customerOrders.sort((a, b) => 
                new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
              )[0].date_created).toISOString().split('T')[0]
              : null;
              
            // Determine lead status based on order history
            let status = 'New Lead';
            if (customerOrders.length > 0) {
              status = 'Customer';
            }
            
            // Calculate lead score (simple algorithm - can be enhanced)
            let score = 50; // Base score
            
            // Increase score based on order history
            if (customerOrders.length > 5) score += 20;
            else if (customerOrders.length > 0) score += customerOrders.length * 4;
            
            // Increase score based on total spent
            if (totalSpent > 10000) score += 20;
            else if (totalSpent > 5000) score += 15;
            else if (totalSpent > 1000) score += 10;
            else if (totalSpent > 0) score += 5;
            
            // Cap score at 100
            score = Math.min(100, score);
            
            // Extract industry from meta_data if available
            const industryMeta = customer.meta_data?.find(meta => meta.key === 'industry');
            const industry = industryMeta ? industryMeta.value : 'Retail';
            
            // Format location from address details
            const location = customer.billing?.city && customer.billing?.country 
              ? `${customer.billing.city}, ${customer.billing.country}`
              : 'Unknown';
              
            return {
              id: customer.id,
              company: customer.billing?.company || 'Unknown Company',
              contact: `${customer.first_name} ${customer.last_name}`,
              email: customer.billing?.email || customer.email,
              status,
              score,
              lastOrder,
              totalSpent,
              notes: '',
              industry,
              location,
              productInterests: []
            };
          });
          
        // If we have real data and it's not empty, use it; otherwise use empty array
        if (processedLeads.length > 0) {
          console.log('Using WooCommerce data for B2B leads:', processedLeads);
          setLeads(processedLeads);
        } else {
          console.log('No B2B customers found in WooCommerce');
          // Initialize with an empty array instead of mock data
          setLeads([]);
        }
      } catch (error) {
        console.error('Error processing WooCommerce data:', error);
        toast({
          title: "Data Processing Error",
          description: "Error processing WooCommerce data.",
          variant: "destructive",
        });
        setLeads([]);
      }
    } else {
      // Use empty array when no data is available
      console.log('No WooCommerce data available for B2B leads');
      setLeads([]);
    }
  }, [wooCustomers, wooOrders, toast]);
  
  const handleLeadSelect = (lead: B2BLeadDisplay) => {
    setSelectedLead(lead);
  };
  
  const handleViewLeadDetails = (lead: B2BLeadDisplay) => {
    setSelectedLead(lead);
    setLeadDetailModalOpen(true);
  };
  
  const handleSendCustomEmail = () => {
    if (!selectedLead) {
      toast({
        title: "No lead selected",
        description: "Please select a lead first",
        variant: "destructive",
      });
      return;
    }
    
    // Pre-fill the email subject and body with template data
    setEmailSubject(`Exclusive MiN NEW YORK Partnership Opportunity - ${selectedLead.company}`);
    setEmailBody(`Dear ${selectedLead.contact},\n\nI hope this email finds you well. I'm reaching out regarding an exclusive partnership opportunity between ${selectedLead.company} and MiN NEW YORK.\n\nOur luxury fragrance collection has garnered acclaim worldwide for their exceptional quality and unique compositions. We believe there could be an excellent synergy between our brands.\n\nI'd welcome the opportunity to discuss how a partnership could enhance your customer experience and drive measurable business results.\n\nLooking forward to your response.\n\nBest regards,\nChad Murawczyk\nFounder, MiN NEW YORK`);
    
    setEmailModalOpen(true);
  };
  
  const handleEditSequence = () => {
    if (!selectedLead) {
      toast({
        title: "No lead selected",
        description: "Please select a lead first",
        variant: "destructive",
      });
      return;
    }
    
    setSequenceModalOpen(true);
  };
  
  const handleSubmitEmail = () => {
    if (!emailSubject || !emailBody) {
      toast({
        title: "Missing fields",
        description: "Please fill in both subject and message",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending email
    setTimeout(() => {
      setIsSending(false);
      setEmailModalOpen(false);
      
      toast({
        title: "Email sent",
        description: `Email sent to ${selectedLead?.contact} at ${selectedLead?.email}`,
      });
      
      // Reset form
      setEmailSubject('');
      setEmailBody('');
    }, 1500);
  };
  
  const handleUpdateSequence = () => {
    setSequenceModalOpen(false);
    
    toast({
      title: "Sequence updated",
      description: "The outreach sequence has been updated",
    });
  };
  
  const updateSequenceStep = (id: number, field: string, value: string) => {
    setSequence(sequence.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const handleAddNewLead = () => {
    toast({
      title: "Feature in development",
      description: "The ability to add new leads will be available soon.",
    });
    // This would open a modal for adding a new lead
  };

  const handleImportLeads = () => {
    setImportModalOpen(true);
  };
  
  const handleImportSuccess = (importedLeads: Partial<B2BLead>[]) => {
    // Convert imported B2BLeads to the format used by the component
    const newLeads = importedLeads.map((lead, index) => {
      return {
        id: Date.now() + index, // Generate unique id
        company: lead.companyName || 'Unknown Company',
        brand: lead.tags?.[0] || '',
        linkedInProfileUrl: lead.linkedInUrl,
        contact: lead.contactName || 'Unknown Contact',
        firstName: lead.firstName,
        lastName: lead.lastName,
        jobTitle: lead.jobTitle,
        email: lead.contactEmail || '',
        linkedInCompanyUrl: lead.linkedInCompanyUrl,
        linkedInCompanyId: lead.linkedInCompanyId,
        website: lead.website,
        domain: lead.domain,
        employeeCount: lead.employeeCount,
        industry: lead.industry || 'Retail',
        companyHQ: lead.companyHQ,
        location: lead.location || 'Unknown',
        openProfile: lead.hasOpenProfile,
        premiumLinkedIn: lead.hasPremiumLinkedIn,
        geoTag: lead.geoTag,
        status: 'New Lead',
        score: lead.score || 50,
        notes: lead.notes || '',
        productInterests: [],
      } as B2BLeadDisplay;
    });
    
    // Add the new leads to the existing ones
    setLeads(prevLeads => [...newLeads, ...prevLeads]);
    
    toast({
      title: "Import complete",
      description: `${newLeads.length} leads have been imported successfully`,
    });
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">B2B Lead Management</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" className="h-9" size="sm" onClick={handleImportLeads}>
              <Upload size={16} className="mr-1" /> Import CSV
            </Button>
            <Button className="h-9" size="sm" onClick={handleAddNewLead}>
              <Plus size={16} className="mr-1" /> Add Lead
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <LeadTable 
            leads={leads}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedLead={selectedLead}
            onLeadSelect={handleLeadSelect}
            onViewLeadDetails={handleViewLeadDetails}
            onSendCustomEmail={(lead) => {
              setSelectedLead(lead);
              handleSendCustomEmail();
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="col-span-full lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Automated Outreach</CardTitle>
        </CardHeader>
        <CardContent>
          <OutreachSidebar 
            selectedLead={selectedLead}
            sequence={sequence}
            onSendCustomEmail={handleSendCustomEmail}
            onEditSequence={handleEditSequence}
          />
        </CardContent>
      </Card>

      <B2BLeadImport 
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      <EmailDialog 
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
        selectedLead={selectedLead}
        onSend={handleSubmitEmail}
        isSending={isSending}
        emailSubject={emailSubject}
        setEmailSubject={setEmailSubject}
        emailBody={emailBody}
        setEmailBody={setEmailBody}
      />

      <SequenceDialog 
        open={sequenceModalOpen}
        onOpenChange={setSequenceModalOpen}
        selectedLead={selectedLead}
        sequence={sequence}
        updateSequenceStep={updateSequenceStep}
        onSave={handleUpdateSequence}
      />

      <LeadDetailDialog 
        open={leadDetailModalOpen}
        onOpenChange={setLeadDetailModalOpen}
        selectedLead={selectedLead}
      />
    </div>
  );
};

export default B2BLeadGeneration;
