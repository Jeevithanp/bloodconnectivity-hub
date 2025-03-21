
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface EmergencySectionProps {
  isEmergency: boolean;
  handleEmergencyNotifyAll: () => void;
  isActionLoading: boolean;
  donorsCount: number;
}

const EmergencySection = ({
  isEmergency,
  handleEmergencyNotifyAll,
  isActionLoading,
  donorsCount
}: EmergencySectionProps) => {
  if (!isEmergency) return null;
  
  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold text-destructive mb-2">Emergency Mode Active</h2>
      <p className="mb-2">You are in emergency mode. All communications will be marked as high priority.</p>
      <Button 
        variant="destructive" 
        className="mt-2"
        onClick={handleEmergencyNotifyAll}
        disabled={isActionLoading || donorsCount === 0}
      >
        {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Notify All Available Donors
      </Button>
    </div>
  );
};

export default EmergencySection;
