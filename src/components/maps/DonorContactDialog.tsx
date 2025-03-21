
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Clock } from 'lucide-react';
import { sendSms, makeCall } from '@/api/notificationService';
import { useToast } from '@/components/ui/use-toast';

interface DonorContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donor: any;
  contactType: 'sms' | 'call';
  contactMessage: string;
  setContactMessage: (message: string) => void;
}

const DonorContactDialog = ({ 
  open, 
  onOpenChange, 
  donor, 
  contactType, 
  contactMessage, 
  setContactMessage 
}: DonorContactDialogProps) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!donor || !donor.phone) {
      toast({
        title: "Contact Error",
        description: "No phone number available for this donor.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      if (contactType === 'sms') {
        await sendSms(donor.phone, contactMessage, false);
        toast({
          title: "Message Sent",
          description: `SMS sent to ${donor.full_name}.`,
        });
      } else {
        await makeCall(donor.phone, contactMessage, false);
        toast({
          title: "Call Initiated",
          description: `Call initiated to ${donor.full_name}.`,
        });
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error(`Error sending ${contactType}:`, error);
      toast({
        title: "Contact Error",
        description: `Failed to send ${contactType}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {contactType === 'sms' ? 'Send Message' : 'Make Call'} to {donor?.full_name}
          </DialogTitle>
          <DialogDescription>
            {contactType === 'sms' 
              ? 'Send an SMS to this donor.' 
              : 'Initiate a call with a message that will be read to the donor.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea 
              value={contactMessage} 
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Enter your message here"
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={isSending || !contactMessage.trim()}
          >
            {isSending ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : contactType === 'sms' ? 'Send Message' : 'Initiate Call'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DonorContactDialog;
