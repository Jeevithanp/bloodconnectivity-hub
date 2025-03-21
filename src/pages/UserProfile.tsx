
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import LocationMap from '@/components/profile/LocationMap';
import ProfileActionCards from '@/components/profile/ProfileActionCards';
import DonateNowForm from '@/components/profile/DonateNowForm';
import { useToast } from '@/components/ui/use-toast';
import { updateDonorStatus } from '@/api/userService';
import { registerDonation } from '@/api/donationService';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Target, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [donationFormOpen, setDonationFormOpen] = useState(false);
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);
  const [locationPromptOpen, setLocationPromptOpen] = useState(false);
  const [emergencyModeActive, setEmergencyModeActive] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  
  const {
    profile,
    setProfile,
    isLoading,
    isSaving,
    isUpdatingLocation,
    isLocationMandatory,
    handleSave,
    handleUpdateLocation
  } = useProfileData(user?.id);

  // Check URL parameters for emergency mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isEmergency = urlParams.get('emergency') === 'true';
    
    if (isEmergency) {
      setEmergencyModeActive(true);
      setInfoDialogOpen(true);
    }
  }, []);

  // Check if location update is required and prompt if needed
  useEffect(() => {
    if (!isLoading && (isLocationMandatory || emergencyModeActive) && profile.is_donor) {
      setLocationPromptOpen(true);
    }
  }, [isLoading, isLocationMandatory, profile.is_donor, emergencyModeActive]);

  const handleDonateNowClick = () => {
    if (!profile.is_donor) {
      toast({
        title: "Not registered as donor",
        description: "Please update your profile and mark yourself as a donor first.",
        variant: "destructive"
      });
      return;
    }

    // Check if address and location are provided
    if (!profile.address.trim()) {
      toast({
        title: "Address Required",
        description: "Please provide your address before donating.",
        variant: "destructive"
      });
      return;
    }

    if (!profile.latitude || !profile.longitude) {
      toast({
        title: "Location Required",
        description: "Please update your location before donating.",
        variant: "destructive"
      });
      setLocationPromptOpen(true);
      return;
    }
    
    setDonationFormOpen(true);
  };

  const handleDonationSubmit = async (values: any) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register a donation.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingDonation(true);
    try {
      // Register the donation using our new service
      await registerDonation(user.id, values);
      
      toast({
        title: "Donation Registered",
        description: `Your donation at ${values.hospitalName} has been registered for ${values.donationDate} at ${values.donationTime}.`,
      });
      
      // Update local state
      setProfile(prev => ({
        ...prev,
        last_donation: new Date().toISOString()
      }));
      
      setDonationFormOpen(false);
    } catch (error) {
      console.error('Error registering donation:', error);
      toast({
        title: "Error",
        description: "Failed to register donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingDonation(false);
    }
  };

  const handleEmergencyMode = () => {
    // Redirect to emergency page or find donors with emergency flag
    navigate('/emergency?emergency=true');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="flex justify-center">
            <p>Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
          
          {emergencyModeActive && (
            <div className="mb-8 bg-destructive/10 p-4 rounded-lg border border-destructive/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-destructive">Emergency Mode Active</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    There is an emergency blood request in your area. Please update your location and check the emergency requests.
                  </p>
                  <div className="mt-3 flex gap-3">
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={handleEmergencyMode}
                    >
                      View Emergency Requests
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setLocationPromptOpen(true)}
                      disabled={isUpdatingLocation}
                    >
                      {isUpdatingLocation ? 'Updating...' : 'Update Location'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <PersonalInfoForm 
            profile={profile} 
            setProfile={setProfile} 
            handleSave={handleSave} 
            isSaving={isSaving} 
          />
          
          <div className="mt-6">
            <LocationMap 
              latitude={profile.latitude} 
              longitude={profile.longitude}
              isUpdatingLocation={isUpdatingLocation}
              handleUpdateLocation={handleUpdateLocation}
            />
          </div>
          
          <ProfileActionCards 
            isDonor={profile.is_donor}
            isUpdatingLocation={isUpdatingLocation}
            handleUpdateLocation={handleUpdateLocation}
            onDonateNowClick={handleDonateNowClick}
          />
          
          <DonateNowForm
            open={donationFormOpen}
            onOpenChange={setDonationFormOpen}
            onSubmit={handleDonationSubmit}
            isSubmitting={isSubmittingDonation}
          />

          {/* Location Prompt Dialog */}
          <Dialog open={locationPromptOpen} onOpenChange={setLocationPromptOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Location Required</DialogTitle>
                <DialogDescription>
                  For emergency blood donation situations, we need your current location to connect you with nearby recipients quickly.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="mb-4">Your location helps us connect you with those in need during emergencies.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button 
                    variant="outline"
                    onClick={() => setLocationPromptOpen(false)}
                  >
                    Later
                  </Button>
                  <Button 
                    onClick={() => {
                      handleUpdateLocation();
                      setLocationPromptOpen(false);
                    }}
                    disabled={isUpdatingLocation}
                    className="flex items-center"
                  >
                    <Target className="mr-2 h-4 w-4" />
                    {isUpdatingLocation ? 'Updating...' : 'Update My Location'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Emergency Info Dialog */}
          <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Blood Request Alert
                </DialogTitle>
                <DialogDescription>
                  There is an urgent need for blood donors in your area. Your help could save lives.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  As a registered donor, you are being notified of an emergency blood request in your area. Please update your location and check the emergency requests to see if you can help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button 
                    variant="outline"
                    onClick={() => setInfoDialogOpen(false)}
                  >
                    I'll Check Later
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleEmergencyMode}
                  >
                    View Emergency Requests
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
