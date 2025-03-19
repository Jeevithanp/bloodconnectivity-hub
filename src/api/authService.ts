
import { supabase } from '@/integrations/supabase/client';

export type AuthSession = {
  user: {
    id: string;
    email: string | null;
  } | null;
  session: any | null;
};

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getCurrentSession(): Promise<AuthSession> {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return {
      user: data.session?.user ? {
        id: data.session.user.id,
        email: data.session.user.email || null
      } : null,
      session: data.session || null,
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return { user: null, session: null };
  }
}

export function subscribeToAuthChanges(callback: (session: AuthSession) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback({
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email || null
      } : null,
      session: session || null,
    });
  });
  
  return data.subscription;
}
