
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, BarChart3 } from 'lucide-react';
import { B2BLeadDisplay, statusColors } from './types';

interface LeadTableProps {
  leads: B2BLeadDisplay[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLead: B2BLeadDisplay | null;
  onLeadSelect: (lead: B2BLeadDisplay) => void;
  onViewLeadDetails: (lead: B2BLeadDisplay) => void;
  onSendCustomEmail: (lead: B2BLeadDisplay) => void;
}

const LeadTable = ({
  leads,
  searchQuery,
  setSearchQuery,
  selectedLead,
  onLeadSelect,
  onViewLeadDetails,
  onSendCustomEmail,
}: LeadTableProps) => {
  const filteredLeads = leads.filter(lead => 
    (lead.company?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (lead.contact?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (lead.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (lead.industry?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (lead.location?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (lead.brand?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
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
                  onClick={() => onLeadSelect(lead)}
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
                        onSendCustomEmail(lead);
                      }}>
                        <Mail size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                        e.stopPropagation();
                        onViewLeadDetails(lead);
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
                          <DropdownMenuItem onClick={() => onViewLeadDetails(lead)}>View Details</DropdownMenuItem>
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
    </>
  );
};

export default LeadTable;
