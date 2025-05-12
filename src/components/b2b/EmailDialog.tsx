
import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { B2BLeadDisplay } from './types';

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLead: B2BLeadDisplay | null;
  onSend: () => void;
  isSending: boolean;
  emailSubject: string;
  setEmailSubject: (subject: string) => void;
  emailBody: string;
  setEmailBody: (body: string) => void;
}

const EmailDialog = ({
  open,
  onOpenChange,
  selectedLead,
  onSend,
  isSending,
  emailSubject,
  setEmailSubject,
  emailBody,
  setEmailBody
}: EmailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSend} disabled={isSending}>
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;
