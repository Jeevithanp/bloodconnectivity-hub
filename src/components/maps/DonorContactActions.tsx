
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone } from 'lucide-react';

interface DonorContactActionsProps {
  donor: any;
  onContact: (type: 'sms' | 'call') => void;
}

const DonorContactActions = ({ donor, onContact }: DonorContactActionsProps) => {
  if (!donor.phone) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-6">
      <Button 
        variant="outline" 
        className="flex items-center gap-1"
        onClick={() => onContact('sms')}
      >
        <MessageSquare className="h-4 w-4" />
        <span>Send Message</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-1"
        onClick={() => onContact('call')}
      >
        <Phone className="h-4 w-4" />
        <span>Make Call</span>
      </Button>
    </div>
  );
};

export default DonorContactActions;
