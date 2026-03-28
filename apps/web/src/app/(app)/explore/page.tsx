"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, X, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { COURSE_LIST_SELECT } from "@/lib/supabase/selects";
import type { Course, OlympiadType } from "@/lib/types";
import { CourseCard } from "@/components/course/CourseCard";
import { Button } from "@/components/ui/Button";

export default function ExplorePage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [olympiadFilter, setOlympiadFilter] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const {
    data: courses = [],
    isPending: coursesPending,
    isError: coursesError,
    error: coursesErrorDetail,
    refetch: refetchCourses,
  } = useQuery<Course[]>({
    queryKey: ["courses", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(COURSE_LIST_SELECT)
        .eq("is_active", true)
        .order("is_featured", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Course[];
    },
    staleTime: 5 * 60_000,
  });

  const { data: olympiadTypes = [] } = useQuery<OlympiadType[]>({
    queryKey: ["olympiad_types"],
    queryFn: async () => {
      const { data } = await supabase.from("olympiad_types").select("*").order("id");
      return (data as OlympiadType[]) ?? [];
    },
    staleTime: 60 * 60_000,
  });

  const filtered = useMemo(() => {
    let list = courses;
    const q = debounced.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.subtitle?.toLowerCase().includes(q) ?? false),
      );
    }
    if (olympiadFilter) {
      list = list.filter((c) => c.olympiad_type_id === olympiadFilter);
    }
    return list;
  }, [courses, debounced, olympiadFilter]);

  const hasFilter = debounced.trim().length > 0 || olympiadFilter !== null;

  const coursesErrMessage =
    coursesErrorDetail instanceof Error
      ? coursesErrorDetail.message
      : typeof coursesErrorDetail === "object" && coursesErrorDetail !== null && "message" in coursesErrorDetail
        ? String((coursesErrorDetail as { message: unknown }).message)
        : "Something went wrong";

  return (
    <div className="max-w-4xl mx-auto px-5 py-6">
      {/* Header */}
      <h1
        className="text-2xl text-[#111827] mb-4"
        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
      >
        Explore Courses
      </h1>

      {/* Search bar */}
      <div className="flex items-center gap-3 rounded-2xl border-2 border-[#E5E0D8] bg-white px-4 h-12 mb-4 focus-within:border-[#E8720C] transition-colors">
        <Search size={16} color="#9CA3AF" strokeWidth={2.5} className="shrink-0" aria-hidden />
        <input
          type="text"
          placeholder="Search courses, topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 h-full border-0 bg-transparent text-sm text-[#111827] placeholder-[#9CA3AF] shadow-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none"
          style={{ fontFamily: "var(--font-roboto-var)" }}
        />
        {query.length > 0 && (
          <Button variant="iconPlain" type="button" onClick={() => setQuery("")} aria-label="Clear search">
            <X size={15} color="#9CA3AF" strokeWidth={2.5} />
          </Button>
        )}
      </div>

      {/* Filter chips */}
      {olympiadTypes.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-5">
          <Button
            variant={olympiadFilter === null ? "filterOn" : "filterOff"}
            type="button"
            onClick={() => setOlympiadFilter(null)}
          >
            All
          </Button>
          {olympiadTypes.map((o) => (
            <Button
              key={o.id}
              variant={olympiadFilter === o.id ? "filterOn" : "filterOff"}
              type="button"
              onClick={() => setOlympiadFilter(olympiadFilter === o.id ? null : o.id)}
            >
              {o.label}
            </Button>
          ))}
        </div>
      )}

      {/* Results count */}
      {!coursesPending && !coursesError && (
        <p
          className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-4"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
        >
          {filtered.length} {filtered.length === 1 ? "course" : "courses"}
          {hasFilter ? " found" : " available"}
        </p>
      )}

      {/* Course grid */}
      {coursesPending ? (
        <div>
          <p
            className="text-sm text-[#6B7280] mb-3"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Loading courses…
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-white border border-[#E5E0D8] h-64 animate-pulse" />
            ))}
          </div>
        </div>
      ) : coursesError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
          <p
            className="text-base text-red-800 mb-1"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            Couldn&apos;t load courses
          </p>
          <p className="text-sm text-red-700/90 mb-4" style={{ fontFamily: "var(--font-roboto-var)" }}>
            {coursesErrMessage}
          </p>
          <p className="text-xs text-red-800/70 mb-4" style={{ fontFamily: "var(--font-roboto-var)" }}>
            Check that <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are set and your
            network can reach Supabase.
          </p>
          <Button variant="outlineAccent" type="button" onClick={() => void refetchCourses()}>
            Try again
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 px-6 text-center">
          {hasFilter ? (
            <Search size={48} color="#D1D5DB" strokeWidth={1.5} className="mb-4" />
          ) : (
            <BookOpen size={48} color="#D1D5DB" strokeWidth={1.5} className="mb-4" />
          )}
          <p
            className="text-xl text-[#111827]"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            {hasFilter ? "No courses found" : "No courses yet"}
          </p>
          <p className="text-sm text-[#6B7280] mt-2" style={{ fontFamily: "var(--font-roboto-var)" }}>
            {hasFilter
              ? "Try a different search or clear the filters"
              : "Check back soon — new content is on the way"}
          </p>
          {hasFilter && (
            <Button
              variant="outlineAccent"
              type="button"
              className="mt-5"
              onClick={() => { setQuery(""); setOlympiadFilter(null); }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
