
import React from 'react';
import MapComponent from './MapComponent';
import { MapPin } from 'lucide-react';

interface DonorLocationMapProps {
  trackerData: any;
  donor: any;
  userLocation: { latitude: number; longitude: number } | null;
}

const DonorLocationMap = ({ trackerData, donor, userLocation }: DonorLocationMapProps) => {
  // Validate coordinates before rendering map
  const hasValidCoordinates = 
    trackerData && 
    typeof trackerData.latitude === 'number' && 
    !isNaN(trackerData.latitude) &&
    typeof trackerData.longitude === 'number' && 
    !isNaN(trackerData.longitude);
    
  if (!hasValidCoordinates) {
    return (
      <div className="h-64 rounded-lg overflow-hidden border mb-4 flex flex-col items-center justify-center bg-muted/30 p-4">
        <MapPin className="h-8 w-8 text-muted-foreground/60 mb-2" />
        <p className="text-muted-foreground text-center">Location data unavailable or invalid</p>
        <p className="text-xs text-muted-foreground/70 text-center mt-1">
          The donor may need to update their location settings
        </p>
      </div>
    );
  }

  // Make sure we only pass valid markers to the map
  const markers = [
    {
      id: 'donor-location',
      latitude: trackerData.latitude,
      longitude: trackerData.longitude,
      title: `${donor.full_name} (${donor.blood_type || 'Unknown blood type'})`,
      type: 'donor' as const
    },
    ...(userLocation ? [{
      id: 'user-location',
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      title: 'Your Location',
      type: 'user' as const
    }] : [])
  ];

  return (
    <div className="h-64 rounded-lg overflow-hidden border mb-4">
      <MapComponent 
        height="100%"
        initialCenter={[trackerData.longitude, trackerData.latitude]}
        initialZoom={14}
        markers={markers}
      />
    </div>
  );
};

export default DonorLocationMap;
