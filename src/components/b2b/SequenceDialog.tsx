
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Plus } from 'lucide-react';
import { B2BLeadDisplay, SequenceStep } from './types';

interface SequenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLead: B2BLeadDisplay | null;
  sequence: SequenceStep[];
  updateSequenceStep: (id: number, field: string, value: string) => void;
  onSave: () => void;
}

const SequenceDialog = ({
  open,
  onOpenChange,
  selectedLead,
  sequence,
  updateSequenceStep,
  onSave
}: SequenceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SequenceDialog;
