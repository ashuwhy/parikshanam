"use client";

import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { VideoPlayer } from "@/components/lesson/VideoPlayer";

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

const STALE_MS = 55 * 60 * 1000;

export function LessonClient({ lesson, courseId, userId, alreadyDone }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();
  const [completed, setCompleted] = useState(alreadyDone);
  const [marking, setMarking] = useState(false);

  // Fetch signed video URL via Edge Function
  const { data: videoUrl, isLoading: urlLoading, error: urlError, refetch } = useQuery<string | null>({
    queryKey: ["videoUrl", lesson.id],
    enabled: !!lesson.video_storage_path,
    staleTime: STALE_MS,
    gcTime: STALE_MS + 5000,
    retry: 1,
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<{
        signed_url: string;
        expires_at: string;
      }>("get-video-url", { body: { lesson_id: lesson.id } });
      if (error) throw error;
      if (!data?.signed_url) throw new Error("No video URL");
      return data.signed_url;
    },
  });

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
      toast.success("Lesson completed! 🎉");
    }
  }, [completed, marking, supabase, userId, lesson.id, courseId, queryClient]);

  return (
    <div className="min-h-screen bg-[#111827] md:bg-[#F9F7F5]">
      {/* Video area — full-width dark */}
      <div className="bg-[#111827] w-full" style={{ aspectRatio: "16/9", maxHeight: "56vh" }}>
        {lesson.video_storage_path ? (
          urlLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#E8720C] border-t-transparent animate-spin" />
            </div>
          ) : urlError ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <p className="text-sm text-white/60" style={{ fontFamily: "var(--font-roboto-var)" }}>
                Could not load video
              </p>
              <button
                onClick={() => void refetch()}
                className="px-4 py-2 rounded-xl bg-[#E8720C] text-white text-sm"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
              >
                Retry
              </button>
            </div>
          ) : videoUrl ? (
            <VideoPlayer url={videoUrl} onEnded={() => void markComplete()} />
          ) : null
        ) : lesson.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={lesson.thumbnail_url} alt="" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white/40 text-sm" style={{ fontFamily: "var(--font-roboto-var)" }}>
              No video for this lesson
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-[#F9F7F5] max-w-3xl mx-auto px-5 py-6">
        {/* Back + title row */}
        <Link
          href={`/course/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1B3A6E] mb-4 transition-colors"
          style={{ fontFamily: "var(--font-roboto-var)" }}
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back to course
        </Link>

        <h1
          className="text-xl text-[#111827] leading-snug mb-2"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
        >
          {lesson.title}
        </h1>

        {lesson.duration_minutes > 0 && (
          <div className="flex items-center gap-1.5 mb-5">
            <Clock size={12} color="#9CA3AF" strokeWidth={2.5} />
            <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
              {lesson.duration_minutes} min
            </span>
          </div>
        )}

        {lesson.content_text && (
          <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5 mb-6">
            <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-line" style={{ fontFamily: "var(--font-roboto-var)" }}>
              {lesson.content_text}
            </p>
          </div>
        )}

        {/* Mark complete */}
        {completed ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-green-50 border border-green-200 py-4">
            <CheckCircle size={18} color="#22C55E" strokeWidth={2.5} />
            <span
              className="text-sm text-green-700"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
            >
              Lesson completed
            </span>
          </div>
        ) : (
          <button
            onClick={() => void markComplete()}
            disabled={marking}
            className="w-full py-4 rounded-2xl bg-[#E8720C] text-white text-base border-b-4 border-[#A04F08] active:translate-y-[2px] active:border-b-2 transition-all disabled:opacity-60"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            {marking ? "Saving…" : "Mark as Completed ✓"}
          </button>
        )}
      </div>
    </div>
  );
}
