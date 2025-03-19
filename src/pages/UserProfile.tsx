
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Droplet, Map, Calendar, Check, Target, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '@/api/userService';
import { useLocation } from '@/contexts/LocationContext';
import { updateUserLocation } from '@/api/locationService';
import MapComponent from '@/components/maps/MapComponent';

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { userLocation, getCurrentLocation } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    blood_type: '',
    address: '',
    birth_date: '',
    is_donor: false,
    last_donation: null as string | null,
    latitude: null as number | null,
    longitude: null as number | null,
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await getUserProfile(user.id);
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
  }, [user, toast]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      await updateUserProfile(user.id, profile);
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
    if (!user) return;
    
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
        await updateUserLocation(user.id, location.latitude, location.longitude);
        
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
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Manage your personal information and donation preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input 
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Blood Type</label>
                <Select 
                  value={profile.blood_type} 
                  onValueChange={(value) => setProfile({ ...profile, blood_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your blood type" />
                  </SelectTrigger>
                  <SelectContent>
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input 
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input 
                  type="date" 
                  value={profile.birth_date}
                  onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Location</label>
                {profile.latitude && profile.longitude ? (
                  <div className="space-y-3">
                    <div className="h-48 rounded-md overflow-hidden">
                      <MapComponent 
                        initialCenter={[profile.longitude, profile.latitude]}
                        initialZoom={14}
                        markers={[{
                          id: 'user-location',
                          latitude: profile.latitude,
                          longitude: profile.longitude,
                          title: 'Your Location'
                        }]}
                        height="100%"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Last updated: {new Date().toLocaleDateString()}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={handleUpdateLocation}
                        disabled={isUpdatingLocation}
                      >
                        {isUpdatingLocation ? (
                          <Target className="h-4 w-4 animate-spin" />
                        ) : (
                          <Target className="h-4 w-4" />
                        )}
                        <span>Update</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={handleUpdateLocation}
                    disabled={isUpdatingLocation}
                  >
                    {isUpdatingLocation ? (
                      <Target className="h-4 w-4 animate-spin" />
                    ) : (
                      <Target className="h-4 w-4" />
                    )}
                    <span>Set Your Current Location</span>
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Donor Status</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="is_donor" 
                    checked={profile.is_donor} 
                    onChange={(e) => setProfile({ ...profile, is_donor: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="is_donor">I am available as a blood donor</label>
                </div>
              </div>
              
              {profile.last_donation && (
                <div className="bg-muted p-4 rounded-md flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Last Donation</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(profile.last_donation).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Droplet className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Donation History</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View your donation history and upcoming appointments
                  </p>
                  <Button variant="outline" className="w-full" disabled={!profile.is_donor}>
                    View Donation History
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Map className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Location Settings</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your location settings to help nearby recipients
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleUpdateLocation}
                    disabled={isUpdatingLocation}
                  >
                    Update Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
