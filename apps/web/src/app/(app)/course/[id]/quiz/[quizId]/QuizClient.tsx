"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useMemo } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Quiz, QuizQuestion } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface Props {
  quiz: Quiz;
  questions: QuizQuestion[];
  courseId: string;
  userId: string;
  previousScore: number | null;
}

export function QuizClient({ quiz, questions, courseId, userId, previousScore }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-[#F9F7F5] flex flex-col items-center justify-center gap-4">
        <p className="text-[#6B7280]" style={{ fontFamily: "var(--font-roboto-var)" }}>
          No questions in this quiz yet.
        </p>
        <Link
          href={`/course/${courseId}`}
          className="text-sm text-[#E8720C] underline"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
        >
          Back to course
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const currentAnswer = answers[currentQ.id];
  const isAnswered = currentAnswer !== undefined;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: idx }));
  };

  const handleNext = useCallback(async () => {
    if (submitted) {
      if (isLast) return;
      setSubmitted(false);
      setCurrentIndex((i) => i + 1);
      return;
    }

    // Submit this question
    setSubmitted(true);

    if (isLast) {
      // Calculate final score
      let correctCount = 0;
      questions.forEach((q) => {
        if (answers[q.id] === q.correct_option_index) correctCount++;
      });
      const score = Math.round((correctCount / questions.length) * 100);
      const passed = score >= (quiz.passing_score ?? 50);
      setResult({ score, passed });

      setSaving(true);
      const { error } = await supabase.from("user_progress").upsert(
        {
          user_id: userId,
          quiz_id: quiz.id,
          score,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,quiz_id" },
      );
      setSaving(false);
      if (error) {
        toast.error("Failed to save quiz result");
      } else {
        toast.success(passed ? "Quiz passed." : `Quiz complete — ${score}%`);
      }
    }
  }, [submitted, isLast, questions, answers, quiz.passing_score, quiz.id, supabase, userId]);

  // Results screen
  if (result) {
    return (
      <div className="min-h-screen bg-[#F9F7F5] flex flex-col">
        <div className="bg-white border-b border-[#E5E0D8] px-4 py-3 flex items-center gap-3">
          <Link href={`/course/${courseId}`} className="text-[#6B7280] hover:text-[#1B3A6E] transition-colors">
            <ArrowLeft size={20} strokeWidth={2} />
          </Link>
          <span className="text-base text-[#111827]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}>
            {quiz.title}
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${result.passed ? "bg-green-100" : "bg-red-50"}`}>
            {result.passed ? (
              <CheckCircle size={40} color="#22C55E" strokeWidth={2} />
            ) : (
              <XCircle size={40} color="#EF4444" strokeWidth={2} />
            )}
          </div>

          <h2
            className="text-2xl text-[#111827] mb-2"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            {result.passed ? "Quiz Passed!" : "Quiz Complete"}
          </h2>

          <p className="text-5xl mb-2" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, color: result.passed ? "#22C55E" : "#E8720C" }}>
            {result.score}%
          </p>

          <p className="text-sm text-[#6B7280] mb-8" style={{ fontFamily: "var(--font-roboto-var)" }}>
            Passing score: {quiz.passing_score ?? 50}%
          </p>

          <div className="flex flex-col w-full max-w-sm gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
                setCurrentIndex(0);
                setResult(null);
              }}
            >
              Retake Quiz
            </Button>
            <Button variant="primary" onClick={() => router.push(`/course/${courseId}`)}>
              Back to Course
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F5] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E0D8] px-4 py-3 flex items-center gap-3">
        <Link href={`/course/${courseId}`} className="text-[#6B7280] hover:text-[#1B3A6E] transition-colors">
          <ArrowLeft size={20} strokeWidth={2} />
        </Link>
        <div className="flex-1">
          <p className="text-xs text-[#9CA3AF] uppercase tracking-wider" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
            {quiz.title}
          </p>
          <p className="text-sm text-[#111827]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}>
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        {previousScore !== null && (
          <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
            Best: {previousScore}%
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[#E5E0D8]">
        <div
          className="h-1 bg-[#E8720C] transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto max-w-2xl w-full mx-auto px-4 py-6">
        <h2
          className="text-xl text-[#111827] mb-6 leading-snug"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
        >
          {currentQ.question_text}
        </h2>

        <div className="flex flex-col gap-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = currentAnswer === idx;
            const isCorrect = submitted && idx === currentQ.correct_option_index;
            const isWrong = submitted && isSelected && idx !== currentQ.correct_option_index;

            let borderClass = "border-[#E5E0D8]";
            let bgClass = "bg-white";

            if (isCorrect) {
              borderClass = "border-green-500";
              bgClass = "bg-green-50";
            } else if (isWrong) {
              borderClass = "border-red-400";
              bgClass = "bg-red-50";
            } else if (isSelected && !submitted) {
              borderClass = "border-[#E8720C]";
              bgClass = "bg-[#E8720C]/5";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={submitted}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-colors ${borderClass} ${bgClass} disabled:cursor-default`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    isCorrect
                      ? "border-green-500 bg-green-500"
                      : isWrong
                      ? "border-red-400 bg-red-400"
                      : isSelected
                      ? "border-[#E8720C] bg-[#E8720C]"
                      : "border-[#D1D5DB]"
                  }`}
                >
                  {(isSelected || isCorrect) && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className="text-sm text-[#111827]"
                  style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
                >
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {submitted && currentQ.explanation && (
          <div className="mt-6 p-4 bg-[#E8720C]/10 rounded-2xl border-2 border-[#E8720C]/30">
            <p
              className="text-[11px] uppercase tracking-wider text-[#A04F08] mb-1"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
            >
              Explanation
            </p>
            <p className="text-sm text-[#374151]" style={{ fontFamily: "var(--font-roboto-var)" }}>
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer button */}
      <div className="bg-white border-t border-[#E5E0D8] px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="primary"
            onClick={() => void handleNext()}
            disabled={(!submitted && !isAnswered) || saving}
          >
            {saving
              ? "Saving…"
              : submitted
              ? isLast
                ? "See Results"
                : "Next Question"
              : isLast
              ? "Submit Quiz"
              : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
