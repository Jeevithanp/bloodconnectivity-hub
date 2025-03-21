
import React from 'react';
import MapComponent from './MapComponent';

interface DonorLocationMapProps {
  trackerData: any;
  donor: any;
  userLocation: { latitude: number; longitude: number } | null;
}

const DonorLocationMap = ({ trackerData, donor, userLocation }: DonorLocationMapProps) => {
  return (
    <div className="h-64 rounded-lg overflow-hidden border mb-4">
      <MapComponent 
        height="100%"
        initialCenter={[trackerData.longitude, trackerData.latitude]}
        initialZoom={14}
        markers={[
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
        ]}
      />
    </div>
  );
};

export default DonorLocationMap;
