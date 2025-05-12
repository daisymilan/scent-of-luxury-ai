
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Mail, MessageSquare } from 'lucide-react';
import { B2BLeadDisplay, statusColors } from './types';

interface LeadDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLead: B2BLeadDisplay | null;
}

const LeadDetailDialog = ({
  open,
  onOpenChange,
  selectedLead
}: LeadDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!selectedLead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Lead Details: {selectedLead?.company}</DialogTitle>
          <DialogDescription>
            Detailed information about this B2B lead and their interaction history.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              
              {/* Orders table would go here */}
              <div className="text-center py-8 text-gray-500">
                No order history available for this lead.
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="interactions">
            <div className="space-y-4">
              <div className="flex justify-between">
                <h3 className="font-medium">Recent Interactions</h3>
                <Button variant="outline" size="sm">
                  <Plus size={14} className="mr-1" /> Add Interaction
                </Button>
              </div>
              
              {/* This would be populated with real interaction data */}
              <div className="space-y-3">
                <div className="border rounded-md p-3">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">Initial Email</span>
                    </div>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Sent initial partnership opportunity email.
                  </p>
                </div>
                
                <div className="border rounded-md p-3">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                      <span className="font-medium">Phone Call</span>
                    </div>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Discussed product lineup and potential distribution channels.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailDialog;
