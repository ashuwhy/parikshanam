"use client";

import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

export type AuthContextType = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  /** Ends session, clears cookies (client + server), then full-page navigates to `redirectTo` (default "/"). */
  signOut: (redirectTo?: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabaseBrowserClient();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(
    async (userId: string, userMeta?: Record<string, string | undefined>) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        setProfile(null);
        return;
      }

      // Backfill Google avatar / name on first sign-in
      if (data && userMeta) {
        const googleAvatar = userMeta.avatar_url ?? userMeta.picture;
        const googleName = userMeta.full_name ?? userMeta.name;
        const updates: Record<string, string> = {};
        if (!data.avatar_url && googleAvatar) updates.avatar_url = googleAvatar;
        if (!data.full_name && googleName) updates.full_name = googleName;

        if (Object.keys(updates).length > 0) {
          const { data: updated } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", userId)
            .select("*")
            .single();
          setProfile((updated ?? data) as Profile | null);
          return;
        }
      }

      setProfile(data as Profile | null);
    },
    [supabase],
  );

  const refreshProfile = useCallback(async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s?.user) {
      setProfile(null);
      return;
    }
    await fetchProfile(s.user.id, s.user.user_metadata as Record<string, string | undefined>);
  }, [supabase, fetchProfile]);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (cancelled) return;
      setSession(s);
      if (s?.user) {
        void fetchProfile(
          s.user.id,
          s.user.user_metadata as Record<string, string | undefined>,
        );
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (cancelled) return;
        setSession(s);
        if (s?.user) {
          await fetchProfile(
            s.user.id,
            s.user.user_metadata as Record<string, string | undefined>,
          );
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signOut = useCallback(async (redirectTo = "/") => {
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) {
      console.error("signOut:", error.message);
    }

    try {
      await fetch(`${window.location.origin}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch {
      /* network — still clear local state below */
    }

    setSession(null);
    setProfile(null);
    window.location.assign(redirectTo);
  }, [supabase]);

  const value = useMemo(
    () => ({ session, profile, loading, signOut, refreshProfile }),
    [session, profile, loading, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
