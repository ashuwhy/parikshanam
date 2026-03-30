"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Brain, ChevronRight, Microscope } from "lucide-react";

import type { CompetitionId } from "@/lib/research-quizzes";
import { researchQuizData, YMRC_QUIZZES, YSRC_QUIZZES } from "@/lib/research-quizzes";
import type { ResearchQuizPaper } from "@/lib/research-quizzes/types";
import { cn } from "@/lib/cn";
import { captureClient } from "@/lib/analytics/capture";
import { AnalyticsEvents } from "@/lib/analytics/events";
import type { Profile } from "@/lib/types";

function QuizSection({
  competition,
  title,
  subjectLine,
  fullName,
  Icon,
  iconWrapClass,
  quizzes,
  completedSlugs,
}: {
  competition: CompetitionId;
  title: string;
  subjectLine: string;
  fullName: string;
  Icon: LucideIcon;
  iconWrapClass: string;
  quizzes: ResearchQuizPaper[];
  completedSlugs: string[];
}) {
  return (
    <section className="min-w-0">
      <div className="flex items-start gap-3 mb-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            iconWrapClass,
          )}
        >
          <Icon size={22} strokeWidth={2.25} aria-hidden />
        </div>
        <div className="min-w-0 pt-0.5">
          <h2
            className="text-xl text-[#1B3A6E]"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            {title}
          </h2>
          <p className="text-sm text-[#6B7280]" style={{ fontFamily: "var(--font-roboto-var)" }}>
            {subjectLine} · {fullName}
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {quizzes.map((q) => {
          const isCompleted = completedSlugs.includes(q.slug);
          return (
            <li key={`${competition}-${q.slug}`}>
              <Link
                href={`/research-quiz/${competition}/${q.slug}`}
                onClick={() =>
                  captureClient(AnalyticsEvents.research_quiz_hub_paper_clicked, {
                    competition,
                    slug: q.slug,
                    label: q.label,
                  })
                }
                className={cn(
                  "group flex items-center justify-between gap-4 rounded-[var(--radius-card)] border-2 border-[#E5E0D8] bg-white p-4 sm:p-5 shadow-sm",
                  "transition-colors hover:border-[#E8720C] hover:bg-[#FFFBF7]",
                  isCompleted && "border-[#22C55E]/30 bg-[#22C55E]/5"
                )}
              >
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <p
                      className="text-base sm:text-lg text-[#111827] group-hover:text-[#1B3A6E]"
                      style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                    >
                      {q.label}
                    </p>
                    {isCompleted && (
                      <span className="inline-flex items-center rounded-full bg-[#22C55E]/10 px-2 py-0.5 text-[10px] font-bold text-[#15803D] uppercase tracking-wider">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5" style={{ fontFamily: "var(--font-roboto-var)" }}>
                    {q.subtitle}
                  </p>
                </div>
                <ChevronRight
                  className={cn(
                    "shrink-0 text-[#9CA3AF] group-hover:text-[#E8720C] transition-colors",
                    isCompleted && "text-[#22C55E]"
                  )}
                  size={22}
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ResearchQuizHub({ 
  userProfile, 
  completedQuizSlugs = [] 
}: { 
  userProfile: Profile | null;
  completedQuizSlugs?: string[];
}) {
  const { ymrc, ysrc } = researchQuizData;
  const userClass = userProfile?.class_level_id;

  // Filter quizzes based on user's class level (e.g. "class-7")
  const filterByClass = (quizzes: ResearchQuizPaper[]) => {
    if (!userClass) return quizzes;
    const targetSlug = `class-${userClass}`;
    return quizzes.filter((q) => q.slug === targetSlug);
  };

  const filteredYmrc = filterByClass(YMRC_QUIZZES);
  const filteredYsrc = filterByClass(YSRC_QUIZZES);

  return (
    <div className="max-w-6xl mx-auto px-5 py-6 pb-24 md:pb-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1B3A6E] mb-6 transition-colors"
        style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
      >
        <ArrowLeft size={16} aria-hidden />
        Back to dashboard
      </Link>

      <div className="text-center mb-10">
        <h1
          className="text-3xl sm:text-4xl text-[#1B3A6E] mb-2"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
        >
          Free practice quizzes
        </h1>
        <p className="text-[#6B7280] max-w-lg mx-auto" style={{ fontFamily: "var(--font-roboto-var)" }}>
          Practice quizzes tailored for your grade level. Complete these to test your skills - results are saved
          privately for merit list selection.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8 xl:gap-10 lg:items-start">
        {filteredYmrc.length > 0 && (
          <QuizSection
            competition="ymrc"
            title={ymrc.abbr}
            subjectLine={ymrc.subject}
            fullName={ymrc.name}
            Icon={Brain}
            iconWrapClass="bg-[#1B3A6E]/10 text-[#1B3A6E]"
            quizzes={filteredYmrc}
            completedSlugs={completedQuizSlugs}
          />
        )}

        {filteredYsrc.length > 0 && (
          <QuizSection
            competition="ysrc"
            title={ysrc.abbr}
            subjectLine={ysrc.subject}
            fullName={ysrc.name}
            Icon={Microscope}
            iconWrapClass="bg-emerald-700/10 text-emerald-800"
            quizzes={filteredYsrc}
            completedSlugs={completedQuizSlugs}
          />
        )}
      </div>
    </div>
  );
}
