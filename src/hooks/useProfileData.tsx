
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
            birth_date: data.data.birth_date || '',
            is_donor: data.data.is_donor || false,
            last_donation: data.data.last_donation || null,
            latitude: data.data.latitude || null,
            longitude: data.data.longitude || null,
          });
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
  }, [userId, toast]);

  const handleSave = async () => {
    if (!userId) return;
    
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
    handleSave,
    handleUpdateLocation
  };
};
