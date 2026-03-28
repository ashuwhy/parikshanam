"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, HelpCircle, Lock, Play } from "lucide-react";

interface SyllabusModule {
  id: string;
  title: string;
  order_index: number;
  lessons: { id: string; title: string; duration_minutes: number; is_preview: boolean }[];
  quizzes: { id: string; title: string }[];
}

interface Props {
  courseId: string;
  modules: SyllabusModule[];
  hasPurchased: boolean;
  completedIds: Set<string | null | undefined>;
}

export function SyllabusAccordion({ courseId, modules, hasPurchased, completedIds }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ [modules[0]?.id]: true });

  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 px-4 text-center">
        <BookOpen size={40} color="#D1D5DB" strokeWidth={1.5} className="mb-3" />
        <p className="text-base text-[#374151]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}>
          Syllabus coming soon
        </p>
        <p className="text-sm text-[#9CA3AF] mt-1" style={{ fontFamily: "var(--font-roboto-var)" }}>
          Content is being prepared for this course
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-3">
        <BookOpen size={14} color="#1B3A6E" strokeWidth={2.5} />
        <span
          className="text-sm uppercase tracking-wider text-[#111827]"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
        >
          Syllabus
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {modules.map((module, mIdx) => {
          const isOpen = expanded[module.id] ?? false;
          return (
            <div
              key={module.id}
              className="rounded-2xl border border-[#E5E0D8] bg-white overflow-hidden"
            >
              {/* Module header */}
              <button
                onClick={() =>
                  setExpanded((prev) => ({ ...prev, [module.id]: !prev[module.id] }))
                }
                className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-[#F9F7F5] transition-colors"
              >
                <div className="flex-1 mr-3">
                  <p
                    className="text-[10px] uppercase tracking-widest text-[#9CA3AF]"
                    style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
                  >
                    Module {mIdx + 1}
                  </p>
                  <p
                    className="text-sm text-[#111827] mt-0.5"
                    style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
                  >
                    {module.title}
                  </p>
                </div>
                {isOpen ? (
                  <ChevronUp size={16} color="#9CA3AF" strokeWidth={2.5} />
                ) : (
                  <ChevronDown size={16} color="#9CA3AF" strokeWidth={2.5} />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-[#E5E0D8] px-2 py-2">
                  {module.lessons.map((lesson, lIdx) => {
                    const canAccess = hasPurchased || lesson.is_preview;
                    const done = completedIds.has(lesson.id);
                    return (
                      canAccess ? (
                        <Link
                          key={lesson.id}
                          href={`/course/${courseId}/lesson/${lesson.id}`}
                          className="flex items-center px-3 py-2.5 rounded-xl hover:bg-[#F9F7F5] transition-colors group"
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 shrink-0 ${done ? "bg-green-100" : "bg-[#E8720C]/15"}`}>
                            {done ? (
                              <span className="text-green-600 text-xs">✓</span>
                            ) : (
                              <Play size={12} color="#E8720C" strokeWidth={2.5} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#111827] truncate" style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}>
                              {lIdx + 1}. {lesson.title}
                            </p>
                            {lesson.duration_minutes > 0 && (
                              <p className="text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                                {lesson.duration_minutes} min
                              </p>
                            )}
                          </div>
                          {!hasPurchased && lesson.is_preview && (
                            <span
                              className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-green-50 text-green-700 border border-green-200"
                              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
                            >
                              Free
                            </span>
                          )}
                        </Link>
                      ) : (
                        <div
                          key={lesson.id}
                          className="flex items-center px-3 py-2.5 rounded-xl opacity-50"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#E5E0D8] flex items-center justify-center mr-3 shrink-0">
                            <Lock size={11} color="#9CA3AF" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#9CA3AF] truncate" style={{ fontFamily: "var(--font-roboto-var)" }}>
                              {lIdx + 1}. {lesson.title}
                            </p>
                          </div>
                        </div>
                      )
                    );
                  })}

                  {module.quizzes.map((quiz) => {
                    const done = completedIds.has(quiz.id);
                    return hasPurchased ? (
                      <Link
                        key={quiz.id}
                        href={`/course/${courseId}/quiz/${quiz.id}`}
                        className="flex items-center px-3 py-2.5 rounded-xl hover:bg-[#F9F7F5] transition-colors"
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 shrink-0 ${done ? "bg-green-100" : "bg-[#F5C842]/20"}`}>
                          {done ? (
                            <span className="text-green-600 text-xs">✓</span>
                          ) : (
                            <HelpCircle size={13} color="#A04F08" strokeWidth={2.5} />
                          )}
                        </div>
                        <p className="text-sm text-[#111827] flex-1" style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}>
                          Quiz: {quiz.title}
                        </p>
                      </Link>
                    ) : (
                      <div
                        key={quiz.id}
                        className="flex items-center px-3 py-2.5 rounded-xl opacity-50"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#E5E0D8] flex items-center justify-center mr-3 shrink-0">
                          <Lock size={11} color="#9CA3AF" strokeWidth={2} />
                        </div>
                        <p className="text-sm text-[#9CA3AF] flex-1" style={{ fontFamily: "var(--font-roboto-var)" }}>
                          Quiz: {quiz.title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
