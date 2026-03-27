import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

function matchesClass(course: Course, classLevelId: string | null | undefined): boolean {
  if (!classLevelId) return true;
  const n = parseInt(classLevelId, 10);
  if (isNaN(n)) return true;
  const min = course.min_class_id ? parseInt(course.min_class_id, 10) : null;
  const max = course.max_class_id ? parseInt(course.max_class_id, 10) : null;
  if (min !== null && n < min) return false;
  if (max !== null && n > max) return false;
  return true;
}

import { useAuth } from "@/hooks/useAuth";
import { prefetchStorageUrl } from "@/hooks/useStorageUrl";
import { supabase } from "@/lib/supabase";
import { COURSE_LIST_SELECT, PURCHASE_LIST_SELECT } from "@/lib/supabase/selects";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useCoursesStore } from "@/lib/stores/useCoursesStore";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import { usePurchasesStore } from "@/lib/stores/usePurchasesStore";
import type { ClassLevel, Course, OlympiadType, Purchase } from "@/types";

/**
 * Fetches catalog + courses + purchases from Supabase and mirrors into Zustand.
 * Mount once under QueryClientProvider + AuthProvider.
 */
export function useRemoteData() {
  const { session, profile, loading: authLoading } = useAuth();
  const userId = session?.user?.id;

  const classLevelsQuery = useQuery({
    queryKey: ["classLevels"],
    staleTime: Infinity, // class levels never change at runtime
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_levels")
        .select("*")
        .order("id");
      if (error) throw error;
      return (data ?? []) as ClassLevel[];
    },
  });

  const olympiadTypesQuery = useQuery({
    queryKey: ["olympiadTypes"],
    staleTime: Infinity, // olympiad types never change at runtime
    queryFn: async () => {
      const { data, error } = await supabase.from("olympiad_types").select("*").order("id");
      if (error) throw error;
      return (data ?? []) as OlympiadType[];
    },
  });

  const coursesQuery = useQuery({
    queryKey: ["courses", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(COURSE_LIST_SELECT)
        .eq("is_active", true)
        .order("title");
      if (error) throw error;
      return (data ?? []) as Course[];
    },
  });

  const purchasesQuery = useQuery({
    queryKey: ["purchases", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select(PURCHASE_LIST_SELECT)
        .eq("user_id", userId!)
        .eq("status", "completed")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Purchase[];
    },
  });

  useEffect(() => {
    useAuthStore.getState().actions.setLoading(authLoading);
  }, [authLoading]);

  useEffect(() => {
    const levels = classLevelsQuery.data;
    if (levels) {
      useProfileStore.getState().actions.setClassLevels(levels);
      useProfileStore.getState().actions.setLoading(classLevelsQuery.isLoading);
    }
  }, [classLevelsQuery.data, classLevelsQuery.isLoading]);

  useEffect(() => {
    if (olympiadTypesQuery.data) {
      useCoursesStore.getState().actions.setOlympiadTypes(olympiadTypesQuery.data);
    }
  }, [olympiadTypesQuery.data]);

  useEffect(() => {
    const { actions } = useCoursesStore.getState();
    if (coursesQuery.isLoading) {
      actions.setLoading(true);
    }
    if (coursesQuery.data) {
      const list = coursesQuery.data;
      const classId = profile?.class_level_id ?? null;
      const forClass = list.filter((c) => matchesClass(c, classId));
      actions.setAllCourses(list);
      actions.setFeaturedCourse(forClass.find((c) => c.is_featured) ?? forClass[0] ?? null);
      actions.setLoading(false);
      actions.setError(null);
      // Warm signed-URL cache for all intro videos in the background
      list.forEach((c) => prefetchStorageUrl(c.intro_video_path));
    }
    if (coursesQuery.isError) {
      actions.setLoading(false);
      actions.setError(coursesQuery.error as Error);
    }
  }, [coursesQuery.data, coursesQuery.isLoading, coursesQuery.isError, coursesQuery.error, profile?.class_level_id]);

  useEffect(() => {
    const { actions } = usePurchasesStore.getState();
    if (!userId) {
      actions.setPurchases([]);
      actions.setLoading(false);
      actions.setError(null);
      return;
    }
    if (purchasesQuery.isLoading) {
      actions.setLoading(true);
    }
    if (purchasesQuery.data) {
      actions.setPurchases(purchasesQuery.data);
      actions.setLoading(false);
      actions.setError(null);
    }
    if (purchasesQuery.isError) {
      actions.setLoading(false);
      actions.setError(purchasesQuery.error as Error);
    }
  }, [
    userId,
    purchasesQuery.data,
    purchasesQuery.isLoading,
    purchasesQuery.isError,
    purchasesQuery.error,
  ]);

  useEffect(() => {
    useProfileStore.getState().actions.setProfile(profile ?? null);
    useAuthStore.getState().actions.setOnboardingDone(!!profile?.onboarding_completed);
  }, [profile?.id, profile?.class_level_id, profile?.onboarding_completed, profile?.full_name]);

  useEffect(() => {
    const levels = useProfileStore.getState().classLevels;
    const pid = profile?.class_level_id;
    if (!pid || levels.length === 0) {
      useProfileStore.getState().actions.setSelectedClass(null);
      return;
    }
    const cl = levels.find((c) => c.id === pid) ?? null;
    useProfileStore.getState().actions.setSelectedClass(cl);
  }, [profile?.class_level_id, classLevelsQuery.data]);
}
