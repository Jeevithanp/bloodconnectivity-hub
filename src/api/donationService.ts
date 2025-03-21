
import { supabase } from '@/integrations/supabase/client';
import { DonationFormData } from '@/types/profile';

export async function registerDonation(userId: string, donationData: DonationFormData) {
  try {
    const { data, error } = await supabase.functions.invoke('user-operations', {
      body: { 
        action: 'registerDonation',
        userId,
        data: donationData
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error registering donation:', error);
    throw error;
  }
}

export async function getDonationHistory(userId: string) {
  try {
    // In a real app, we would fetch from a donations table
    // For now, just get the last donation from the profile
    const { data, error } = await supabase.functions.invoke('user-operations', {
      body: { 
        action: 'getProfile',
        userId
      }
    });
    
    if (error) throw error;
    
    // Create a mock donation history based on last_donation
    if (data && data.data && data.data.last_donation) {
      return {
        data: [
          {
            id: '1',
            hospitalName: 'General Hospital',
            donationDate: new Date(data.data.last_donation).toISOString().split('T')[0],
            donationTime: '09:00',
            status: 'completed'
          }
        ]
      };
    }
    
    return { data: [] };
  } catch (error) {
    console.error('Error getting donation history:', error);
    throw error;
  }
}
