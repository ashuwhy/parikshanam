import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Cache the signed URL for 55 minutes — safely under the 1-hour server expiry.
const STALE_MS = 55 * 60 * 1000;

/**
 * Fetches a short-lived signed URL for a lesson video via the get-video-url
 * Edge Function. The function verifies auth + purchase before signing.
 *
 * Returns null url when lessonId is undefined or lesson has no video.
 */
export function useVideoUrl(lessonId: string | undefined) {
  const q = useQuery({
    queryKey: ["videoUrl", lessonId],
    enabled: !!lessonId,
    staleTime: STALE_MS,
    gcTime: STALE_MS + 5_000, // keep in cache slightly longer than stale window
    retry: 1,
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<{
        signed_url: string;
        expires_at: string;
      }>("get-video-url", {
        body: { lesson_id: lessonId },
      });

      if (error) throw error;
      if (!data?.signed_url) throw new Error("No video URL returned");
      return data.signed_url;
    },
  });

  return {
    url: q.data ?? null,
    loading: q.isLoading,
    error: q.error as Error | null,
    refetch: q.refetch,
  };
}
