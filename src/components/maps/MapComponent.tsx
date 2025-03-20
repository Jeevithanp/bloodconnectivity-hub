
import React, { useRef, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { MapPin, Target } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyDb_UOAB9u0gH5KPzQXuavrXX-ItKm09So'; // This is a placeholder key, replace with your actual key

type Marker = {
  id: string;
  longitude: number;
  latitude: number;
  title: string;
  description?: string;
  type?: 'donor' | 'center' | 'hospital' | 'emergency';
  color?: string;
};

type MapComponentProps = {
  markers?: Marker[];
  initialCenter?: [number, number];
  initialZoom?: number;
  interactive?: boolean;
  height?: string;
  width?: string;
  onMarkerClick?: (marker: Marker) => void;
  className?: string;
};

// Map container styles
const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

const MapComponent: React.FC<MapComponentProps> = ({
  markers = [],
  initialCenter,
  initialZoom = 12,
  interactive = true,
  height = '400px',
  width = '100%',
  onMarkerClick,
  className = '',
}) => {
  const { userLocation, getCurrentLocation, isLoading } = useLocation();
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Initialize Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Get center coordinates
  const center = initialCenter 
    ? { lat: initialCenter[1], lng: initialCenter[0] } 
    : userLocation
      ? { lat: userLocation.latitude, lng: userLocation.longitude }
      : { lat: 37.0902, lng: -95.7129 }; // Default to center of US

  // Handle marker click
  const handleMarkerClick = (marker: Marker) => {
    setSelectedMarker(marker);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  // Handle recenter to user location
  const handleRecenter = async () => {
    const location = await getCurrentLocation();
    if (location && mapRef.current) {
      mapRef.current.panTo({ lat: location.latitude, lng: location.longitude });
      mapRef.current.setZoom(14);
    }
  };

  // Get marker icon based on type
  const getMarkerIcon = (marker: Marker) => {
    let color = marker.color || '#3b82f6';
    if (marker.type === 'donor') color = '#ef4444';
    if (marker.type === 'center') color = '#22c55e';
    if (marker.type === 'hospital') color = '#3b82f6';
    if (marker.type === 'emergency') color = '#f97316';

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#ffffff',
      scale: 8,
    };
  };

  if (!isLoaded) {
    return <div style={{ height, width }} className={`flex items-center justify-center bg-muted ${className}`}>Loading map...</div>;
  }

  return (
    <div className={`relative ${className}`} style={{ height, width }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={initialZoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: !interactive,
          zoomControl: interactive,
          scrollwheel: interactive,
          gestureHandling: interactive ? 'auto' : 'none',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.latitude, lng: marker.longitude }}
            onClick={() => handleMarkerClick(marker)}
            icon={getMarkerIcon(marker)}
            title={marker.title}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold">{selectedMarker.title}</h3>
              {selectedMarker.description && <p className="text-sm">{selectedMarker.description}</p>}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {interactive && (
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute bottom-4 right-4 bg-white shadow-md z-10 flex items-center gap-1"
          onClick={handleRecenter}
          disabled={isLoading}
        >
          {isLoading ? <Target className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
          <span>My Location</span>
        </Button>
      )}
    </div>
  );
};

export default MapComponent;
