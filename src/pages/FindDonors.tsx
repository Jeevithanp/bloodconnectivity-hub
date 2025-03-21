
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useLocation } from '@/contexts/LocationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Phone, MapPin, MessageSquare } from 'lucide-react';
import { getNearbyDonors } from '@/api/locationService';
import { sendSms, makeCall, notifyEmergencyRecipient } from '@/api/notificationService';
import MapComponent from '@/components/maps/MapComponent';
import DonorTracker from '@/components/maps/DonorTracker';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { calculateDistance } from '@/lib/utils';

const FindDonors = () => {
  const [bloodType, setBloodType] = useState('');
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [donors, setDonors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [trackingDonor, setTrackingDonor] = useState<any>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [contactType, setContactType] = useState<'sms' | 'call'>('sms');
  
  const { userLocation, getCurrentLocation } = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!userLocation) {
      handleGetLocation();
    }
    
    // Check if there's an emergency parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('emergency') === 'true') {
      setIsEmergency(true);
      toast({
        title: "Emergency Mode Activated",
        description: "Emergency mode is active. Nearby donors will be notified with high priority.",
        variant: "destructive",
      });
    }
  }, []);

  const handleGetLocation = async () => {
    try {
      await getCurrentLocation();
    } catch (error) {
      console.error('Error getting location:', error);
      toast({
        title: "Location Error",
        description: "Failed to get your location. Please enable location services.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    if (!userLocation) {
      toast({
        title: "Location Required",
        description: "Please enable location services to find nearby donors.",
        variant: "destructive",
      });
      await handleGetLocation();
      return;
    }

    setIsLoading(true);
    try {
      const response = await getNearbyDonors(
        bloodType, 
        maxDistance, 
        userLocation.latitude, 
        userLocation.longitude
      );
      
      if (response && Array.isArray(response.data)) {
        setDonors(response.data);
        
        if (response.data.length === 0) {
          toast({
            title: "No Donors Found",
            description: `No ${bloodType || "compatible"} donors found within ${maxDistance}km of your location.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Donors Found",
            description: `Found ${response.data.length} donors in your area.`,
          });
        }
      }
    } catch (error) {
      console.error('Error searching for donors:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for donors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = (donor: any, type: 'sms' | 'call') => {
    setSelectedDonor(donor);
    setContactType(type);
    
    // Pre-fill message based on emergency status
    let defaultMessage = isEmergency 
      ? `EMERGENCY: ${bloodType || "Blood"} donation needed urgently! Please respond as soon as possible.` 
      : `Hello, I'm looking for ${bloodType || "blood"} donors in the area. Are you available to donate?`;
    
    setContactMessage(defaultMessage);
    setShowContactDialog(true);
  };

  const handleSendMessage = async () => {
    if (!selectedDonor || !selectedDonor.phone) {
      toast({
        title: "Contact Error",
        description: "No phone number available for this donor.",
        variant: "destructive",
      });
      return;
    }

    setIsActionLoading(true);
    try {
      if (contactType === 'sms') {
        await sendSms(selectedDonor.phone, contactMessage, isEmergency);
        toast({
          title: "Message Sent",
          description: `SMS sent to ${selectedDonor.full_name}.`,
        });
      } else {
        await makeCall(selectedDonor.phone, contactMessage, isEmergency);
        toast({
          title: "Call Initiated",
          description: `Call initiated to ${selectedDonor.full_name}.`,
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
      setIsActionLoading(false);
    }
  };

  const handleTrackDonor = (donor: any) => {
    setTrackingDonor(donor);
  };

  const handleStopTracking = () => {
    setTrackingDonor(null);
  };

  const handleEmergencyNotifyAll = async () => {
    if (donors.length === 0) {
      toast({
        title: "No Donors to Notify",
        description: "Please search for donors first.",
        variant: "destructive",
      });
      return;
    }

    // Count donors with phone numbers
    const donorsWithPhone = donors.filter(donor => donor.phone);
    if (donorsWithPhone.length === 0) {
      toast({
        title: "No Contactable Donors",
        description: "None of the found donors have phone numbers registered.",
        variant: "destructive",
      });
      return;
    }

    const confirmMessage = `This will send emergency notifications to ${donorsWithPhone.length} donors. Continue?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsActionLoading(true);
    try {
      let successCount = 0;
      const notificationPromises = donorsWithPhone.map(async (donor) => {
        try {
          await notifyEmergencyRecipient({
            recipientId: donor.id,
            recipientName: donor.full_name,
            recipientPhone: donor.phone,
            recipientEmail: donor.email,
            bloodType: bloodType || "compatible",
            hospitalName: "Nearest hospital",
            urgency: "critical",
            message: "Please respond immediately if you can donate. This is an emergency situation."
          });
          successCount++;
          return true;
        } catch (error) {
          console.error(`Failed to notify donor ${donor.id}:`, error);
          return false;
        }
      });

      await Promise.all(notificationPromises);

      toast({
        title: "Emergency Notifications Sent",
        description: `Successfully notified ${successCount} out of ${donorsWithPhone.length} donors.`,
        variant: successCount > 0 ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error in emergency notifications:', error);
      toast({
        title: "Notification Error",
        description: "Failed to send emergency notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Find Blood Donors</h1>
          <p className="text-muted-foreground mb-8">Search for compatible blood donors in your area</p>
          
          {isEmergency && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold text-destructive mb-2">Emergency Mode Active</h2>
              <p className="mb-2">You are in emergency mode. All communications will be marked as high priority.</p>
              <Button 
                variant="destructive" 
                className="mt-2"
                onClick={handleEmergencyNotifyAll}
                disabled={isActionLoading || donors.length === 0}
              >
                {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Notify All Available Donors
              </Button>
            </div>
          )}
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Blood Type</label>
                  <Select value={bloodType} onValueChange={setBloodType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Blood Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Max Distance (km)</label>
                  <Input 
                    type="number" 
                    value={maxDistance} 
                    onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                    min="1" 
                    max="100"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button 
                    className="w-full" 
                    onClick={handleSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      'Search'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {trackingDonor ? (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Tracking Donor</h2>
                <Button variant="outline" onClick={handleStopTracking}>Stop Tracking</Button>
              </div>
              <DonorTracker donor={trackingDonor} userLocation={userLocation} />
            </div>
          ) : userLocation && donors.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Donor Locations</h2>
              <div className="h-96 rounded-lg overflow-hidden border">
                <MapComponent 
                  height="100%"
                  initialCenter={[userLocation.longitude, userLocation.latitude]}
                  initialZoom={11}
                  markers={[
                    {
                      id: 'user-location',
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                      title: 'Your Location',
                      type: 'user'
                    },
                    ...donors.map((donor, index) => ({
                      id: donor.id || `donor-${index}`,
                      latitude: donor.latitude,
                      longitude: donor.longitude,
                      title: donor.full_name,
                      type: 'donor'
                    }))
                  ]}
                />
              </div>
            </div>
          ) : null}
          
          <h2 className="text-2xl font-semibold mb-4">Donor List</h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-lg">Searching for donors...</span>
            </div>
          ) : donors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {donors.map((donor, index) => (
                <Card key={donor.id || index} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-lg">{donor.full_name}</h3>
                        <p className="text-sm text-muted-foreground">Blood Type: {donor.blood_type}</p>
                      </div>
                      <div className="bg-primary/10 px-3 py-1 rounded-full text-sm font-medium">
                        {donor.distance ? `${donor.distance.toFixed(1)} km` : 'Distance N/A'}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {donor.last_donation && (
                        <p className="text-sm">
                          Last Donation: {new Date(donor.last_donation).toLocaleDateString()}
                        </p>
                      )}
                      {donor.address && (
                        <p className="text-sm flex items-start gap-1">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{donor.address}</span>
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {donor.phone && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center gap-1"
                            onClick={() => handleContact(donor, 'sms')}
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>Message</span>
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center gap-1"
                            onClick={() => handleContact(donor, 'call')}
                          >
                            <Phone className="h-4 w-4" />
                            <span>Call</span>
                          </Button>
                        </>
                      )}
                      
                      {donor.latitude && donor.longitude && (
                        <Button 
                          size="sm" 
                          variant="default" 
                          onClick={() => handleTrackDonor(donor)}
                        >
                          Track Donor
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <p className="mb-2 text-muted-foreground">No donors found</p>
              <p className="mb-4">Try adjusting your search criteria or increasing the distance.</p>
              {!userLocation && (
                <Button onClick={handleGetLocation}>Enable Location</Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {contactType === 'sms' ? 'Send Message' : 'Make Call'} to {selectedDonor?.full_name}
            </DialogTitle>
            <DialogDescription>
              {contactType === 'sms' 
                ? 'Send an SMS to request blood donation.' 
                : 'Initiate a call with a message that will be read to the donor.'}
              {isEmergency && ' This is marked as an emergency.'}
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
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={isActionLoading || !contactMessage.trim()}
            >
              {isActionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : contactType === 'sms' ? 'Send Message' : 'Initiate Call'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </Layout>
  );
};

export default FindDonors;
