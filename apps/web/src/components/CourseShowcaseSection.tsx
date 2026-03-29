import Link from "next/link";
import { BookOpen, Clock, Star } from "lucide-react";
import { ShowcaseCourseLink } from "@/components/marketing/ShowcaseCourseLink";
import { buttonProps } from "@/components/ui/buttonStyles";
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
    <ShowcaseCourseLink
      courseId={course.id}
      courseTitle={course.title}
      className="group flex flex-col rounded-[var(--radius-card)] overflow-hidden bg-white border border-[#E5E0D8] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_12px_40px_-18px_rgba(27,58,110,0.09)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-[#E8720C]/45 hover:shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_22px_52px_-14px_rgba(232,114,12,0.15)]"
    >
      {/* Thumbnail */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: 168,
          background: "linear-gradient(135deg, rgba(232,114,12,0.12) 0%, rgba(27,58,110,0.08) 100%)",
        }}
      >
        {course.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-95" />
        ) : (
          <BookOpen size={48} color="#E8720C" strokeWidth={1.5} className="opacity-95 group-hover:opacity-100 transition-opacity duration-200" />
        )}

        {label && (
          <div
            className="absolute top-3 left-3 px-3 py-1.5 rounded-[var(--radius-control-sm)] text-[11px] uppercase tracking-widest shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm"
            style={{ background: "rgba(27,58,110,0.95)", color: "white", fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            {label}
          </div>
        )}

        {course.is_featured && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-control-sm)] shadow-[0_2px_8px_rgba(232,114,12,0.25)]"
            style={{ background: "#E8720C", fontFamily: "var(--font-nunito-var)" }}
          >
            <Star size={11} color="white" fill="white" strokeWidth={0} />
            <span style={{ fontSize: 11, color: "white", fontWeight: 900 }}>Featured</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        {metaLine && (
          <p
            className="text-[11px] uppercase tracking-widest text-[#9CA3AF] mb-2"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            {metaLine}
          </p>
        )}

        <h3
          className="text-lg leading-snug text-[#111827] mb-3 group-hover:text-[#E8720C] transition-colors"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.01em" }}
        >
          {course.title}
        </h3>

        {course.description && (
          <p
            className="text-sm text-[#6B7280] leading-relaxed mb-5 flex-1 line-clamp-2"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            {course.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-5 mb-5 mt-auto">
          {course.total_lessons > 0 && (
            <div className="flex items-center gap-2">
              <BookOpen size={14} color="#9CA3AF" strokeWidth={2.5} />
              <span className="text-sm text-[#6B7280]" style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}>
                {course.total_lessons} lessons
              </span>
            </div>
          )}
          {course.duration_hours > 0 && (
            <div className="flex items-center gap-2">
              <Clock size={14} color="#9CA3AF" strokeWidth={2.5} />
              <span className="text-sm text-[#6B7280]" style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}>
                {course.duration_hours}h
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-[#E5E0D8] mb-5" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="text-2xl text-[#E8720C]"
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
                  className="px-2.5 py-1 rounded-full text-[11px] border"
                  style={{ background: "#F0FDF4", borderColor: "#BBF7D0", color: "#16A34A", fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                >
                  -{discountPercent(course.price, course.mrp!)}%
                </span>
              </>
            )}
          </div>
          <span
            className="text-sm text-[#E8720C] underline-offset-4 decoration-[#E8720C]/40 group-hover:underline group-hover:decoration-[#E8720C] transition-[text-decoration-color] duration-200"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            Enroll →
          </span>
        </div>
      </div>
    </ShowcaseCourseLink>
  );
}

export default async function CourseShowcaseSection() {
  const courses = await getFeaturedCourses();

  return (
    <section
      id="courses"
      className="relative overflow-hidden border-t border-[#E5E0D8]/90 bg-transparent py-24 md:py-32 px-6 sm:px-8"
    >
      {/* Doodles: single fixed layer in root layout only - wash tints over that. */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="absolute inset-0 bg-[#F9F7F5]/55" />
        <div
          className="absolute top-32 left-[5%] h-72 w-72 rounded-full opacity-[0.06] blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(232,114,12,0.35) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-20 right-[10%] h-96 w-96 rounded-full opacity-[0.05] blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(27,58,110,0.30) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 md:mb-14">
          <div>
            <p
              className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#C65F0A] mb-4"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              Courses
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-[2.75rem] md:leading-tight text-[#1B3A6E] text-balance max-w-xl"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.025em" }}
            >
              Courses built for champions
            </h2>
          </div>
          <Link
            href="/explore"
            className="shrink-0 text-base text-[#E8720C] hover:text-[#A04F08] hover:underline transition-colors"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            Browse all courses →
          </Link>
        </div>

        {/* Course cards */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 rounded-[var(--radius-card)] bg-white/60 backdrop-blur-sm border-2 border-dashed border-[#E5E0D8]">
            <p className="text-[#6B7280] text-lg mb-3" style={{ fontFamily: "var(--font-roboto-var)" }}>
              Courses coming soon.
            </p>
            <Link href="/login" className="text-[#E8720C] hover:underline text-base" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}>
              Sign up to be notified →
            </Link>
          </div>
        )}

        <div className="mt-12 md:mt-14 text-center">
          <Link href="/explore" {...buttonProps("primaryNavyLg", "gap-3")}>
            See all courses on the platform →
          </Link>
        </div>
      </div>
    </section>
  );
}
