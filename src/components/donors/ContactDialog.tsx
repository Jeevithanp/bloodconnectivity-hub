
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface ContactDialogProps {
  showContactDialog: boolean;
  setShowContactDialog: (show: boolean) => void;
  selectedDonor: any;
  contactType: 'sms' | 'call';
  contactMessage: string;
  setContactMessage: (message: string) => void;
  handleSendMessage: () => void;
  isActionLoading: boolean;
  isEmergency: boolean;
}

const ContactDialog = ({
  showContactDialog,
  setShowContactDialog,
  selectedDonor,
  contactType,
  contactMessage,
  setContactMessage,
  handleSendMessage,
  isActionLoading,
  isEmergency
}: ContactDialogProps) => {
  return (
    <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {contactType === 'sms' ? 'Send Message' : 'Make Call'} to {selectedDonor?.full_name}
          </DialogTitle>
          <DialogDescription>
            {contactType === 'sms' 
              ? 'Send an SMS to request blood donation.' 
              : 'Initiate a call with a message that will be read to the donor.'}
            {isEmergency && ' This is marked as an emergency.'}
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
            onClick={() => setShowContactDialog(false)}
            disabled={isActionLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={isActionLoading || !contactMessage.trim()}
          >
            {isActionLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : contactType === 'sms' ? 'Send Message' : 'Initiate Call'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
