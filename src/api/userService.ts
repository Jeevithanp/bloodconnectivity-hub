
import { supabase } from '@/integrations/supabase/client';

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('user-operations', {
      body: { 
        action: 'getProfile',
        userId
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, profileData: any) {
  try {
    const { data, error } = await supabase.functions.invoke('user-operations', {
      body: { 
        action: 'updateProfile',
        userId,
        data: profileData
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function getDonors(filters: { bloodType?: string, maxDistance?: number }) {
  try {
    const { data, error } = await supabase.functions.invoke('user-operations', {
      body: { 
        action: 'getDonors',
        data: filters
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting donors:', error);
    throw error;
  }
}

export async function updateDonorStatus(userId: string, isDonor: boolean) {
  try {
    const { data, error } = await supabase.functions.invoke('user-operations', {
      body: { 
        action: 'updateDonorStatus',
        userId,
        data: { isDonor }
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating donor status:', error);
    throw error;
  }
}
