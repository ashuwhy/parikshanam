"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { COURSE_LIST_SELECT } from "@/lib/supabase/selects";
import type { Course, OlympiadType } from "@/lib/types";
import { CourseCard } from "@/components/course/CourseCard";

export default function ExplorePage() {
  const supabase = useMemo(() => createClient(), []);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [olympiadFilter, setOlympiadFilter] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["courses", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(COURSE_LIST_SELECT)
        .eq("is_active", true)
        .order("is_featured", { ascending: false });
      if (error) throw error;
      return data as Course[];
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
        <Search size={16} color="#9CA3AF" strokeWidth={2.5} />
        <input
          type="text"
          placeholder="Search courses, topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none bg-transparent"
          style={{ fontFamily: "var(--font-roboto-var)" }}
        />
        {query.length > 0 && (
          <button onClick={() => setQuery("")}>
            <X size={15} color="#9CA3AF" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Filter chips */}
      {olympiadTypes.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-5">
          <button
            onClick={() => setOlympiadFilter(null)}
            className={`px-5 py-2 rounded-full border text-xs transition-all ${
              olympiadFilter === null
                ? "bg-[#E8720C] border-[#A04F08] text-white"
                : "bg-white border-[#E5E0D8] text-[#6B7280] hover:border-[#E8720C]"
            }`}
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            All
          </button>
          {olympiadTypes.map((o) => (
            <button
              key={o.id}
              onClick={() => setOlympiadFilter(olympiadFilter === o.id ? null : o.id)}
              className={`px-5 py-2 rounded-full border text-xs transition-all ${
                olympiadFilter === o.id
                  ? "bg-[#E8720C] border-[#A04F08] text-white"
                  : "bg-white border-[#E5E0D8] text-[#6B7280] hover:border-[#E8720C]"
              }`}
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {!isLoading && (
        <p
          className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-4"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
        >
          {filtered.length} {filtered.length === 1 ? "course" : "courses"}
          {hasFilter ? " found" : " available"}
        </p>
      )}

      {/* Course grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl bg-white border border-[#E5E0D8] h-64 animate-pulse" />
          ))}
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
            <button
              onClick={() => { setQuery(""); setOlympiadFilter(null); }}
              className="mt-5 px-6 py-3 rounded-2xl border-2 border-[#E8720C] text-sm text-[#E8720C] hover:bg-[#E8720C]/5 transition-colors"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
            >
              Clear filters
            </button>
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
