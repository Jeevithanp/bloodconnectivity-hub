
import { supabase } from '@/integrations/supabase/client';

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bloodType: string;
  accountType: string;
  password: string;
}

export async function registerUser(userData: UserRegistrationData) {
  try {
    console.log('Starting user registration:', userData.email);
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) {
      console.error('Authentication error:', authError);
      return { 
        success: false, 
        error: authError.message 
      };
    }

    // If auth user was created successfully, store additional user details
    if (authData.user) {
      console.log('Auth user created successfully:', authData.user.id);
      
      // Add user data to the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: `${userData.firstName} ${userData.lastName}`,
          blood_type: userData.bloodType,
          // Set required fields with default values
          address: 'Not provided', // Required field in your schema
          birth_date: new Date().toISOString().split('T')[0], // Required field in your schema
          is_donor: userData.accountType === 'donor' ? true : false,
          created_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return { 
          success: false, 
          error: profileError.message 
        };
      }

      return { 
        success: true, 
        userId: authData.user.id 
      };
    }
    
    return {
      success: false,
      error: "Failed to create user account"
    };
  } catch (error) {
    console.error('Unexpected error during registration:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred during registration' 
    };
  }
}
