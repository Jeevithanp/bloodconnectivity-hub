
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Phone, MessageSquare, MapPin, Clock } from 'lucide-react';
import MapComponent from './MapComponent';
import { trackDonor } from '@/api/locationService';

type DonorTrackerProps = {
  donorId: string;
  donorName: string;
  onClose: () => void;
};

type DonorLocation = {
  latitude: number;
  longitude: number;
  lastUpdated: string;
  address?: string;
  eta?: string;
  status?: 'moving' | 'stationary' | 'arrived';
};

const DonorTracker: React.FC<DonorTrackerProps> = ({ donorId, donorName, onClose }) => {
  const [donorLocation, setDonorLocation] = useState<DonorLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingStarted, setTrackingStarted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let intervalId: number;

    const fetchDonorLocation = async () => {
      try {
        setIsLoading(true);
        const response = await trackDonor(donorId);
        
        if (response?.data) {
          setDonorLocation(response.data);
        } else {
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
      intervalId = window.setInterval(fetchDonorLocation, 15000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [donorId, trackingStarted, toast]);

  const startTracking = () => {
    setTrackingStarted(true);
    toast({
      title: 'Tracking Started',
      description: `Now tracking ${donorName}'s location`,
    });
  };

  const stopTracking = () => {
    setTrackingStarted(false);
    toast({
      title: 'Tracking Stopped',
      description: `Stopped tracking ${donorName}'s location`,
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
              <Button variant="outline" className="flex-1 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </Button>
              <Button variant="outline" className="flex-1 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Message</span>
              </Button>
              <Button variant="destructive" className="flex-1" onClick={stopTracking}>
                Stop Tracking
              </Button>
            </div>
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
