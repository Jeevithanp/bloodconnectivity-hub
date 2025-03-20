
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

type LocationContextType = {
  userLocation: GeolocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<GeolocationCoordinates | null>;
  getAddressFromCoordinates?: (lat: number, lng: number) => Promise<string | null>;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getCurrentLocation = async (): Promise<GeolocationCoordinates | null> => {
    if (!navigator.geolocation) {
      const errorMsg = 'Geolocation is not supported by your browser';
      setError(errorMsg);
      toast({
        title: 'Location Error',
        description: errorMsg,
        variant: 'destructive',
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Requesting user location...');
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        });
      });

      console.log('Location obtained:', position.coords);
      setUserLocation(position.coords);
      return position.coords;
    } catch (err: any) {
      console.error('Location error:', err);
      const errorMessage = err.message || 'Unable to retrieve your location';
      setError(errorMessage);
      toast({
        title: 'Location Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Setup location tracking on component mount
  useEffect(() => {
    console.log('LocationProvider initialized');
    
    // Get location when component mounts - but don't throw errors on initial load
    getCurrentLocation().catch(err => {
      console.log('Initial location fetch failed silently:', err);
    });
    
    // Set up a position watcher for real-time updates
    let watchId: number;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log('Position updated via watcher');
          setUserLocation(position.coords);
        },
        (err) => {
          console.warn('Position watch error:', err.message);
        },
        { enableHighAccuracy: true, maximumAge: 30000 }
      );
      
      console.log('Location watcher started with ID:', watchId);
    }
    
    return () => {
      if (watchId) {
        console.log('Clearing location watcher:', watchId);
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        isLoading,
        error,
        getCurrentLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
