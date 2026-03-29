"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

import type { ResearchQuizPaper } from "@/lib/research-quizzes/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { captureClient } from "@/lib/analytics/capture";
import { AnalyticsEvents } from "@/lib/analytics/events";

const LABELS = ["A", "B", "C", "D"] as const;

const HUB_PATH = "/research-quiz";

type Props = {
  quiz: ResearchQuizPaper;
  competitionAbbr: string;
};

export default function ResearchQuizPlayerClient({ quiz, competitionAbbr }: Props) {
  const router = useRouter();
  const { questions } = quiz;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<"taking" | "results">("taking");
  const sessionLogged = useRef(false);
  const resultsLogged = useRef(false);

  useEffect(() => {
    if (sessionLogged.current) return;
    sessionLogged.current = true;
    captureClient(AnalyticsEvents.research_quiz_session_started, {
      competition: competitionAbbr,
      quiz_slug: quiz.slug,
      quiz_label: quiz.label,
      question_count: questions.length,
    });
  }, [competitionAbbr, quiz.slug, quiz.label, questions.length]);

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const picked = answers[current.id];

  const scorePct = useMemo(() => {
    let n = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correctIndex) n += 1;
    }
    return Math.round((n / questions.length) * 100);
  }, [questions, answers]);

  useEffect(() => {
    if (phase !== "results" || resultsLogged.current) return;
    resultsLogged.current = true;
    captureClient(AnalyticsEvents.research_quiz_completed, {
      competition: competitionAbbr,
      quiz_slug: quiz.slug,
      quiz_label: quiz.label,
      score_pct: scorePct,
      total_questions: questions.length,
    });
  }, [phase, competitionAbbr, quiz.slug, quiz.label, scorePct, questions.length]);

  const handlePick = (optIdx: number) => {
    captureClient(AnalyticsEvents.research_quiz_question_answered, {
      competition: competitionAbbr,
      quiz_slug: quiz.slug,
      question_id: current.id,
      question_index: index,
      option_index: optIdx,
    });
    setAnswers((prev) => ({ ...prev, [current.id]: optIdx }));
  };

  const handleNext = () => {
    if (isLast) {
      setPhase("results");
      return;
    }
    setIndex((i) => i + 1);
  };

  const handleRetake = () => {
    resultsLogged.current = false;
    setIndex(0);
    setAnswers({});
    setPhase("taking");
  };

  if (phase === "results") {
    const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const passed = scorePct >= 50;

    return (
      <div className="max-w-2xl mx-auto px-5 py-6 pb-24 md:pb-6">
        <Link
          href={HUB_PATH}
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1B3A6E] mb-6 transition-colors"
          style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
        >
          <ArrowLeft size={16} aria-hidden />
          All quizzes
        </Link>

        <div className="text-center mb-8">
          <div
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
              passed ? "bg-green-100" : "bg-amber-50",
            )}
          >
            {passed ? (
              <CheckCircle size={40} color="#22C55E" strokeWidth={2} />
            ) : (
              <XCircle size={40} color="#D97706" strokeWidth={2} />
            )}
          </div>
          <h1
            className="text-2xl sm:text-3xl text-[#1B3A6E] mb-2"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            {quiz.label} - {competitionAbbr} results
          </h1>
          <p className="text-4xl font-black text-[#E8720C] tabular-nums mb-1" style={{ fontFamily: "var(--font-nunito-var)" }}>
            {scorePct}%
          </p>
          <p className="text-[#6B7280]" style={{ fontFamily: "var(--font-roboto-var)" }}>
            {correctCount} of {questions.length} correct
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] border-2 border-[#E5E0D8] bg-white overflow-hidden mb-6 max-h-[min(50vh,420px)] overflow-y-auto">
          <ul className="divide-y divide-[#E5E0D8]">
            {questions.map((q, i) => {
              const a = answers[q.id];
              const ok = a === q.correctIndex;
              return (
                <li key={q.id} className="px-4 py-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 font-bold text-[#9CA3AF] w-7" style={{ fontFamily: "var(--font-nunito-var)" }}>
                      {i + 1}.
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[#111827] mb-1" style={{ fontFamily: "var(--font-roboto-var)" }}>
                        {q.prompt}
                      </p>
                      <p className={cn("text-xs font-bold", ok ? "text-green-700" : "text-red-700")}>
                        {ok ? "Correct" : a === undefined ? "Skipped" : "Incorrect"}
                        {!ok && (
                          <span className="font-normal text-[#6B7280] ml-1">
                            (answer: {LABELS[q.correctIndex]})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button type="button" variant="secondaryCompact" className="sm:flex-1" onClick={handleRetake}>
            Try again
          </Button>
          <Button
            type="button"
            variant="primaryCompact"
            className="sm:flex-1 w-full"
            onClick={() => router.push(HUB_PATH)}
          >
            Choose another paper
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between gap-3 mb-6">
        <Link
          href={HUB_PATH}
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1B3A6E] transition-colors"
          style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
        >
          <ArrowLeft size={16} aria-hidden />
          All quizzes
        </Link>
        <span className="text-sm text-[#9CA3AF] tabular-nums" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
          {index + 1} / {questions.length}
        </span>
      </div>

      <div className="mb-2">
        <p className="text-xs uppercase tracking-wider text-[#C65F0A] font-black mb-1" style={{ fontFamily: "var(--font-nunito-var)" }}>
          {competitionAbbr} · {quiz.label}
        </p>
        <h1
          className="text-xl sm:text-2xl text-[#1B3A6E] leading-snug"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
        >
          Question {index + 1}
        </h1>
      </div>

      <div
        className="rounded-[var(--radius-card)] border-2 border-[#E5E0D8] bg-white p-5 sm:p-6 shadow-sm mb-6"
        style={{ fontFamily: "var(--font-roboto-var)" }}
      >
        <p className="text-[#111827] leading-relaxed text-base mb-6">{current.prompt}</p>
        <div className="flex flex-col gap-2">
          {current.options.map((opt, i) => {
            const selected = picked === i;
            return (
              <button
                key={LABELS[i]}
                type="button"
                onClick={() => handlePick(i)}
                className={cn(
                  "text-left rounded-[var(--radius-control-sm)] border-2 px-4 py-3 transition-colors w-full",
                  selected
                    ? "border-[#E8720C] bg-[#E8720C]/8"
                    : "border-[#E5E0D8] hover:border-[#E8720C]/50 hover:bg-[#FFFBF7]",
                )}
              >
                <span className="font-bold text-[#1B3A6E] mr-2" style={{ fontFamily: "var(--font-nunito-var)" }}>
                  {LABELS[i]}.
                </span>
                <span className="text-[#111827]">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        type="button"
        variant="primaryCompact"
        className="w-full min-h-14"
        disabled={picked === undefined}
        onClick={handleNext}
      >
        {isLast ? "See results" : "Next question"}
      </Button>
    </div>
  );
}
