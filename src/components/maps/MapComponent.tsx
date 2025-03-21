import React, { useRef, useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { useToast } from '@/components/ui/use-toast';

// Google Maps API key
// Replace this with your actual Google Maps API key from Google Cloud Console
// Make sure it has Maps JavaScript API and Geocoding API enabled
const GOOGLE_MAPS_API_KEY = 'AIzaSyDb_UOAB9u0gH5KPzQXuavrXX-ItKm09So';

type MapMarker = {
  id: string;
  longitude: number;
  latitude: number;
  title: string;
  description?: string;
  type?: 'donor' | 'center' | 'hospital' | 'emergency' | 'user';
  color?: string;
};

type MapComponentProps = {
  markers?: MapMarker[];
  initialCenter?: [number, number];
  initialZoom?: number;
  interactive?: boolean;
  height?: string;
  width?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  className?: string;
  onMapLoaded?: (map: google.maps.Map) => void;
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
  onMapLoaded,
  className = '',
}) => {
  const { userLocation, getCurrentLocation, isLoading } = useLocation();
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const { toast } = useToast();
  
  // Initialize Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('Map loaded successfully');
    mapRef.current = map;
    if (onMapLoaded) onMapLoaded(map);
  }, [onMapLoaded]);

  const onUnmount = useCallback(() => {
    console.log('Map unmounted');
    mapRef.current = null;
  }, []);

  // Get center coordinates
  const center = initialCenter 
    ? { lat: initialCenter[1], lng: initialCenter[0] } 
    : userLocation
      ? { lat: userLocation.latitude, lng: userLocation.longitude }
      : { lat: 37.0902, lng: -95.7129 }; // Default to center of US

  // Handle marker click
  const handleMarkerClick = (marker: MapMarker) => {
    console.log('Marker clicked:', marker);
    setSelectedMarker(marker);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  // Handle recenter to user location
  const handleRecenter = async () => {
    try {
      const location = await getCurrentLocation();
      if (location && mapRef.current) {
        mapRef.current.panTo({ lat: location.latitude, lng: location.longitude });
        mapRef.current.setZoom(14);
        console.log('Map recentered to:', location);
      }
    } catch (error) {
      console.error('Error recentering map:', error);
      toast({
        title: 'Location Error',
        description: 'Could not recenter the map to your location.',
        variant: 'destructive',
      });
    }
  };

  // Get marker icon based on type
  const getMarkerIcon = (marker: MapMarker) => {
    let color = marker.color || '#3b82f6';
    if (marker.type === 'donor') color = '#ef4444';
    if (marker.type === 'center') color = '#22c55e';
    if (marker.type === 'hospital') color = '#3b82f6';
    if (marker.type === 'emergency') color = '#f97316';
    if (marker.type === 'user') color = '#8b5cf6'; // Added color for user type

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#ffffff',
      scale: 8,
    };
  };

  // Log the current map status for debugging
  useEffect(() => {
    console.log('Google Maps API Status:', { isLoaded, loadError });
    if (loadError) {
      console.error('Google Maps loading error:', loadError);
    }
  }, [isLoaded, loadError]);

  if (loadError) {
    return <div style={{ height, width }} className={`flex items-center justify-center bg-muted ${className}`}>
      <div className="text-center p-4">
        <h3 className="text-lg font-semibold text-destructive mb-2">Error loading Google Maps</h3>
        <p className="text-sm text-muted-foreground">{loadError.message}</p>
        <p className="text-xs mt-2">Please check your API key or internet connection</p>
      </div>
    </div>;
  }

  if (!isLoaded) {
    return <div style={{ height, width }} className={`flex items-center justify-center bg-muted ${className}`}>
      <div className="animate-pulse">Loading map...</div>
    </div>;
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
            animation={google.maps.Animation.DROP}
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
