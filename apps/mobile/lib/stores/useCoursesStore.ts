import { create } from "zustand";

import type { Course, OlympiadType } from "@/types";

export interface CourseFilters {
  searchText: string;
  olympiadTypeId: string | null;
}

interface CoursesState {
  allCourses: Course[];
  featuredCourse: Course | null;
  olympiadTypes: OlympiadType[];
  filters: CourseFilters;
  loading: boolean;
  error: Error | null;
  actions: {
    setAllCourses: (courses: Course[]) => void;
    setFeaturedCourse: (course: Course | null) => void;
    setOlympiadTypes: (types: OlympiadType[]) => void;
    setFilters: (filters: Partial<CourseFilters>) => void;
    setLoading: (v: boolean) => void;
    setError: (e: Error | null) => void;
  };
}

export const useCoursesStore = create<CoursesState>((set) => ({
  allCourses: [],
  featuredCourse: null,
  olympiadTypes: [],
  filters: { searchText: "", olympiadTypeId: null },
  loading: true,
  error: null,
  actions: {
    setAllCourses: (allCourses) => set({ allCourses }),
    setFeaturedCourse: (featuredCourse) => set({ featuredCourse }),
    setOlympiadTypes: (olympiadTypes) => set({ olympiadTypes }),
    setFilters: (partial) =>
      set((s) => ({ filters: { ...s.filters, ...partial } })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  },
}));
