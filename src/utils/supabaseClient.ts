
import { createClient } from '@supabase/supabase-js';

// This should be replaced with your actual Supabase URL and anon key after connecting
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
