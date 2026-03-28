/**
 * YouTube video IDs do not contain slashes. Supabase storage paths look like
 * `courses/<id>/file.mp4`. Full URLs are treated as non-IDs.
 */
export function isYoutubeVideoId(value: string | null | undefined): boolean {
  const v = value?.trim();
  if (!v) return false;
  if (v.includes('/') || v.startsWith('http')) return false;
  return true;
}
