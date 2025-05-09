
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCustomerCount: number;
  reminderType: string;
  setReminderType: (type: string) => void;
  reminderSubject: string;
  setReminderSubject: (subject: string) => void;
  reminderMessage: string;
  setReminderMessage: (message: string) => void;
  onSend: () => void;
  isSending: boolean;
}

const ReminderDialog: React.FC<ReminderDialogProps> = ({
  open,
  onOpenChange,
  selectedCustomerCount,
  reminderType,
  setReminderType,
  reminderSubject,
  setReminderSubject,
  reminderMessage,
  setReminderMessage,
  onSend,
  isSending
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={selectedCustomerCount === 0}>
          Send Reorder Reminder ({selectedCustomerCount})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Reorder Reminder</DialogTitle>
          <DialogDescription>
            Configure your reorder reminder for {selectedCustomerCount} selected customers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Reminder Type</Label>
            <Select value={reminderType} onValueChange={setReminderType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="both">Email & SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Subject Line</Label>
            <Input 
              value={reminderSubject}
              onChange={(e) => setReminderSubject(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea 
              rows={6}
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSend} disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Reminders'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
