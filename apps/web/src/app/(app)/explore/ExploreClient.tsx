"use client";

import { useMemo, useState } from "react";
import { Search, X, BookOpen } from "lucide-react";
import type { Course, OlympiadType } from "@/lib/types";
import { CourseCard } from "@/components/course/CourseCard";
import { Button } from "@/components/ui/Button";

interface Props {
  initialCourses: Course[];
  olympiadTypes: OlympiadType[];
}

export default function ExploreClient({ initialCourses, olympiadTypes }: Props) {
  const [query, setQuery] = useState("");
  const [olympiadFilter, setOlympiadFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = initialCourses;

    const q = query.trim().toLowerCase();
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
  }, [initialCourses, query, olympiadFilter]);

  const hasFilter = query.trim().length > 0 || olympiadFilter !== null;

  return (
    <div className="max-w-4xl mx-auto px-5 py-6">
      <h1
        className="text-2xl text-[#111827] mb-4"
        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
      >
        Explore Courses
      </h1>

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

      <p
        className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-4"
        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
      >
        {filtered.length} {filtered.length === 1 ? "course" : "courses"}{" "}
        {hasFilter ? "found" : "available"}
      </p>

      {filtered.length === 0 ? (
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
              : "Check back soon - new content is on the way"}
          </p>
          {hasFilter && (
            <Button
              variant="outlineAccent"
              type="button"
              className="mt-5"
              onClick={() => {
                setQuery("");
                setOlympiadFilter(null);
              }}
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
