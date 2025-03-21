import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Navigation, MapPin, AlertCircle, MessageSquare, Phone } from 'lucide-react';
import { trackDonor } from '@/api/locationService';
import { useToast } from '@/components/ui/use-toast';
import MapComponent from './MapComponent';
import { calculateDistance } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { sendSms, makeCall } from '@/api/notificationService';

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
  const [isSending, setIsSending] = useState(false);
  
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

  const handleSendMessage = async () => {
    if (!donor || !donor.phone) {
      toast({
        title: "Contact Error",
        description: "No phone number available for this donor.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      if (contactType === 'sms') {
        await sendSms(donor.phone, contactMessage, false);
        toast({
          title: "Message Sent",
          description: `SMS sent to ${donor.full_name}.`,
        });
      } else {
        await makeCall(donor.phone, contactMessage, false);
        toast({
          title: "Call Initiated",
          description: `Call initiated to ${donor.full_name}.`,
        });
      }
      
      setShowContactDialog(false);
    } catch (error) {
      console.error(`Error sending ${contactType}:`, error);
      toast({
        title: "Contact Error",
        description: `Failed to send ${contactType}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
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
              <div className="h-64 rounded-lg overflow-hidden border mb-4">
                <MapComponent 
                  height="100%"
                  initialCenter={[trackerData.longitude, trackerData.latitude]}
                  initialZoom={14}
                  markers={[
                    {
                      id: 'donor-location',
                      latitude: trackerData.latitude,
                      longitude: trackerData.longitude,
                      title: `${donor.full_name} (${donor.blood_type})`,
                      type: 'donor'
                    },
                    ...(userLocation ? [{
                      id: 'user-location',
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                      title: 'Your Location',
                      type: 'user' as const
                    }] : [])
                  ]}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center">
                  <Clock className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-medium">Last Update</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(trackerData.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center">
                  <Navigation className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-medium">Distance</p>
                  <p className="text-sm text-muted-foreground">
                    {distance ? `${distance.toFixed(1)} km away` : 'Calculating...'}
                  </p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center">
                  <MapPin className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-medium">ETA</p>
                  <p className="text-sm text-muted-foreground">{trackerData.eta || 'Unknown'}</p>
                </div>
              </div>
              
              {donor.phone && (
                <div className="flex flex-wrap gap-2 mt-6">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => handleContact('sms')}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Send Message</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => handleContact('call')}
                  >
                    <Phone className="h-4 w-4" />
                    <span>Make Call</span>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No tracking data available</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {contactType === 'sms' ? 'Send Message' : 'Make Call'} to {donor?.full_name}
            </DialogTitle>
            <DialogDescription>
              {contactType === 'sms' 
                ? 'Send an SMS to this donor.' 
                : 'Initiate a call with a message that will be read to the donor.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea 
                value={contactMessage} 
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Enter your message here"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowContactDialog(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={isSending || !contactMessage.trim()}
            >
              {isSending ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : contactType === 'sms' ? 'Send Message' : 'Initiate Call'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonorTracker;
