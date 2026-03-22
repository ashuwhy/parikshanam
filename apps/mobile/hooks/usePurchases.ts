import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import { usePurchasesStore } from "@/lib/stores/usePurchasesStore";

export function useHasPurchased(courseId: string | undefined) {
  const { session } = useAuth();
  const purchases = usePurchasesStore((s) => s.purchases);
  const loading = usePurchasesStore((s) => s.loading);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (!session?.user?.id || !courseId) {
      setPurchased(false);
      return;
    }
    const hit = purchases.some(
      (p) => p.course_id === courseId && p.status === "completed",
    );
    setPurchased(hit);
  }, [session?.user?.id, courseId, purchases]);

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
