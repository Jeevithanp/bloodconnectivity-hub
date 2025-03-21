
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [donationFormOpen, setDonationFormOpen] = useState(false);
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);
  const [locationPromptOpen, setLocationPromptOpen] = useState(false);
  
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

  // Check if location update is required and prompt if needed
  useEffect(() => {
    if (!isLoading && isLocationMandatory && profile.is_donor) {
      setLocationPromptOpen(true);
    }
  }, [isLoading, isLocationMandatory, profile.is_donor]);

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
    setIsSubmittingDonation(true);
    try {
      // In a real app, we would save this data to the database
      console.log('Donation registration values:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Donation Registered",
        description: `Your donation at ${values.hospitalName} has been registered for ${values.donationDate} at ${values.donationTime}.`,
      });
      
      // Update last donation time
      if (user?.id) {
        await updateDonorStatus(user.id, true);
        
        // Update local state
        setProfile(prev => ({
          ...prev,
          last_donation: new Date().toISOString()
        }));
      }
      
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
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
