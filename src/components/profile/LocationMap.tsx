
import React from 'react';
import { MapPin, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MapComponent from '@/components/maps/MapComponent';

interface LocationMapProps {
  latitude: number | null;
  longitude: number | null;
  isUpdatingLocation: boolean;
  handleUpdateLocation: () => Promise<void>;
}

const LocationMap = ({ 
  latitude, 
  longitude, 
  isUpdatingLocation, 
  handleUpdateLocation 
}: LocationMapProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Your Location</label>
      {latitude && longitude ? (
        <div className="space-y-3">
          <div className="h-48 rounded-md overflow-hidden">
            <MapComponent 
              initialCenter={[longitude, latitude]}
              initialZoom={14}
              markers={[{
                id: 'user-location',
                latitude: latitude,
                longitude: longitude,
                title: 'Your Location'
              }]}
              height="100%"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleUpdateLocation}
              disabled={isUpdatingLocation}
            >
              {isUpdatingLocation ? (
                <Target className="h-4 w-4 animate-spin" />
              ) : (
                <Target className="h-4 w-4" />
              )}
              <span>Update</span>
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2"
          onClick={handleUpdateLocation}
          disabled={isUpdatingLocation}
        >
          {isUpdatingLocation ? (
            <Target className="h-4 w-4 animate-spin" />
          ) : (
            <Target className="h-4 w-4" />
          )}
          <span>Set Your Current Location</span>
        </Button>
      )}
    </div>
  );
};

export default LocationMap;
