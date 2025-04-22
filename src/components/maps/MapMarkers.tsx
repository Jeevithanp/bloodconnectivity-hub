
import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { MapMarker } from '@/types/maps';
import { Navigation } from 'lucide-react';

interface MapMarkersProps {
  markers: MapMarker[];
  selectedMarker: MapMarker | null;
  userLocation: { latitude: number; longitude: number } | null;
  onMarkerClick: (marker: MapMarker) => void;
  onInfoWindowClose: () => void;
}

const MapMarkers = ({ 
  markers, 
  selectedMarker, 
  userLocation,
  onMarkerClick, 
  onInfoWindowClose 
}: MapMarkersProps) => {
  const getMarkerIcon = (marker: MapMarker) => {
    let color = marker.color || '#3b82f6';
    if (marker.type === 'donor') color = '#ef4444';
    if (marker.type === 'center') color = '#22c55e';
    if (marker.type === 'hospital') color = '#3b82f6';
    if (marker.type === 'emergency') color = '#f97316';
    if (marker.type === 'user') color = '#8b5cf6';

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#ffffff',
      scale: 8,
    };
  };

  const generateMapsUrl = (marker: MapMarker) => {
    if (!userLocation) return '';
    
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const destination = `${marker.latitude},${marker.longitude}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  };

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={{ lat: marker.latitude, lng: marker.longitude }}
          onClick={() => onMarkerClick(marker)}
          icon={getMarkerIcon(marker)}
          title={marker.title}
          animation={google.maps.Animation.DROP}
        />
      ))}

      {selectedMarker && (
        <InfoWindow
          position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
          onCloseClick={onInfoWindowClose}
        >
          <div className="p-2">
            <h3 className="font-semibold">{selectedMarker.title}</h3>
            {selectedMarker.description && <p className="text-sm">{selectedMarker.description}</p>}
            
            {userLocation && selectedMarker.type === 'donor' && (
              <div className="mt-2">
                <a 
                  href={generateMapsUrl(selectedMarker)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary text-sm flex items-center gap-1 hover:underline"
                >
                  <Navigation className="h-3 w-3" /> 
                  Navigate to location
                </a>
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default MapMarkers;
