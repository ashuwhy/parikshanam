"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";

import { useAuth } from "@/context/AuthContext";

export function PostHogIdentify() {
  const { session, profile, loading } = useAuth();
  const lastId = useRef<string | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) return;
    if (loading) return;

    const userId = session?.user?.id;
    if (!userId) {
      lastId.current = null;
      return;
    }

    if (lastId.current === userId) return;
    lastId.current = userId;

    posthog.identify(userId, {
      email: session?.user?.email ?? undefined,
      name: profile?.full_name ?? undefined,
    });
  }, [loading, session?.user?.id, session?.user?.email, profile?.full_name]);

  return null;
}
