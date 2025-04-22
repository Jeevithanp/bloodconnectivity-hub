
import React from 'react';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';

interface LocationControlProps {
  onRecenter: () => Promise<void>;
  isLoading: boolean;
  interactive?: boolean;
}

const LocationControl = ({ onRecenter, isLoading, interactive = true }: LocationControlProps) => {
  if (!interactive) return null;

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-white shadow-md z-10 flex items-center gap-1"
        onClick={onRecenter}
        disabled={isLoading}
      >
        {isLoading ? <Target className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
        <span>My Location</span>
      </Button>
    </div>
  );
};

export default LocationControl;
