
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface MapLoadingStateProps {
  isLoading: boolean;
  error?: Error | null;
  height: string;
  width: string;
  className?: string;
  onRetry?: () => void;
}

const MapLoadingState = ({ 
  isLoading, 
  error, 
  height, 
  width, 
  className = '',
  onRetry 
}: MapLoadingStateProps) => {
  if (error) {
    return (
      <div style={{ height, width }} className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold text-destructive mb-2">Error loading Google Maps</h3>
          <p className="text-sm text-muted-foreground">{error.message || 'Failed to load Google Maps'}</p>
          <p className="text-xs mt-2">Please check your API key or internet connection</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={onRetry}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ height, width }} className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="animate-pulse flex items-center gap-2">
          <MapPin className="h-5 w-5 animate-bounce" />
          <span>Loading map...</span>
        </div>
      </div>
    );
  }

  return null;
};

export default MapLoadingState;
