
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Target, Navigation, MapPin } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { useToast } from '@/components/ui/use-toast';

// Google Maps API key
// For production, this should be stored in environment variables
const GOOGLE_MAPS_API_KEY = 'AIzaSyDb_UOAB9u0gH5KPzQXuavrXX-ItKm09So';

// Define libraries array outside component to prevent reloads
const LIBRARIES: ("places")[] = ['places'];

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
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Initialize Google Maps API with static libraries array
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('Map loaded successfully');
    mapRef.current = map;
    setMapLoaded(true);
    if (onMapLoaded) onMapLoaded(map);
  }, [onMapLoaded]);

  const onUnmount = useCallback(() => {
    console.log('Map unmounted');
    mapRef.current = null;
    setMapLoaded(false);
  }, []);

  // Get center coordinates with fallback values
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

  // Generate Google Maps navigation URL
  const generateMapsUrl = (marker: MapMarker) => {
    if (!userLocation) return '';
    
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const destination = `${marker.latitude},${marker.longitude}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  };

  // Handle recenter to user location
  const handleRecenter = async () => {
    try {
      const location = await getCurrentLocation();
      if (location && mapRef.current) {
        mapRef.current.panTo({ lat: location.latitude, lng: location.longitude });
        mapRef.current.setZoom(14);
        console.log('Map recentered to:', location);
        toast({
          title: 'Location Updated',
          description: 'Map centered to your current location.',
        });
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

  // Filter out invalid markers to prevent errors
  const validMarkers = markers.filter(marker => {
    const isValid = 
      marker && 
      typeof marker.latitude === 'number' && 
      !isNaN(marker.latitude) && 
      typeof marker.longitude === 'number' && 
      !isNaN(marker.longitude);
    
    if (!isValid) {
      console.warn('Invalid marker detected and filtered out:', marker);
    }
    
    return isValid;
  });

  // Get marker icon based on type
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

  // Log the current map status for debugging
  useEffect(() => {
    console.log('Google Maps API Status:', { isLoaded, loadError });
    if (loadError) {
      console.error('Google Maps loading error:', loadError);
    }
  }, [isLoaded, loadError]);

  // Recenter map when user location changes if no initialCenter provided
  useEffect(() => {
    if (mapLoaded && mapRef.current && userLocation && !initialCenter) {
      mapRef.current.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
    }
  }, [userLocation, initialCenter, mapLoaded]);

  if (loadError) {
    return <div style={{ height, width }} className={`flex items-center justify-center bg-muted ${className}`}>
      <div className="text-center p-4">
        <h3 className="text-lg font-semibold text-destructive mb-2">Error loading Google Maps</h3>
        <p className="text-sm text-muted-foreground">{loadError.message || 'Failed to load Google Maps'}</p>
        <p className="text-xs mt-2">Please check your API key or internet connection</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    </div>;
  }

  if (!isLoaded) {
    return <div style={{ height, width }} className={`flex items-center justify-center bg-muted ${className}`}>
      <div className="animate-pulse flex items-center gap-2">
        <MapPin className="h-5 w-5 animate-bounce" />
        <span>Loading map...</span>
      </div>
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
        {validMarkers.map((marker) => (
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
      </GoogleMap>
      
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        {interactive && (
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white shadow-md z-10 flex items-center gap-1"
            onClick={handleRecenter}
            disabled={isLoading}
          >
            {isLoading ? <Target className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
            <span>My Location</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
