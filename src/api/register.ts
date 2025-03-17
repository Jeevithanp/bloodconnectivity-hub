
import { supabase } from '../utils/supabaseClient';

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
          created_at: new Date(),
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
  } catch (error) {
    console.error('Unexpected error during registration:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred during registration' 
    };
  }
}
