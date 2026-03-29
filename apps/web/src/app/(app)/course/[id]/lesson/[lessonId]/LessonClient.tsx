"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, CheckCircle, Clock, Play } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { VideoPlayer } from "@/components/lesson/VideoPlayer";
import { Button } from "@/components/ui/Button";
import { captureClient } from "@/lib/analytics/capture";
import { AnalyticsEvents } from "@/lib/analytics/events";

interface Lesson {
  id: string;
  title: string;
  video_storage_path: string | null;
  thumbnail_url: string | null;
  content_text: string | null;
  duration_minutes: number;
  is_preview: boolean;
  course_id: string;
}

interface Props {
  lesson: Lesson;
  courseId: string;
  userId: string;
  alreadyDone: boolean;
}

const supabase = getSupabaseBrowserClient();

export function LessonClient({ lesson, courseId, userId, alreadyDone }: Props) {
  const queryClient = useQueryClient();
  const [completed, setCompleted] = useState(alreadyDone);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    captureClient(AnalyticsEvents.lesson_viewed, {
      course_id: courseId,
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      is_preview: lesson.is_preview,
    });
  }, [courseId, lesson.id, lesson.title, lesson.is_preview]);

  const markComplete = useCallback(async () => {
    if (completed || marking) return;
    setMarking(true);
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: userId,
        lesson_id: lesson.id,
        course_id: courseId,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" },
    );
    setMarking(false);
    if (error) {
      toast.error("Failed to save progress");
    } else {
      setCompleted(true);
      void queryClient.invalidateQueries({ queryKey: ["progress", userId] });
      captureClient(AnalyticsEvents.lesson_marked_complete, {
        course_id: courseId,
        lesson_id: lesson.id,
        lesson_title: lesson.title,
      });
      toast.success("Lesson completed.");
    }
  }, [completed, marking, userId, lesson.id, lesson.title, courseId, queryClient]);

  return (
    <div className="min-h-full bg-transparent">
      <div className="max-w-3xl mx-auto px-5 pt-4 pb-10 md:pt-6 md:pb-12">
        <Link
          href={`/course/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1B3A6E] mb-5 transition-colors"
          style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden />
          Back to course
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1 rounded-full border border-[#F5D0A8] bg-[#FFF4E8] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#C2410C]"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            <Play size={12} className="shrink-0" aria-hidden strokeWidth={2.5} />
            Lesson
          </span>
          {lesson.is_preview && (
            <span
              className="rounded-full border border-[#E5E0D8] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#6B7280]"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
            >
              Preview
            </span>
          )}
        </div>

        <h1
          className="text-2xl sm:text-3xl text-[#1B3A6E] leading-tight mb-4"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
        >
          {lesson.title}
        </h1>

        {lesson.duration_minutes > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <span
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E0D8] bg-white px-3 py-1.5 text-xs text-[#6B7280]"
              style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
            >
              <Clock size={14} color="#9CA3AF" strokeWidth={2.5} aria-hidden />
              {lesson.duration_minutes} min
            </span>
          </div>
        )}

        {/* Video - card frame matches course / marketing UI */}
        <div className="mb-8 w-full max-h-[min(56vh,520px)] aspect-video rounded-2xl overflow-hidden border-2 border-[#E5E0D8] bg-[#0f172a] shadow-[0_16px_48px_-14px_rgba(27,58,110,0.22)]">
          {lesson.video_storage_path ? (
            <VideoPlayer
              videoId={lesson.video_storage_path}
              title={lesson.title}
              onEnded={() => void markComplete()}
            />
          ) : lesson.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lesson.thumbnail_url} alt="" className="w-full h-full object-cover opacity-70" />
          ) : (
            <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-2 px-4">
              <Play size={32} className="text-white/25" aria-hidden strokeWidth={1.5} />
              <p className="text-white/45 text-sm text-center" style={{ fontFamily: "var(--font-roboto-var)" }}>
                No video for this lesson
              </p>
            </div>
          )}
        </div>

        {lesson.content_text && (
          <div className="rounded-2xl border-2 border-[#E5E0D8] bg-white p-5 sm:p-6 mb-6 shadow-[0_4px_24px_-8px_rgba(27,58,110,0.08)]">
            <p
              className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-3"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
            >
              About this lesson
            </p>
            <p
              className="text-sm sm:text-base text-[#374151] leading-relaxed whitespace-pre-line"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            >
              {lesson.content_text}
            </p>
          </div>
        )}

        {completed ? (
          <div className="flex items-center justify-center gap-2.5 rounded-2xl border-2 border-green-200 bg-green-50 py-4 px-4 shadow-[0_4px_20px_-10px_rgba(34,197,94,0.25)]">
            <CheckCircle size={20} color="#16A34A" strokeWidth={2.5} aria-hidden />
            <span
              className="text-sm text-green-800"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
            >
              Lesson completed
            </span>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-[#E5E0D8] bg-white p-4 sm:p-5 shadow-[0_4px_24px_-8px_rgba(27,58,110,0.08)]">
            <p
              className="text-xs text-[#6B7280] mb-3"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            >
              Mark this lesson complete when you&apos;ve finished watching to track your progress.
            </p>
            <Button
              variant="primary"
              onClick={() => void markComplete()}
              disabled={marking}
              className="disabled:opacity-60"
            >
              {marking ? "Saving…" : "Mark as completed"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
