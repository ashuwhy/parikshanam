import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

import { queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import { COURSE_LIST_SELECT } from "@/lib/supabase/selects";
import { useCoursesStore } from "@/lib/stores/useCoursesStore";
import type { Course } from "@/types";

export function useFeaturedCourse() {
  const featuredCourse = useCoursesStore((s) => s.featuredCourse);
  const loading = useCoursesStore((s) => s.loading);
  const error = useCoursesStore((s) => s.error);

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["courses", "active"] });
  }, []);

  return {
    course: featuredCourse,
    loading,
    error,
    refresh,
  };
}

export function useCourseById(id: string | undefined) {
  const fromStore = useCoursesStore((s) =>
    id ? s.allCourses.find((c) => c.id === id) : undefined,
  );
  const [localError, setLocalError] = useState<Error | null>(null);

  const q = useQuery({
    queryKey: ["course", id],
    enabled: !!id && !fromStore,
    queryFn: async () => {
      const { data, error: qError } = await supabase
        .from("courses")
        .select(COURSE_LIST_SELECT)
        .eq("id", id!)
        .eq("is_active", true)
        .maybeSingle();
      if (qError) throw qError;
      return data as Course | null;
    },
  });

  useEffect(() => {
    if (q.error) setLocalError(q.error as Error);
    else setLocalError(null);
  }, [q.error]);

  const course = useMemo(() => fromStore ?? q.data ?? null, [fromStore, q.data]);

  const refresh = useCallback(async () => {
    await q.refetch();
  }, [q]);

  return {
    course,
    loading: !fromStore && q.isLoading,
    error: localError,
    refresh,
  };
}
