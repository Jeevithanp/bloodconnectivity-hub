
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { trackDonor } from '@/api/locationService';
import { useToast } from '@/components/ui/use-toast';
import { calculateDistance } from '@/lib/utils';
import DonorLocationMap from './DonorLocationMap';
import DonorTrackingInfo from './DonorTrackingInfo';
import DonorContactActions from './DonorContactActions';
import DonorContactDialog from './DonorContactDialog';

interface DonorTrackerProps {
  donor: any;
  userLocation: { latitude: number; longitude: number } | null;
}

const DonorTracker = ({ donor, userLocation }: DonorTrackerProps) => {
  const [trackerData, setTrackerData] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactType, setContactType] = useState<'sms' | 'call'>('sms');
  
  const { toast } = useToast();
  
  useEffect(() => {
    let trackingInterval: any;
    
    const updateTracking = async () => {
      try {
        const data = await trackDonor(donor.id);
        
        setTrackerData(data);
        setIsLoading(false);
        
        if (data && data.latitude && data.longitude && userLocation) {
          const dist = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            data.latitude,
            data.longitude
          );
          setDistance(dist);
        }
      } catch (error) {
        console.error("Error tracking donor:", error);
        setError("Failed to track donor. Please try again.");
        setIsLoading(false);
      }
    };
    
    // Initial update
    updateTracking();
    
    // Set interval for tracking updates
    trackingInterval = setInterval(updateTracking, 15000); // Update every 15 seconds
    
    return () => {
      if (trackingInterval) clearInterval(trackingInterval);
    };
  }, [donor.id, userLocation]);

  const handleContact = (type: 'sms' | 'call') => {
    setContactType(type);
    const defaultMessage = type === 'sms' 
      ? `Hi ${donor.full_name}, thank you for donating. I'm tracking your location.` 
      : `Hello ${donor.full_name}, this is an automated message to confirm your blood donation. Thank you for your support.`;
    setContactMessage(defaultMessage);
    setShowContactDialog(true);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tracking {donor.full_name}</span>
            {trackerData?.status && (
              <Badge variant={trackerData.status === 'moving' ? 'default' : 'secondary'}>
                {trackerData.status === 'moving' ? 'Moving' : 'Stationary'}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading tracking data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          ) : trackerData ? (
            <div>
              <DonorLocationMap 
                trackerData={trackerData} 
                donor={donor} 
                userLocation={userLocation} 
              />
              
              <DonorTrackingInfo trackerData={trackerData} distance={distance} />
              
              <DonorContactActions donor={donor} onContact={handleContact} />
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No tracking data available</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <DonorContactDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        donor={donor}
        contactType={contactType}
        contactMessage={contactMessage}
        setContactMessage={setContactMessage}
      />
    </>
  );
};

export default DonorTracker;
