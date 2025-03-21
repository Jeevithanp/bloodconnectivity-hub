
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getNearbyDonors } from '@/api/locationService';
import { sendSms, makeCall, notifyEmergencyRecipient } from '@/api/notificationService';
import DonorTracker from '@/components/maps/DonorTracker';
import SearchForm from '@/components/donors/SearchForm';
import EmergencySection from '@/components/donors/EmergencySection';
import DonorMap from '@/components/donors/DonorMap';
import DonorList from '@/components/donors/DonorList';
import ContactDialog from '@/components/donors/ContactDialog';

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
          
          <EmergencySection 
            isEmergency={isEmergency}
            handleEmergencyNotifyAll={handleEmergencyNotifyAll}
            isActionLoading={isActionLoading}
            donorsCount={donors.length}
          />
          
          <SearchForm 
            bloodType={bloodType}
            setBloodType={setBloodType}
            maxDistance={maxDistance}
            setMaxDistance={setMaxDistance}
            handleSearch={handleSearch}
            isLoading={isLoading}
          />
          
          {trackingDonor ? (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Tracking Donor</h2>
                <Button variant="outline" onClick={handleStopTracking}>Stop Tracking</Button>
              </div>
              <DonorTracker donor={trackingDonor} userLocation={userLocation} />
            </div>
          ) : (
            <DonorMap userLocation={userLocation} donors={donors} />
          )}
          
          <h2 className="text-2xl font-semibold mb-4">Donor List</h2>
          <DonorList 
            donors={donors}
            isLoading={isLoading}
            userLocation={userLocation}
            handleContact={handleContact}
            handleTrackDonor={handleTrackDonor}
            handleGetLocation={handleGetLocation}
          />
          
          <ContactDialog 
            showContactDialog={showContactDialog}
            setShowContactDialog={setShowContactDialog}
            selectedDonor={selectedDonor}
            contactType={contactType}
            contactMessage={contactMessage}
            setContactMessage={setContactMessage}
            handleSendMessage={handleSendMessage}
            isActionLoading={isActionLoading}
            isEmergency={isEmergency}
          />
        </div>
      </div>
    </Layout>
  );
};

export default FindDonors;
