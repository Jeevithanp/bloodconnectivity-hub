
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
      
      // Check if user_profiles table exists
      const { error: tableCheckError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
        
      if (tableCheckError && tableCheckError.message.includes('relation "user_profiles" does not exist')) {
        console.log('Creating user in profiles table instead');
        // Fallback to using profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            phone: userData.phoneNumber,
            blood_type: userData.bloodType,
            account_type: userData.accountType,
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { 
            success: false, 
            error: profileError.message 
          };
        }
      } else {
        // Use the user_profiles table
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            phone_number: userData.phoneNumber,
            blood_type: userData.bloodType,
            account_type: userData.accountType,
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { 
            success: false, 
            error: profileError.message 
          };
        }
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
