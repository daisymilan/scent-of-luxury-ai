
import { useState } from 'react';
import { Check, Mail, MessageSquare, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { b2bLeads } from '../lib/mockData';
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

const statusColors = {
  'New Lead': 'bg-blue-100 text-blue-800',
  'Contacted': 'bg-yellow-100 text-yellow-800',
  'Interested': 'bg-green-100 text-green-800',
  'Negotiating': 'bg-purple-100 text-purple-800',
};

const B2BLeadGeneration = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<typeof b2bLeads[0] | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [sequenceModalOpen, setSequenceModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Outreach sequence state
  const [sequence, setSequence] = useState([
    { id: 1, name: 'Initial Contact Email', status: 'completed', scheduledDate: 'Sent 2 days ago' },
    { id: 2, name: 'Follow-up Email', status: 'scheduled', scheduledDate: 'Tomorrow' },
    { id: 3, name: 'Final Follow-up', status: 'scheduled', scheduledDate: 'Next week' },
  ]);
  
  const filteredLeads = b2bLeads.filter(lead => 
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleLeadSelect = (lead: typeof b2bLeads[0]) => {
    setSelectedLead(lead);
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
  
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">B2B Lead Generation</CardTitle>
          <Button className="h-9" size="sm">
            <Plus size={16} className="mr-1" /> Add Lead
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search leads..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Company</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Contact</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Status</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Score</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleLeadSelect(lead)}
                  >
                    <td className="py-3 px-4">{lead.company}</td>
                    <td className="py-3 px-4">{lead.contact}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={`${statusColors[lead.status as keyof typeof statusColors]}`}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
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
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <Mail size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MessageSquare size={16} />
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                            <DropdownMenuItem>Mark as Contacted</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* Custom Email Modal */}
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

      {/* Edit Sequence Modal */}
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
    </div>
  );
};

export default B2BLeadGeneration;
