import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle, Clock, Star } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { COURSE_LIST_SELECT } from "@/lib/supabase/selects";
import type { Course } from "@/lib/types";
import { formatPrice, classRange, discountPercent } from "@/lib/courseUtils";
import { SyllabusAccordion } from "@/components/course/SyllabusAccordion";
import { PurchaseButton } from "@/components/course/PurchaseButton";
import { VideoPlayer } from "@/components/lesson/VideoPlayer";
import { getSiteUrl } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select(
      "title, description, total_lessons, duration_hours, olympiad_type:olympiad_types(label)",
    )
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (!course) {
    return { title: "Course" };
  }

  const site = getSiteUrl();
  const olympiadLabel =
    course.olympiad_type &&
    typeof course.olympiad_type === "object" &&
    "label" in course.olympiad_type
      ? String((course.olympiad_type as { label: string }).label)
      : null;

  const title = course.title;
  const descFromDb = course.description?.trim();
  const stats =
    (course.total_lessons ?? 0) > 0 || (course.duration_hours ?? 0) > 0
      ? [
          (course.total_lessons ?? 0) > 0 ? `${course.total_lessons} lessons` : null,
          (course.duration_hours ?? 0) > 0 ? `${course.duration_hours}h content` : null,
        ]
          .filter(Boolean)
          .join(" • ")
      : null;

  const description =
    (descFromDb && descFromDb.length > 0 ? descFromDb.slice(0, 160) : null) ??
    [
      olympiadLabel ? `${olympiadLabel} on Parikshanam - ${course.title}.` : `${course.title} on Parikshanam.`,
      stats,
      "Video lessons, quizzes, and progress tracking for Grades 6–10.",
    ]
      .filter(Boolean)
      .join(" ");

  const ogImagePath = "/og/parikshanam-share.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${site}/course/${id}`,
      type: "website",
      images: [{ url: ogImagePath, alt: `${title} - Parikshanam` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImagePath],
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [courseRes, purchaseRes, modulesRes, progressRes] = await Promise.all([
    supabase.from("courses").select(COURSE_LIST_SELECT).eq("id", id).eq("is_active", true).maybeSingle(),
    user
      ? supabase
          .from("purchases")
          .select("id")
          .eq("user_id", user.id)
          .eq("course_id", id)
          .eq("status", "completed")
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("modules")
      .select(
        `id, title, order_index, lessons(id, title, duration_minutes, is_preview, order_index), quizzes(id, title, order_index)`,
      )
      .eq("course_id", id)
      .order("order_index"),
    user
      ? supabase
          .from("user_progress")
          .select("lesson_id, quiz_id")
          .eq("user_id", user.id)
          .eq("course_id", id)
      : Promise.resolve({ data: [] as { lesson_id: string | null; quiz_id: string | null }[] }),
  ]);

  const course = courseRes.data as Course | null;
  if (!course) notFound();

  const purchased = !!purchaseRes.data;
  const modules = (modulesRes.data ?? []).map((m: any) => ({
    ...m,
    lessons: (m.lessons ?? []).sort((a: any, b: any) => a.order_index - b.order_index),
    quizzes: (m.quizzes ?? []).sort((a: any, b: any) => a.order_index - b.order_index),
  }));
  const completedIds = new Set([
    ...(progressRes.data ?? []).map((p) => p.lesson_id).filter(Boolean),
    ...(progressRes.data ?? []).map((p) => p.quiz_id).filter(Boolean),
  ]);

  const olympiad = course.olympiad_type?.label ?? null;
  const cls = classRange(course);
  const metaLine = [olympiad, cls].filter(Boolean).join(" • ");
  const hasDiscount = course.mrp != null && course.mrp > course.price;

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      {/* Back button */}
      <Link
        href={user ? "/explore" : "/"}
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1B3A6E] mb-4 transition-colors"
        style={{ fontFamily: "var(--font-roboto-var)" }}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        {user ? "Back to Explore" : "Back to home"}
      </Link>

      {/* Hero */}
      {course.intro_video_path ? (
        <div className="relative z-0 mb-8 w-full max-h-[min(56vh,520px)] aspect-video rounded-2xl overflow-hidden border-2 border-[#E5E0D8] bg-[#0f172a] shadow-[0_16px_48px_-14px_rgba(27,58,110,0.22)]">
          <VideoPlayer
            videoId={course.intro_video_path}
            title={`${course.title} Intro`}
          />
          {olympiad && (
            <div
              className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs uppercase tracking-widest z-40 pointer-events-none"
              style={{ background: "#1B3A6E", color: "white", fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
            >
              {olympiad}
            </div>
          )}
          {purchased ? (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 z-40 pointer-events-none">
              <CheckCircle size={11} color="#22C55E" strokeWidth={2.5} />
              <span style={{ fontSize: 11, color: "#22C55E", fontWeight: 700, fontFamily: "var(--font-nunito-var)" }}>Enrolled</span>
            </div>
          ) : course.is_featured ? (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-xl z-40 pointer-events-none" style={{ background: "#E8720C" }}>
              <Star size={10} color="white" fill="white" strokeWidth={0} />
              <span style={{ fontSize: 11, color: "white", fontWeight: 800, fontFamily: "var(--font-nunito-var)" }}>Featured</span>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className="relative rounded-2xl overflow-hidden mb-6 flex items-center justify-center"
          style={{
            height: 220,
            background: "linear-gradient(135deg, rgba(232,114,12,0.12) 0%, rgba(27,58,110,0.08) 100%)",
          }}
        >
          {course.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <BookOpen size={56} color="#E8720C" strokeWidth={1.5} />
          )}

          {olympiad && (
            <div
              className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs uppercase tracking-widest"
              style={{ background: "#1B3A6E", color: "white", fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
            >
              {olympiad}
            </div>
          )}

          {purchased ? (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90">
              <CheckCircle size={11} color="#22C55E" strokeWidth={2.5} />
              <span style={{ fontSize: 11, color: "#22C55E", fontWeight: 700, fontFamily: "var(--font-nunito-var)" }}>Enrolled</span>
            </div>
          ) : course.is_featured ? (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-xl" style={{ background: "#E8720C" }}>
              <Star size={10} color="white" fill="white" strokeWidth={0} />
              <span style={{ fontSize: 11, color: "white", fontWeight: 800, fontFamily: "var(--font-nunito-var)" }}>Featured</span>
            </div>
          ) : null}
        </div>
      )}

      {/* Meta + title */}
      {metaLine && (
        <p className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-2" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
          {metaLine}
        </p>
      )}
      <h1
        className="text-2xl text-[#111827] leading-tight mb-3"
        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
      >
        {course.title}
      </h1>

      {/* Stats row */}
      {(course.total_lessons > 0 || course.duration_hours > 0) && (
        <div className="flex items-center gap-4 mb-4">
          {course.total_lessons > 0 && (
            <div className="flex items-center gap-1.5">
              <BookOpen size={13} color="#9CA3AF" strokeWidth={2.5} />
              <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {course.total_lessons} lessons
              </span>
            </div>
          )}
          {course.duration_hours > 0 && (
            <div className="flex items-center gap-1.5">
              <Clock size={13} color="#9CA3AF" strokeWidth={2.5} />
              <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {course.duration_hours}h
              </span>
            </div>
          )}
        </div>
      )}

      {/* Price */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl text-[#E8720C]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}>
          {formatPrice(course.price)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-base text-[#9CA3AF] line-through" style={{ fontFamily: "var(--font-roboto-var)" }}>
              {formatPrice(course.mrp!)}
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              {discountPercent(course.price, course.mrp!)}% off
            </span>
          </>
        )}
      </div>

      {/* Description */}
      {course.description && (
        <div className="rounded-2xl border border-[#E5E0D8] bg-[#F9F7F5] p-4 mb-6">
          <p className="text-sm text-[#374151] leading-relaxed" style={{ fontFamily: "var(--font-roboto-var)" }}>
            {course.description}
          </p>
        </div>
      )}

      {/* Syllabus */}
      <SyllabusAccordion
        courseId={id}
        modules={modules}
        hasPurchased={purchased}
        completedIds={completedIds}
      />

      {/* Enrollment / UPI — keep in normal flow so a tall panel does not overlap the intro video on short viewports (sticky + bottom nav caused overlap). */}
      <div className="mt-8 relative z-10">
        <PurchaseButton
          course={course}
          purchased={purchased}
          modules={modules}
          completedIds={completedIds}
          authenticated={!!user}
        />
      </div>
    </div>
  );
}
