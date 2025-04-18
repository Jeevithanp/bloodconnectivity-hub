
import React from 'react';
import MapComponent from './MapComponent';

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
      <div className="h-64 rounded-lg overflow-hidden border mb-4 flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Location data unavailable or invalid</p>
      </div>
    );
  }

  const markers = [
    {
      id: 'donor-location',
      latitude: trackerData.latitude,
      longitude: trackerData.longitude,
      title: `${donor.full_name} (${donor.blood_type})`,
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
