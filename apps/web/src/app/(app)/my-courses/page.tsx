import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, classRange, olympiadLabel } from "@/lib/courseUtils";
import { buttonProps } from "@/components/ui/buttonStyles";

export default async function MyCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [purchasesRes, progressRes] = await Promise.all([
    supabase
      .from("purchases")
      .select("id, course_id, course:courses(*, olympiad_type:olympiad_types(*), min_class:class_levels!courses_min_class_id_fkey(*), max_class:class_levels!courses_max_class_id_fkey(*))")
      .eq("user_id", user.id)
      .eq("status", "completed"),
    supabase
      .from("user_progress")
      .select("lesson_id, course_id")
      .eq("user_id", user.id)
      .not("lesson_id", "is", null),
  ]);

  const purchases = purchasesRes.data ?? [];
  const progress = progressRes.data ?? [];
  const totalCompleted = progress.length;

  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      <div className="max-w-3xl mx-auto px-5 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-2xl text-[#111827]"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            My Learning
          </h1>
        </div>

        {/* Stats row */}
        {purchases.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: purchases.length, label: "Enrolled" },
              { value: totalCompleted, label: "Completed" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white border border-[#E5E0D8] py-5 flex flex-col items-center"
              >
                <span
                  className="text-3xl text-[#E8720C]"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                >
                  {s.value}
                </span>
                <span
                  className="mt-1 text-[10px] uppercase tracking-widest text-[#9CA3AF]"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Course list */}
        {purchases.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <BookOpen size={56} color="#D1D5DB" strokeWidth={1.5} className="mb-4" />
            <p
              className="text-xl text-[#111827] mb-2"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              No courses yet
            </p>
            <p
              className="text-sm text-[#9CA3AF] mb-8"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            >
              Explore our catalog and enroll in your first Olympiad course
            </p>
            <Link href="/explore" {...buttonProps("primaryBrowse")}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {purchases.map((p) => {
              const course = p.course as any;
              if (!course) return null;

              const completed = progress.filter((pr) => pr.course_id === p.course_id).length;
              const total = course.total_lessons || 1;
              const ratio = Math.min(completed / total, 1);
              const pct = Math.round(ratio * 100);
              const label = olympiadLabel(course);
              const cls = classRange(course);
              const metaLine = [label, cls].filter(Boolean).join(" • ");

              return (
                <div
                  key={p.id}
                  className="rounded-2xl bg-white border border-[#E5E0D8] overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="h-36 w-full relative bg-[#E8720C]/10 flex items-center justify-center">
                    {course.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.thumbnail_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen size={40} color="#E8720C" strokeWidth={1.5} />
                    )}
                  </div>

                  <div className="p-4">
                    {metaLine && (
                      <p
                        className="text-[10px] uppercase tracking-widest text-[#9CA3AF] mb-1"
                        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
                      >
                        {metaLine}
                      </p>
                    )}
                    <p
                      className="text-base text-[#111827] mb-3 line-clamp-2"
                      style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
                    >
                      {course.title}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        className="text-xs text-[#9CA3AF]"
                        style={{ fontFamily: "var(--font-roboto-var)" }}
                      >
                        {completed} / {total} lessons
                      </span>
                      <span
                        className="text-xs text-[#E8720C]"
                        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#F3F4F6] overflow-hidden mb-4">
                      <div
                        className="h-2 rounded-full bg-[#E8720C] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <Link href={`/course/${p.course_id}`} {...buttonProps("softPrimary")}>
                      <Play size={14} strokeWidth={2.5} />
                      {pct >= 100 ? "Review Course" : "Resume"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
