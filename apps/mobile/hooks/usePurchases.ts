import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import { usePurchasesStore } from "@/lib/stores/usePurchasesStore";

export function useHasPurchased(courseId: string | undefined) {
  const { session } = useAuth();
  const purchases = usePurchasesStore((s) => s.purchases);
  const loading = usePurchasesStore((s) => s.loading);

  // Derived — no useState+useEffect needed, avoids an extra render cycle
  const purchased = useMemo(
    () =>
      !!session?.user?.id &&
      !!courseId &&
      purchases.some((p) => p.course_id === courseId && p.status === "completed"),
    [session?.user?.id, courseId, purchases],
  );

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["purchases", session?.user?.id] });
  }, [session?.user?.id]);

  return { purchased, loading, refresh };
}

export function useMyPurchases() {
  const { session } = useAuth();
  const purchases = usePurchasesStore((s) => s.purchases);
  const loading = usePurchasesStore((s) => s.loading);
  const error = usePurchasesStore((s) => s.error);

  const total = useMemo(() => purchases.length, [purchases]);

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["purchases", session?.user?.id] });
  }, [session?.user?.id]);

  return { purchases, loading, error, refresh, total };
}

export function useUserProgress(courseId?: string) {
  const { session } = useAuth();

  // courseId intentionally NOT in query key — we always fetch all progress for
  // the user so every caller shares the same cache entry regardless of screen.
  const q = useQuery({
    queryKey: ["progress", session?.user?.id],
    enabled: !!session?.user?.id,
    staleTime: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", session!.user.id);
      if (error) throw error;
      return data;
    },
  });

  // Filter client-side when a courseId is given — no extra network call
  const progress = useMemo(() => {
    const all = q.data ?? [];
    return courseId
      ? all.filter((p) => p.course_id === courseId)
      : all;
  }, [q.data, courseId]);

  return {
    progress,
    loading: q.isLoading,
    error: q.error,
    refresh: q.refetch,
  };
}
