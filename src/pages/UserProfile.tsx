
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import LocationMap from '@/components/profile/LocationMap';
import ProfileActionCards from '@/components/profile/ProfileActionCards';
import { Calendar } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  const {
    profile,
    setProfile,
    isLoading,
    isSaving,
    isUpdatingLocation,
    handleSave,
    handleUpdateLocation
  } = useProfileData(user?.id);

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
          />
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
