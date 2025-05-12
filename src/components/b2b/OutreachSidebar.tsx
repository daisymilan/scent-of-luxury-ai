
import { Calendar, TagIcon, Map, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { B2BLeadDisplay, SequenceStep } from './types';

interface OutreachSidebarProps {
  selectedLead: B2BLeadDisplay | null;
  sequence: SequenceStep[];
  onSendCustomEmail: () => void;
  onEditSequence: () => void;
}

const OutreachSidebar = ({ 
  selectedLead,
  sequence,
  onSendCustomEmail,
  onEditSequence
}: OutreachSidebarProps) => {
  if (!selectedLead) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <Mail size={24} className="text-gray-500" />
        </div>
        <p className="text-gray-500">Select a lead to see outreach options</p>
      </div>
    );
  }

  return (
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
          {sequence.map((step) => (
            <div className="flex items-start" key={step.id}>
              <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mt-0.5 mr-3 ${
                step.status === 'completed' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {step.status === 'completed' ? <Check size={14} /> : <span className="text-xs font-medium">{step.id}</span>}
              </div>
              <div>
                <p className="text-sm font-medium">{step.name}</p>
                <p className="text-xs text-gray-500">{step.scheduledDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-100">
        <Button className="w-full mb-2" onClick={onSendCustomEmail}>
          <Mail size={16} className="mr-2" /> Send Custom Email
        </Button>
        <Button variant="outline" className="w-full" onClick={onEditSequence}>
          Edit Sequence
        </Button>
      </div>
    </div>
  );
};

export default OutreachSidebar;
