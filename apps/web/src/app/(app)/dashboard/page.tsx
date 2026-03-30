import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Compass, Flame, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { COURSE_LIST_SELECT, PURCHASE_LIST_SELECT } from "@/lib/supabase/selects";
import type { Course, Purchase, UserProgress, OlympiadType } from "@/lib/types";
import { DashboardClient } from "./DashboardClient";
import { buttonProps } from "@/components/ui/buttonStyles";



export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRes, coursesRes, purchasesRes, progressRes, olympiadsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("courses").select(COURSE_LIST_SELECT).eq("is_active", true).order("is_featured", { ascending: false }),
    supabase.from("purchases").select(PURCHASE_LIST_SELECT).eq("user_id", user.id).eq("status", "completed"),
    supabase.from("user_progress").select("*").eq("user_id", user.id),
    supabase.from("olympiad_types").select("*").order("id"),
  ]);

  const profile = profileRes.data;
  const allCourses = (coursesRes.data ?? []) as Course[];
  const featuredCourse = allCourses.find(c => c.is_featured) || allCourses[0] || null;
  const purchases = (purchasesRes.data ?? []) as Purchase[];
  const progress = (progressRes.data ?? []) as UserProgress[];
  const olympiadTypes = (olympiadsRes.data ?? []) as OlympiadType[];

  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const name = profile?.full_name?.split(" ")[0]?.trim() ?? "there";
  const enrolledCount = purchases.length;
  const lessonsCount = progress.filter((p) => p.lesson_id).length;

  return (
    <div className="max-w-4xl mx-auto px-5 py-6">
      {/* Header, Stats... (unchanged) */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl text-[#111827]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}>
            {greeting}, {name}!
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5" style={{ fontFamily: "var(--font-roboto-var)" }}>
            Ready to ace your Olympiad?
          </p>
        </div>
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#E8720C] flex items-center justify-center text-white font-bold">
            {profile?.full_name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
      </div>

      {/* Stats row */}
      {(enrolledCount > 0 || lessonsCount > 0) && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { val: enrolledCount, label: enrolledCount === 1 ? "Course" : "Courses" },
            { val: lessonsCount, label: "Lessons Done" },
          ].map(({ val, label }) => (
            <div key={label} className="flex flex-col items-center py-4 rounded-2xl bg-white border border-[#E5E0D8]">
              <span className="text-2xl text-[#E8720C]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}>
                {val}
              </span>
              <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mt-1" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
                {label}
              </span>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center py-4 rounded-2xl bg-[#E8720C]">
            <Flame size={22} color="white" strokeWidth={2.2} className="opacity-95" aria-hidden />
            <span className="text-[10px] text-white/80 uppercase tracking-wider mt-1" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
              Keep it up
            </span>
          </div>
        </div>
      )}

      {/* Featured course */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} color="#E8720C" strokeWidth={2.5} />
            <span className="text-sm uppercase tracking-wider text-[#111827]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}>
              Featured
            </span>
          </div>
          <Link href="/explore" className="text-sm text-[#E8720C] hover:underline" style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 600 }}>
            See all →
          </Link>
        </div>

        {featuredCourse ? (
          <DashboardClient featuredCourse={featuredCourse} purchases={purchases} progress={progress} />
        ) : (
          <Link href="/explore" className="block rounded-2xl bg-white border border-[#E5E0D8] p-6 text-center hover:border-[#E8720C] transition-colors">
            <BookOpen size={36} color="#D1D5DB" strokeWidth={1.5} className="mx-auto mb-3" />
            <p className="text-base text-[#111827]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}>Courses coming soon</p>
          </Link>
        )}
      </div>

      {/* Topics & Grouped Courses */}
      <div className="space-y-8 mb-6">
        <div className="flex items-center gap-1.5 mb-2">
          <BookOpen size={14} color="#1B3A6E" strokeWidth={2.5} />
          <span className="text-sm uppercase tracking-wider text-[#111827]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}>
            Browse Topics
          </span>
        </div>

        {olympiadTypes.map((type) => {
          const typeCourses = allCourses.filter(c => c.olympiad_type_id === type.id);
          if (typeCourses.length === 0) return null;

          return (
            <div key={type.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1B3A6E]" style={{ fontFamily: "var(--font-nunito-var)" }}>
                  {type.label}
                </h3>
                <Link 
                  href={`/explore?olympiad=${type.id}`}
                  className="text-xs text-[#E8720C] font-semibold hover:underline"
                >
                  View all ({typeCourses.length})
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {typeCourses.slice(0, 2).map((course) => (
                  <DashboardClient 
                    key={course.id} 
                    featuredCourse={course} 
                    purchases={purchases} 
                    progress={progress} 
                    variant="grid"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resume CTA */}
      {enrolledCount > 0 && (
        <Link href="/my-courses" {...buttonProps("linkPanelOrange")}>
          <div>
            <p
              className="text-base text-white"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              Continue Learning
            </p>
            <p className="text-sm text-white/70 mt-0.5" style={{ fontFamily: "var(--font-roboto-var)" }}>
              {enrolledCount} {enrolledCount === 1 ? "course" : "courses"} in progress
            </p>
          </div>
          <Compass size={20} color="white" strokeWidth={2.5} />
        </Link>
      )}
    </div>
  );
}
