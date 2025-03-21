
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Phone, MessageSquare, MapPin, Clock, LocateFixed, Navigation } from 'lucide-react';
import MapComponent from './MapComponent';
import { trackDonor } from '@/api/locationService';
import { formatDistance } from '@/utils/mapUtils';
import { useLocation } from '@/contexts/LocationContext';

type DonorTrackerProps = {
  donorId: string;
  donorName: string;
  onClose: () => void;
  contactPhone?: string;
};

type DonorLocation = {
  latitude: number;
  longitude: number;
  lastUpdated: string;
  address?: string;
  eta?: string;
  status?: 'moving' | 'stationary' | 'arrived';
};

const DonorTracker: React.FC<DonorTrackerProps> = ({ 
  donorId, 
  donorName, 
  onClose,
  contactPhone = "911" // Default emergency number if donor phone not available
}) => {
  const [donorLocation, setDonorLocation] = useState<DonorLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingStarted, setTrackingStarted] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [distanceFromUser, setDistanceFromUser] = useState<string | null>(null);
  const [isMessaging, setIsMessaging] = useState(false);
  const [messageText, setMessageText] = useState("");
  const { toast } = useToast();
  const { userLocation } = useLocation();
  
  // Track interval reference
  const trackingIntervalRef = React.useRef<number | null>(null);

  useEffect(() => {
    let intervalId: number;

    const fetchDonorLocation = async () => {
      try {
        setIsLoading(true);
        console.log('Tracking donor:', donorId);
        const response = await trackDonor(donorId);
        
        if (response?.data) {
          setDonorLocation(response.data);
          console.log('Donor location updated:', response.data);
          
          // Calculate distance if user location is available
          if (userLocation && response.data.latitude && response.data.longitude) {
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(userLocation.latitude, userLocation.longitude),
              new google.maps.LatLng(response.data.latitude, response.data.longitude)
            );
            
            // Convert from meters to kilometers
            const distanceInKm = distance / 1000;
            setDistanceFromUser(formatDistance(distanceInKm));
          }
        } else {
          console.error('No donor location data received');
          toast({
            title: 'Tracking Error',
            description: 'Could not retrieve donor location',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error tracking donor:', error);
        toast({
          title: 'Tracking Error',
          description: 'Failed to track donor location',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (trackingStarted) {
      fetchDonorLocation();
      // Update location every 15 seconds
      trackingIntervalRef.current = window.setInterval(fetchDonorLocation, 15000) as unknown as number;
    }

    return () => {
      if (trackingIntervalRef.current) {
        console.log('Cleaning up tracking interval');
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }
    };
  }, [donorId, trackingStarted, toast, userLocation]);

  // Handle map loaded event
  const handleMapLoaded = (map: google.maps.Map) => {
    console.log('Map instance loaded in DonorTracker');
    setMapInstance(map);
  };

  const startTracking = () => {
    setTrackingStarted(true);
    toast({
      title: 'Tracking Started',
      description: `Now tracking ${donorName}'s location`,
    });
  };

  const stopTracking = () => {
    setTrackingStarted(false);
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
    
    toast({
      title: 'Tracking Stopped',
      description: `Stopped tracking ${donorName}'s location`,
    });
  };

  const openDirections = () => {
    if (donorLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${donorLocation.latitude},${donorLocation.longitude}`;
      window.open(url, '_blank');
    }
  };

  const handleCall = () => {
    // Use tel: protocol to initiate a phone call
    window.location.href = `tel:${contactPhone}`;
    toast({
      title: 'Initiating Call',
      description: `Calling ${donorName} for emergency assistance`,
    });
  };

  const handleMessage = () => {
    // Use sms: protocol to open messaging app
    window.location.href = `sms:${contactPhone}?body=Emergency: Need blood donation assistance. Please respond ASAP.`;
    toast({
      title: 'Message Sent',
      description: `Emergency message sent to ${donorName}`,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tracking {donorName}</span>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!trackingStarted ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              You are about to start tracking {donorName}'s location. 
              They will be notified about this tracking request.
            </p>
            <Button onClick={startTracking}>Start Tracking</Button>
          </div>
        ) : isLoading && !donorLocation ? (
          <div className="text-center py-6">
            <div className="animate-pulse mb-4">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
            <p className="text-muted-foreground">
              Requesting location from {donorName}...
            </p>
          </div>
        ) : donorLocation ? (
          <>
            <div className="h-64 w-full mb-4">
              <MapComponent 
                markers={[
                  {
                    id: donorId,
                    latitude: donorLocation.latitude,
                    longitude: donorLocation.longitude,
                    title: donorName,
                    type: 'donor'
                  }
                ]}
                initialCenter={[donorLocation.longitude, donorLocation.latitude]}
                initialZoom={15}
                height="100%"
                onMapLoaded={handleMapLoaded}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Current Location</p>
                  <p className="text-sm text-muted-foreground">
                    {donorLocation.address || 'Address not available'}
                  </p>
                  {distanceFromUser && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {distanceFromUser} from your location
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Estimated Arrival</p>
                  <p className="text-sm text-muted-foreground">
                    {donorLocation.eta || 'Calculating...'}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-3 mt-3 flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(donorLocation.lastUpdated).toLocaleTimeString()}
                </p>
                <p className={`text-xs font-medium ${
                  donorLocation.status === 'moving' ? 'text-amber-500' : 
                  donorLocation.status === 'arrived' ? 'text-green-500' : 'text-muted-foreground'
                }`}>
                  Status: {donorLocation.status || 'Unknown'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center gap-2"
                onClick={handleCall}
              >
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 flex items-center gap-2" 
                onClick={handleMessage}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Message</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 flex items-center gap-2" 
                onClick={openDirections}
              >
                <Navigation className="h-4 w-4" />
                <span>Directions</span>
              </Button>
            </div>
            <Button 
              variant="destructive" 
              className="w-full mt-2" 
              onClick={stopTracking}
            >
              Stop Tracking
            </Button>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              Could not retrieve {donorName}'s location. They may have denied the tracking request.
            </p>
            <Button variant="outline" className="mt-4" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DonorTracker;
