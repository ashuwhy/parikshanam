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

  return {
    course,
    loading: !fromStore && q.isLoading,
    error: localError,
    refresh: q.refetch,
  };
}

export function useSyllabus(courseId: string | undefined) {
  const q = useQuery({
    queryKey: ["syllabus", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select(`
          id, title, order_index,
          lessons ( id, title, duration_minutes, is_preview, order_index ),
          quizzes ( id, title, order_index )
        `)
        .eq("course_id", courseId!)
        .order("order_index", { ascending: true });
        
      if (error) throw error;
      
      // Sort lessons and quizzes within modules
      return data?.map((mod: any) => ({
        ...mod,
        lessons: mod.lessons?.sort((a: any, b: any) => a.order_index - b.order_index) || [],
        quizzes: mod.quizzes?.sort((a: any, b: any) => a.order_index - b.order_index) || [],
      })) ?? [];
    },
  });

  return {
    modules: q.data ?? [],
    loading: q.isLoading,
    error: q.error,
    refresh: q.refetch,
  };
}

export function useLessonById(lessonId: string | undefined) {
  const q = useQuery({
    queryKey: ["lesson", lessonId],
    enabled: !!lessonId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  return {
    lesson: q.data,
    loading: q.isLoading,
    error: q.error,
  };
}
