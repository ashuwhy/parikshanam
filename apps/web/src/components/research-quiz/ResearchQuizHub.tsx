import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Brain, ChevronRight, Microscope } from "lucide-react";

import type { CompetitionId } from "@/lib/research-quizzes";
import { researchQuizData, YMRC_QUIZZES, YSRC_QUIZZES } from "@/lib/research-quizzes";
import type { ResearchQuizPaper } from "@/lib/research-quizzes/types";
import { cn } from "@/lib/cn";

function QuizSection({
  competition,
  title,
  subjectLine,
  fullName,
  Icon,
  iconWrapClass,
  quizzes,
}: {
  competition: CompetitionId;
  title: string;
  subjectLine: string;
  fullName: string;
  Icon: LucideIcon;
  iconWrapClass: string;
  quizzes: ResearchQuizPaper[];
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
        {quizzes.map((q) => (
          <li key={`${competition}-${q.slug}`}>
            <Link
              href={`/research-quiz/${competition}/${q.slug}`}
              className={cn(
                "group flex items-center justify-between gap-4 rounded-[var(--radius-card)] border-2 border-[#E5E0D8] bg-white p-4 sm:p-5 shadow-sm",
                "transition-colors hover:border-[#E8720C] hover:bg-[#FFFBF7]",
              )}
            >
              <div className="min-w-0 text-left">
                <p
                  className="text-base sm:text-lg text-[#111827] group-hover:text-[#1B3A6E]"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                >
                  {q.label}
                </p>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5" style={{ fontFamily: "var(--font-roboto-var)" }}>
                  {q.subtitle}
                </p>
              </div>
              <ChevronRight
                className="shrink-0 text-[#9CA3AF] group-hover:text-[#E8720C] transition-colors"
                size={22}
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ResearchQuizHub() {
  const { ymrc, ysrc } = researchQuizData;

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
          YMRC mathematics and YSRC science — sample papers from your materials. Sign in required. Scores are not
          stored.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8 xl:gap-10 lg:items-start">
        <QuizSection
          competition="ymrc"
          title={ymrc.abbr}
          subjectLine={ymrc.subject}
          fullName={ymrc.name}
          Icon={Brain}
          iconWrapClass="bg-[#1B3A6E]/10 text-[#1B3A6E]"
          quizzes={YMRC_QUIZZES}
        />

        <QuizSection
          competition="ysrc"
          title={ysrc.abbr}
          subjectLine={ysrc.subject}
          fullName={ysrc.name}
          Icon={Microscope}
          iconWrapClass="bg-emerald-700/10 text-emerald-800"
          quizzes={YSRC_QUIZZES}
        />
      </div>

      <p className="mt-10 text-xs text-center text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
        Questions are extracted from the official sample papers. For practice only.
      </p>
    </div>
  );
}
