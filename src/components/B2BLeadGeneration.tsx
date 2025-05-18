
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { B2BLead, mergeLeadSources } from '@/utils/b2bUtils';
import { B2BLeadDisplay, SequenceStep, B2BLeadGenerationProps } from './b2b/types';
import LeadTable from './b2b/LeadTable';
import OutreachSidebar from './b2b/OutreachSidebar';
import EmailDialog from './b2b/EmailDialog';
import SequenceDialog from './b2b/SequenceDialog';
import LeadDetailDialog from './b2b/LeadDetailDialog';
import B2BLeadImport from './B2BLeadImport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';

const B2BLeadGeneration = ({ wooCustomers = [], wooOrders = [], wooProducts = [] }: B2BLeadGenerationProps) => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<B2BLeadDisplay[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<B2BLeadDisplay | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [sequenceModalOpen, setSequenceModalOpen] = useState(false);
  const [leadDetailModalOpen, setLeadDetailModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sequence, setSequence] = useState<SequenceStep[]>([]);

  useEffect(() => {
    if (wooCustomers && wooOrders) {
      try {
        const processedLeads = wooCustomers
          .filter(c => c.billing?.company)
          .map(customer => {
            const customerOrders = wooOrders.filter(o => o.customer_id === customer.id);
            const totalSpent = customerOrders.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0);
            const lastOrder = customerOrders.length > 0 ? new Date(customerOrders.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())[0].date_created).toISOString().split('T')[0] : null;
            let score = 50;
            if (customerOrders.length > 5) score += 20;
            else if (customerOrders.length > 0) score += customerOrders.length * 4;
            if (totalSpent > 10000) score += 20;
            else if (totalSpent > 5000) score += 15;
            else if (totalSpent > 1000) score += 10;
            else if (totalSpent > 0) score += 5;
            score = Math.min(100, score);
            const industryMeta = customer.meta_data?.find(meta => meta.key === 'industry');
            const industry = industryMeta ? industryMeta.value : 'Retail';
            const location = customer.billing?.city && customer.billing?.country ? `${customer.billing.city}, ${customer.billing.country}` : 'Unknown';
            return {
              id: customer.id,
              company: customer.billing?.company || 'Unknown Company',
              contact: `${customer.first_name} ${customer.last_name}`,
              email: customer.billing?.email || customer.email,
              status: customerOrders.length > 0 ? 'Customer' : 'New Lead',
              score,
              lastOrder,
              totalSpent,
              notes: '',
              industry,
              location,
              productInterests: []
            };
          });
        setLeads(processedLeads);
      } catch (error) {
        console.error('Error processing WooCommerce data:', error);
        toast({ title: 'Processing Error', description: 'Failed to generate leads.', variant: 'destructive' });
        setLeads([]);
      }
    }
  }, [wooCustomers, wooOrders, toast]);

  const handleImportSuccess = (importedLeads: Partial<B2BLead>[]) => {
    const newLeads = importedLeads.map((lead, index) => ({
      id: Date.now() + index,
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
    }) as B2BLeadDisplay);
    setLeads(prev => [...newLeads, ...prev]);
    toast({ title: 'Import complete', description: `${newLeads.length} leads imported.` });
  };

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">B2B Lead Management</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" className="h-9" size="sm" onClick={() => setImportModalOpen(true)}>
              <Upload size={16} className="mr-1" /> Import CSV
            </Button>
            <Button className="h-9" size="sm" onClick={() => toast({ title: 'Coming soon', description: 'Manual lead creation coming.' })}>
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
            onLeadSelect={setSelectedLead}
            onViewLeadDetails={(lead) => { setSelectedLead(lead); setLeadDetailModalOpen(true); }}
            onSendCustomEmail={(lead) => {
              setSelectedLead(lead);
              setEmailSubject(`Exclusive MiN NEW YORK Partnership Opportunity - ${lead.company}`);
              setEmailBody(`Dear ${lead.contact},\n\nI hope this email finds you well. I'm reaching out regarding an exclusive partnership opportunity between ${lead.company} and MiN NEW YORK...`);
              setEmailModalOpen(true);
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
            onSendCustomEmail={() => setEmailModalOpen(true)}
            onEditSequence={() => setSequenceModalOpen(true)}
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
        onSend={() => {
          if (!emailSubject || !emailBody) {
            toast({ title: 'Missing fields', description: 'Please fill in subject and body.', variant: 'destructive' });
            return;
          }
          setIsSending(true);
          setTimeout(() => {
            setIsSending(false);
            setEmailModalOpen(false);
            toast({ title: 'Email sent', description: `Email sent to ${selectedLead?.email}` });
            setEmailSubject('');
            setEmailBody('');
          }, 1500);
        }}
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
        updateSequenceStep={(id, field, value) => setSequence(sequence.map(step => step.id === id ? { ...step, [field]: value } : step))}
        onSave={() => toast({ title: 'Sequence updated', description: 'Sequence saved.' })}
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
