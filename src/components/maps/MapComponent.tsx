
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useLocation } from '@/contexts/LocationContext';
import { useToast } from '@/components/ui/use-toast';
import { MapComponentProps, MapMarker } from '@/types/maps';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import MapMarkers from './MapMarkers';
import LocationControl from './LocationControl';
import MapLoadingState from './MapLoadingState';

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
  const { userLocation, getCurrentLocation, isLoading: isLocationLoading } = useLocation();
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const { toast } = useToast();
  const [mapLoaded, setMapLoaded] = useState(false);
  const { isLoaded, loadError } = useGoogleMaps();
  
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

  // Recenter map when user location changes if no initialCenter provided
  useEffect(() => {
    if (mapLoaded && mapRef.current && userLocation && !initialCenter) {
      mapRef.current.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
    }
  }, [userLocation, initialCenter, mapLoaded]);

  return (
    <div className={`relative ${className}`} style={{ height, width }}>
      <MapLoadingState
        isLoading={!isLoaded}
        error={loadError}
        height={height}
        width={width}
        className={className}
        onRetry={() => window.location.reload()}
      />

      {isLoaded && (
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
          <MapMarkers
            markers={validMarkers}
            selectedMarker={selectedMarker}
            userLocation={userLocation}
            onMarkerClick={handleMarkerClick}
            onInfoWindowClose={() => setSelectedMarker(null)}
          />
          
          <LocationControl
            onRecenter={handleRecenter}
            isLoading={isLocationLoading}
            interactive={interactive}
          />
        </GoogleMap>
      )}
    </div>
  );
};

export default MapComponent;
