
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

const statusColors = {
  'New Lead': 'bg-blue-100 text-blue-800',
  'Contacted': 'bg-yellow-100 text-yellow-800',
  'Interested': 'bg-green-100 text-green-800',
  'Negotiating': 'bg-purple-100 text-purple-800',
};

const B2BLeadGeneration = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<typeof b2bLeads[0] | null>(null);
  
  const filteredLeads = b2bLeads.filter(lead => 
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleLeadSelect = (lead: typeof b2bLeads[0]) => {
    setSelectedLead(lead);
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
                <Button className="w-full mb-2">
                  <Mail size={16} className="mr-2" /> Send Custom Email
                </Button>
                <Button variant="outline" className="w-full">
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
    </div>
  );
};

export default B2BLeadGeneration;
