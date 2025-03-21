
import React from 'react';
import { Clock, Navigation, MapPin } from 'lucide-react';

interface DonorTrackingInfoProps {
  trackerData: any;
  distance: number | null;
}

const DonorTrackingInfo = ({ trackerData, distance }: DonorTrackingInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center">
        <Clock className="h-5 w-5 text-primary mb-2" />
        <p className="text-sm font-medium">Last Update</p>
        <p className="text-sm text-muted-foreground">
          {new Date(trackerData.lastUpdated).toLocaleTimeString()}
        </p>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center">
        <Navigation className="h-5 w-5 text-primary mb-2" />
        <p className="text-sm font-medium">Distance</p>
        <p className="text-sm text-muted-foreground">
          {distance ? `${distance.toFixed(1)} km away` : 'Calculating...'}
        </p>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center">
        <MapPin className="h-5 w-5 text-primary mb-2" />
        <p className="text-sm font-medium">ETA</p>
        <p className="text-sm text-muted-foreground">{trackerData.eta || 'Unknown'}</p>
      </div>
    </div>
  );
};

export default DonorTrackingInfo;
