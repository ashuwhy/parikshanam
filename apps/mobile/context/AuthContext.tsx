import type { Session } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

export type AuthContextType = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BYPASS_AUTH = __DEV__ && process.env.EXPO_PUBLIC_BYPASS_AUTH === 'true';

const MOCK_PROFILE: Profile = {
  id: 'mock-user-id',
  phone: '1234567890',
  full_name: 'Mock User',
  avatar_url: null,
  class_level_id: '10',
  onboarding_completed: true,
  created_at: new Date().toISOString(),
};

const MOCK_SESSION: Session = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: 'mock-user-id',
    email: 'mock@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as any,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (
    userId: string,
    userMeta?: Record<string, string | undefined>,
  ) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      setProfile(null);
      return;
    }

    // Backfill Google avatar / name into profiles row on first sign-in
    if (data && userMeta) {
      const googleAvatar = userMeta.avatar_url ?? userMeta.picture;
      const googleName   = userMeta.full_name ?? userMeta.name;
      const updates: Record<string, string> = {};
      if (!data.avatar_url && googleAvatar) updates.avatar_url = googleAvatar;
      if (!data.full_name  && googleName)   updates.full_name  = googleName;

      if (Object.keys(updates).length > 0) {
        const { data: updated } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId)
          .select('*')
          .single();
        setProfile((updated ?? data) as Profile | null);
        return;
      }
    }

    setProfile(data as Profile | null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const {
      data: { session: s },
    } = await supabase.auth.getSession();
    if (!s?.user) {
      setProfile(null);
      return;
    }
    await fetchProfile(s.user.id, s.user.user_metadata as Record<string, string | undefined>);
  }, [fetchProfile]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: NodeJS.Timeout;

    const init = async () => {
      if (BYPASS_AUTH) {
        console.log('Auth bypass enabled - providing mock user');
        setSession(MOCK_SESSION);
        setProfile(MOCK_PROFILE);
        setLoading(false);
        return;
      }

      try {
        // Add timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (!cancelled) {
            console.warn('Auth initialization timeout - continuing without auth');
            setLoading(false);
          }
        }, 5000); // 5 second timeout

        const {
          data: { session: initial },
        } = await supabase.auth.getSession();
        
        clearTimeout(timeoutId);
        
        if (cancelled) return;
        setSession(initial);
        if (initial?.user) {
          await fetchProfile(initial.user.id, initial.user.user_metadata as Record<string, string | undefined>);
        }
        if (!cancelled) setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (!cancelled) setLoading(false);
      }
    };

    void init();

    const {
      data: { subscription },
    } = BYPASS_AUTH
      ? { data: { subscription: { unsubscribe: () => {} } } }
      : supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
          if (nextSession?.user) {
            setLoading(true);
            void fetchProfile(
              nextSession.user.id,
              nextSession.user.user_metadata as Record<string, string | undefined>,
            ).finally(() => {
              if (!cancelled) setLoading(false);
            });
          } else {
            setProfile(null);
            if (!cancelled) setLoading(false);
          }
        });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      session,
      profile,
      loading,
      signOut,
      refreshProfile,
    }),
    [session, profile, loading, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
}
