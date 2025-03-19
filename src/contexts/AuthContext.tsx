
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentSession, signIn, signOut, subscribeToAuthChanges, AuthSession } from '@/api/authService';

type AuthContextType = {
  user: AuthSession['user'];
  session: AuthSession['session'];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthSession['user']>(null);
  const [session, setSession] = useState<AuthSession['session']>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        setIsLoading(true);
        const session = await getCurrentSession();
        setUser(session.user);
        setSession(session.session);
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();

    const subscription = subscribeToAuthChanges((session) => {
      setUser(session.user);
      setSession(session.session);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
