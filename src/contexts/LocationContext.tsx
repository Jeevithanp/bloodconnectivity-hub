
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

type LocationContextType = {
  userLocation: GeolocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<GeolocationCoordinates | null>;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getCurrentLocation = async (): Promise<GeolocationCoordinates | null> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      toast({
        title: 'Location Error',
        description: 'Geolocation is not supported by your browser',
        variant: 'destructive',
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      setUserLocation(position.coords);
      return position.coords;
    } catch (err: any) {
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

  useEffect(() => {
    // Get location when component mounts - but don't throw errors on initial load
    getCurrentLocation().catch(err => {
      console.log('Initial location fetch failed silently:', err);
    });
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
