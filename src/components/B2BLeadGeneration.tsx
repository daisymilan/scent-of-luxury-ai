
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Mail, MessageSquare, Plus, Search, BarChart3, Calendar, TagIcon, Map, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { b2bLeads, WooCustomer, WooOrder, WooProduct } from '../lib/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import B2BLeadImport from './B2BLeadImport';
import { B2BLead, mergeLeadSources } from '@/utils/b2bUtils';

// Type definitions for B2B leads
interface B2BLeadDisplay {
  id: number;
  company: string;
  brand?: string;
  linkedInProfileUrl?: string;
  contact: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email: string;
  linkedInCompanyUrl?: string;
  linkedInCompanyId?: string;
  website?: string;
  domain?: string;
  employeeCount?: string;
  industry?: string;
  companyHQ?: string;
  location?: string;
  openProfile?: boolean;
  premiumLinkedIn?: boolean;
  geoTag?: string;
  status: string;
  score: number;
  lastOrder?: string | null;
  totalSpent?: number;
  notes?: string;
  productInterests?: string[];
}

// Status color mapping
const statusColors = {
  'New Lead': 'bg-blue-100 text-blue-800',
  'Contacted': 'bg-yellow-100 text-yellow-800',
  'Interested': 'bg-green-100 text-green-800',
  'Negotiating': 'bg-purple-100 text-purple-800',
  'Customer': 'bg-emerald-100 text-emerald-800',
  'Lost': 'bg-gray-100 text-gray-800',
};

interface B2BLeadGenerationProps {
  wooCustomers: WooCustomer[] | null;
  wooOrders: WooOrder[] | null;
  wooProducts: WooProduct[] | null;
}

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
  const [leadDetailsTab, setLeadDetailsTab] = useState('overview');
  const [visibleColumns, setVisibleColumns] = useState({
    company: true,
    contact: true,
    email: true,
    industry: true,
    location: true,
    status: true,
    score: true,
  });
  
  // Outreach sequence state
  const [sequence, setSequence] = useState([
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
          
        // If we have real data and it's not empty, use it; otherwise fallback to mock data
        if (processedLeads.length > 0) {
          console.log('Using WooCommerce data for B2B leads:', processedLeads);
          setLeads(processedLeads);
        } else {
          console.log('No B2B customers found in WooCommerce, using fallback data');
          setLeads(b2bLeads);
        }
      } catch (error) {
        console.error('Error processing WooCommerce data:', error);
        toast({
          title: "Data Processing Error",
          description: "Error processing WooCommerce data. Using fallback data.",
          variant: "destructive",
        });
        setLeads(b2bLeads);
      }
    } else {
      // Use mock data as fallback
      console.log('No WooCommerce data available, using fallback data');
      setLeads(b2bLeads);
    }
  }, [wooCustomers, wooOrders, toast]);
  
  const filteredLeads = leads.filter(lead => 
    (lead.company?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (lead.contact?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (lead.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (lead.industry?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (lead.location?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (lead.brand?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
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

  // Column definitions for the leads table
  const columnDefinitions = [
    { id: 'company', name: 'Company Name' },
    { id: 'brand', name: 'Brand' },
    { id: 'contact', name: 'Contact Name' },
    { id: 'firstName', name: 'First Name' },
    { id: 'lastName', name: 'Last Name' },
    { id: 'jobTitle', name: 'Job Title' },
    { id: 'email', name: 'Email' },
    { id: 'linkedInProfileUrl', name: 'LinkedIn Profile' },
    { id: 'linkedInCompanyUrl', name: 'Company LinkedIn' },
    { id: 'linkedInCompanyId', name: 'LinkedIn Company ID' },
    { id: 'website', name: 'Website' },
    { id: 'domain', name: 'Domain' },
    { id: 'employeeCount', name: 'Employee Count' },
    { id: 'industry', name: 'Industry' },
    { id: 'companyHQ', name: 'Company HQ' },
    { id: 'location', name: 'Location' },
    { id: 'openProfile', name: 'Open Profile' },
    { id: 'premiumLinkedIn', name: 'Premium LinkedIn' },
    { id: 'geoTag', name: 'Geo Tag' },
    { id: 'status', name: 'Status' },
    { id: 'score', name: 'Score' },
  ];
  
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
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search leads by company, contact, email, industry or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Company</TableHead>
                  <TableHead className="w-[100px]">Brand</TableHead>
                  <TableHead className="w-[160px]">Contact</TableHead>
                  <TableHead className="w-[150px]">Job Title</TableHead>
                  <TableHead className="w-[150px]">Email</TableHead>
                  <TableHead className="w-[120px]">LinkedIn</TableHead>
                  <TableHead className="w-[150px]">Location</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[80px]">Score</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <TableRow 
                      key={lead.id} 
                      className={`cursor-pointer ${selectedLead?.id === lead.id ? 'bg-gray-50' : ''}`}
                      onClick={() => handleLeadSelect(lead)}
                    >
                      <TableCell className="font-medium">{lead.company}</TableCell>
                      <TableCell>{lead.brand || '-'}</TableCell>
                      <TableCell>{lead.contact}</TableCell>
                      <TableCell>{lead.jobTitle || '-'}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>
                        {lead.linkedInProfileUrl ? (
                          <a href={lead.linkedInProfileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                            View Profile
                          </a>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{lead.location || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${statusColors[lead.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-10 bg-gray-200 rounded-full h-1.5 mr-2">
                            <div 
                              className={`h-1.5 rounded-full ${
                                lead.score >= 80 ? 'bg-green-500' : 
                                lead.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${lead.score}%` }}
                            ></div>
                          </div>
                          <span>{lead.score}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                            handleSendCustomEmail();
                          }}>
                            <Mail size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                            e.stopPropagation();
                            handleViewLeadDetails(lead);
                          }}>
                            <BarChart3 size={16} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1.5 1.5H13.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewLeadDetails(lead)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                              <DropdownMenuItem>Mark as Contacted</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-gray-500">
                      {searchQuery ? 'No leads match your search criteria.' : 'No leads available.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-full lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Automated Outreach</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedLead ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-1">{selectedLead.company}</h3>
                <p className="text-sm text-gray-600">{selectedLead.contact}</p>
                <p className="text-sm text-gray-600">{selectedLead.email}</p>
                {selectedLead.industry && (
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <TagIcon size={14} className="mr-1" /> {selectedLead.industry}
                  </div>
                )}
                {selectedLead.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Map size={14} className="mr-1" /> {selectedLead.location}
                  </div>
                )}
                {selectedLead.lastOrder && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-1" /> Last order: {selectedLead.lastOrder}
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Outreach Sequence</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5 mr-3">
                      <Check size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Initial Contact Email</p>
                      <p className="text-xs text-gray-500">Sent 2 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-0.5 mr-3">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Follow-up Email</p>
                      <p className="text-xs text-gray-500">Scheduled for tomorrow</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mt-0.5 mr-3">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Final Follow-up</p>
                      <p className="text-xs text-gray-500">Scheduled for next week</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <Button className="w-full mb-2" onClick={handleSendCustomEmail}>
                  <Mail size={16} className="mr-2" /> Send Custom Email
                </Button>
                <Button variant="outline" className="w-full" onClick={handleEditSequence}>
                  Edit Sequence
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Mail size={24} className="text-gray-500" />
              </div>
              <p className="text-gray-500">Select a lead to see outreach options</p>
            </div>
          )}
        </CardContent>
      </Card>

      <B2BLeadImport 
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Send Custom Email to {selectedLead?.contact}</DialogTitle>
            <DialogDescription>
              Send a personalized email to this lead. This will be sent through your configured email service.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email-to">To</Label>
              <Input id="email-to" value={selectedLead?.email || ''} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input 
                id="email-subject" 
                value={emailSubject} 
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject..." 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-body">Message</Label>
              <Textarea
                id="email-body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Enter your message..."
                className="min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitEmail} disabled={isSending}>
              {isSending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sequenceModalOpen} onOpenChange={setSequenceModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Outreach Sequence</DialogTitle>
            <DialogDescription>
              Modify the automated outreach sequence for {selectedLead?.company}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {sequence.map((step) => (
              <div key={step.id} className="grid grid-cols-[auto,1fr] gap-4 items-start">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-sm mt-2 ${
                  step.status === 'completed' ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {step.status === 'completed' ? <Check size={14} /> : step.id}
                </div>
                <div className="space-y-2 w-full">
                  <div>
                    <Label htmlFor={`step-name-${step.id}`}>Step Name</Label>
                    <Input
                      id={`step-name-${step.id}`}
                      value={step.name}
                      onChange={(e) => updateSequenceStep(step.id, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`step-date-${step.id}`}>Schedule/Status</Label>
                    <Input
                      id={`step-date-${step.id}`}
                      value={step.scheduledDate}
                      onChange={(e) => updateSequenceStep(step.id, 'scheduledDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="mt-2">
              <Plus size={16} className="mr-2" /> Add Step
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSequenceModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSequence}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={leadDetailModalOpen} onOpenChange={setLeadDetailModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Lead Details: {selectedLead?.company}</DialogTitle>
            <DialogDescription>
              Detailed information about this B2B lead and their interaction history.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <Tabs value={leadDetailsTab} onValueChange={setLeadDetailsTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="interactions">Interactions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Company</Label>
                    <p className="font-medium">{selectedLead.company}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Contact</Label>
                    <p className="font-medium">{selectedLead.contact}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Email</Label>
                    <p className="font-medium">{selectedLead.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Status</Label>
                    <p>
                      <Badge variant="outline" className={`mt-1 ${statusColors[selectedLead.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                        {selectedLead.status}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Industry</Label>
                    <p className="font-medium">{selectedLead.industry || "Unknown"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Location</Label>
                    <p className="font-medium">{selectedLead.location || "Unknown"}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-gray-500">Score</Label>
                  <div className="flex items-center mt-1">
                    <div className="w-full h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          selectedLead.score >= 80 ? 'bg-green-500' : 
                          selectedLead.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${selectedLead.score}%` }}
                      ></div>
                    </div>
                    <span className="font-medium">{selectedLead.score}</span>
                  </div>
                </div>
                
                {selectedLead.productInterests && selectedLead.productInterests.length > 0 && (
                  <div>
                    <Label className="text-sm text-gray-500">Product Interests</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLead.productInterests.map((product, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm text-gray-500">Notes</Label>
                  <Textarea 
                    value={selectedLead.notes || ''} 
                    placeholder="Add notes about this lead..."
                    className="mt-1"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="orders">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-sm text-gray-500">Total Spent</Label>
                      <p className="font-medium text-lg">€{selectedLead.totalSpent?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Last Order</Label>
                      <p className="font-medium">{selectedLead.lastOrder || 'No orders yet'}</p>
                    </div>
                  </div>
                  
                  {selectedLead.totalSpent ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="py-2 px-4 text-left font-medium text-gray-500">Date</th>
                            <th className="py-2 px-4 text-left font-medium text-gray-500">Order ID</th>
                            <th className="py-2 px-4 text-left font-medium text-gray-500">Amount</th>
                            <th className="py-2 px-4 text-left font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wooOrders && wooOrders
                            .filter(order => order.customer_id === selectedLead.id)
                            .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
                            .slice(0, 5)
                            .map((order) => (
                              <tr key={order.id} className="border-b last:border-b-0">
                                <td className="py-2 px-4">{new Date(order.date_created).toLocaleDateString()}</td>
                                <td className="py-2 px-4">#{order.id}</td>
                                <td className="py-2 px-4">€{parseFloat(order.total).toLocaleString()}</td>
                                <td className="py-2 px-4">
                                  <Badge variant="outline" className={
                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }>
                                    {order.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-md">
                      <p className="text-gray-500">No order history available.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="interactions">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Contact History</h3>
                    <Button size="sm" variant="outline">
                      <Plus size={14} className="mr-1" /> Log Interaction
                    </Button>
                  </div>
                  
                  <div className="border rounded-md divide-y">
                    <div className="p-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Initial Outreach Email</span>
                        <span className="text-xs text-gray-500">May 6, 2025</span>
                      </div>
                      <p className="text-sm text-gray-600">Sent introduction email about partnership opportunities.</p>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Phone Call</span>
                        <span className="text-xs text-gray-500">May 8, 2025</span>
                      </div>
                      <p className="text-sm text-gray-600">Discussed partnership possibilities and next steps.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default B2BLeadGeneration;
