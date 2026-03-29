"use client";

import Link from "next/link";
import { ArrowLeft, Brain, ChevronRight } from "lucide-react";

import type { YmrcQuizSet } from "@/lib/ymrc-quiz/types";
import { cn } from "@/lib/cn";

type Props = {
  quizzes: YmrcQuizSet[];
};

export default function YmrcQuizHubClient({ quizzes }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-5 py-6 pb-24 md:pb-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1B3A6E] mb-6 transition-colors"
        style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
      >
        <ArrowLeft size={16} aria-hidden />
        Back to dashboard
      </Link>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1B3A6E]/10 text-[#1B3A6E] mb-4">
          <Brain size={24} strokeWidth={2.25} aria-hidden />
        </div>
        <h1
          className="text-3xl sm:text-4xl text-[#1B3A6E] mb-2"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
        >
          YMRC practice quiz
        </h1>
        <p className="text-[#6B7280] max-w-md mx-auto" style={{ fontFamily: "var(--font-roboto-var)" }}>
          Young Mathematical Research Competition — sample mathematics papers. Free practice; sign in required. Pick your
          class to start (25 questions each).
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {quizzes.map((q) => (
          <li key={q.slug}>
            <Link
              href={`/ymrc-quiz/${q.slug}`}
              className={cn(
                "group flex items-center justify-between gap-4 rounded-[var(--radius-card)] border-2 border-[#E5E0D8] bg-white p-5 shadow-sm",
                "transition-colors hover:border-[#E8720C] hover:bg-[#FFFBF7]",
              )}
            >
              <div className="min-w-0 text-left">
                <p
                  className="text-lg text-[#111827] group-hover:text-[#1B3A6E]"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                >
                  {q.label}
                </p>
                <p className="text-sm text-[#6B7280] mt-0.5" style={{ fontFamily: "var(--font-roboto-var)" }}>
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

      <p className="mt-8 text-xs text-center text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
        Questions are taken from the official sample papers in your course materials. This is practice only — scores are
        not stored.
      </p>
    </div>
  );
}
