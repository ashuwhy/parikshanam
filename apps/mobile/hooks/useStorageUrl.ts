import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const STALE_MS = 55 * 60 * 1000;

/**
 * Generates a short-lived signed URL for any path in the course-videos bucket.
 * Used for intro/preview videos that don't require purchase verification.
 */
export function useStorageUrl(path: string | null | undefined) {
  const q = useQuery({
    queryKey: ['storageUrl', path],
    enabled: !!path,
    staleTime: STALE_MS,
    gcTime: STALE_MS + 5_000,
    retry: 1,
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('course-videos')
        .createSignedUrl(path!, 3600);
      if (error) throw error;
      return data.signedUrl;
    },
  });

  return {
    url: q.data ?? null,
    loading: q.isLoading,
    error: q.error as Error | null,
  };
}
