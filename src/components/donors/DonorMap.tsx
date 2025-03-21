
import React from 'react';
import MapComponent from '@/components/maps/MapComponent';

interface DonorMapProps {
  userLocation: { latitude: number; longitude: number } | null;
  donors: any[];
}

const DonorMap = ({ userLocation, donors }: DonorMapProps) => {
  if (!userLocation || donors.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Donor Locations</h2>
      <div className="h-96 rounded-lg overflow-hidden border">
        <MapComponent 
          height="100%"
          initialCenter={[userLocation.longitude, userLocation.latitude]}
          initialZoom={11}
          markers={[
            {
              id: 'user-location',
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              title: 'Your Location',
              type: 'user' as const
            },
            ...donors.map((donor, index) => ({
              id: donor.id || `donor-${index}`,
              latitude: donor.latitude,
              longitude: donor.longitude,
              title: donor.full_name,
              type: 'donor' as const
            }))
          ]}
        />
      </div>
    </div>
  );
};

export default DonorMap;
