
import { supabase } from '@/integrations/supabase/client';

export async function updateUserLocation(userId: string, latitude: number, longitude: number) {
  try {
    const { data, error } = await supabase.functions.invoke('user-operations', {
      body: { 
        action: 'updateLocation',
        userId,
        data: { latitude, longitude }
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user location:', error);
    throw error;
  }
}

export async function getNearbyDonors(bloodType: string, maxDistance: number, latitude: number, longitude: number) {
  try {
    const { data, error } = await supabase.functions.invoke('user-operations', {
      body: { 
        action: 'getNearbyDonors',
        data: { 
          bloodType, 
          maxDistance,
          latitude,
          longitude
        }
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting nearby donors:', error);
    throw error;
  }
}

export async function sendEmergencyRequest(requestData: {
  bloodType: string;
  hospital: string;
  urgency: string;
  units: number;
  details: string;
  latitude: number;
  longitude: number;
}) {
  try {
    const { data, error } = await supabase.functions.invoke('user-operations', {
      body: { 
        action: 'createEmergencyRequest',
        data: requestData
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending emergency request:', error);
    throw error;
  }
}

export async function getDonationCenters(latitude: number, longitude: number, maxDistance: number = 20) {
  try {
    const { data, error } = await supabase.functions.invoke('user-operations', {
      body: { 
        action: 'getDonationCenters',
        data: { 
          latitude,
          longitude,
          maxDistance
        }
      }
    });
    
    if (error) throw error;
    return { data: data || [] };
  } catch (error) {
    console.error('Error getting donation centers:', error);
    throw error;
  }
}

export async function trackDonor(donorId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('user-operations', {
      body: { 
        action: 'trackDonor',
        donorId
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking donor:', error);
    throw error;
  }
}

// New function to start donation process
export async function initiateDonationProcess(donorId: string, requestDetails: {
  bloodType: string;
  units: number;
  location: string;
  time: string;
  message?: string;
}) {
  try {
    const { data, error } = await supabase.functions.invoke('user-operations', {
      body: {
        action: 'initiateDonation',
        donorId,
        data: requestDetails
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error initiating donation process:', error);
    throw error;
  }
}
