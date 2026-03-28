import Link from "next/link";
import { BookOpen, Clock, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, classRange, discountPercent, olympiadLabel } from "@/lib/courseUtils";
import type { Course } from "@/lib/types";

async function getFeaturedCourses(): Promise<Course[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*, olympiad_type:olympiad_types(*), min_class:class_levels!courses_min_class_id_fkey(*), max_class:class_levels!courses_max_class_id_fkey(*)")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(3);
  return (data as Course[]) ?? [];
}

function CourseCard({ course }: { course: Course }) {
  const label = olympiadLabel(course);
  const cls = classRange(course);
  const metaLine = [label, cls].filter(Boolean).join(" • ");
  const hasDiscount = course.mrp != null && course.mrp > course.price;

  return (
    <Link
      href="/login"
      className="group flex flex-col rounded-[1.5rem] overflow-hidden bg-white border border-[#E5E0D8] hover:border-[#E8720C] hover:-translate-y-1 transition-all"
    >
      {/* Thumbnail */}
      <div
        className="relative flex items-center justify-center"
        style={{
          height: 148,
          background: "linear-gradient(135deg, rgba(232,114,12,0.10) 0%, rgba(27,58,110,0.06) 100%)",
        }}
      >
        {course.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <BookOpen size={40} color="#E8720C" strokeWidth={1.5} />
        )}

        {label && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] uppercase tracking-widest"
            style={{ background: "#1B3A6E", color: "white", fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            {label}
          </div>
        )}

        {course.is_featured && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg"
            style={{ background: "#E8720C", fontFamily: "var(--font-nunito-var)" }}
          >
            <Star size={9} color="white" fill="white" strokeWidth={0} />
            <span style={{ fontSize: 10, color: "white", fontWeight: 800 }}>Featured</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {metaLine && (
          <p
            className="text-[11px] uppercase tracking-widest text-[#9CA3AF] mb-1.5"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
          >
            {metaLine}
          </p>
        )}

        <h3
          className="text-base leading-snug text-[#111827] mb-2"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
        >
          {course.title}
        </h3>

        {course.description && (
          <p
            className="text-sm text-[#6B7280] leading-relaxed mb-4 flex-1 line-clamp-2"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            {course.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 mt-auto">
          {course.total_lessons > 0 && (
            <div className="flex items-center gap-1.5">
              <BookOpen size={12} color="#9CA3AF" strokeWidth={2.5} />
              <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {course.total_lessons} lessons
              </span>
            </div>
          )}
          {course.duration_hours > 0 && (
            <div className="flex items-center gap-1.5">
              <Clock size={12} color="#9CA3AF" strokeWidth={2.5} />
              <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {course.duration_hours}h
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-[#F3F4F6] mb-4" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-xl text-[#E8720C]"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              {formatPrice(course.price)}
            </span>
            {hasDiscount && (
              <>
                <span
                  className="text-sm text-[#9CA3AF] line-through"
                  style={{ fontFamily: "var(--font-roboto-var)" }}
                >
                  {formatPrice(course.mrp!)}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[11px]"
                  style={{ background: "#F0FDF4", color: "#16A34A", fontFamily: "var(--font-nunito-var)", fontWeight: 900, border: "1px solid #BBF7D0" }}
                >
                  -{discountPercent(course.price, course.mrp!)}%
                </span>
              </>
            )}
          </div>
          <span
            className="text-[11px] text-[#E8720C] group-hover:underline"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            Enroll now →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function CourseShowcaseSection() {
  const courses = await getFeaturedCourses();

  return (
    <section id="courses" className="py-24 px-6 bg-[#F9F7F5] border-t border-[#E5E0D8]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p
              className="text-xs uppercase tracking-widest text-[#E8720C] mb-3"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
            >
              Courses
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#1B3A6E]"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              Courses built for champions
            </h2>
          </div>
          <Link
            href="/explore"
            className="shrink-0 text-sm text-[#E8720C] hover:underline"
            style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 600 }}
          >
            Browse all courses →
          </Link>
        </div>

        {/* Course cards */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
              Courses coming soon.{" "}
              <Link href="/login" className="text-[#E8720C] hover:underline">
                Sign up to be notified →
              </Link>
            </p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#1B3A6E] text-white text-base hover:bg-[#152d57] transition-colors"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            See all courses on the platform →
          </Link>
        </div>
      </div>
    </section>
  );
}
