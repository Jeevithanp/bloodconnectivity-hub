
import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '@/api/userService';
import { updateUserLocation } from '@/api/locationService';
import { useToast } from '@/components/ui/use-toast';
import { useLocation } from '@/contexts/LocationContext';
import { ProfileData } from '@/types/profile';

const initialProfileState: ProfileData = {
  full_name: '',
  blood_type: '',
  address: '',
  phone: '',
  birth_date: '',
  is_donor: false,
  last_donation: null,
  latitude: null,
  longitude: null,
};

export const useProfileData = (userId: string | undefined) => {
  const { toast } = useToast();
  const { getCurrentLocation } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(initialProfileState);
  const [isLocationMandatory, setIsLocationMandatory] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const data = await getUserProfile(userId);
        if (data && data.data) {
          setProfile({
            full_name: data.data.full_name || '',
            blood_type: data.data.blood_type || '',
            address: data.data.address || '',
            phone: data.data.phone || '',
            birth_date: data.data.birth_date || '',
            is_donor: data.data.is_donor || false,
            last_donation: data.data.last_donation || null,
            latitude: data.data.latitude || null,
            longitude: data.data.longitude || null,
          });
          
          // If user has no location data and they're a donor, mark location as mandatory
          if (data.data.is_donor && (!data.data.latitude || !data.data.longitude)) {
            setIsLocationMandatory(true);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
    
    // Check if there's an 'emergency' parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('emergency') === 'true') {
      setIsLocationMandatory(true);
    }
  }, [userId, toast]);

  const handleSave = async () => {
    if (!userId) return;
    
    // Validate address for all users
    if (!profile.address.trim()) {
      toast({
        title: 'Address Required',
        description: 'Please enter your address for emergency situations.',
        variant: 'destructive',
      });
      return;
    }
    
    // If location is mandatory but missing, get it
    if (isLocationMandatory && (!profile.latitude || !profile.longitude)) {
      toast({
        title: 'Location Required',
        description: 'Please update your location for emergency situations.',
        variant: 'destructive',
      });
      await handleUpdateLocation();
      return;
    }
    
    try {
      setIsSaving(true);
      await updateUserProfile(userId, profile);
      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateLocation = async () => {
    if (!userId) return;
    
    setIsUpdatingLocation(true);
    
    try {
      const location = await getCurrentLocation();
      
      if (location) {
        // Update the local state
        setProfile(prev => ({
          ...prev,
          latitude: location.latitude,
          longitude: location.longitude
        }));
        
        // Save to the backend
        await updateUserLocation(userId, location.latitude, location.longitude);
        
        toast({
          title: 'Location Updated',
          description: 'Your current location has been saved.',
        });
        
        // Reset the mandatory flag
        setIsLocationMandatory(false);
      }
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: 'Error',
        description: 'Failed to update your location. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  return {
    profile,
    setProfile,
    isLoading,
    isSaving,
    isUpdatingLocation,
    isLocationMandatory,
    handleSave,
    handleUpdateLocation
  };
};
