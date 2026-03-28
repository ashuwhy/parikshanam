-- ─────────────────────────────────────────────────────────────────────────────
-- course-thumbnails: public CDN bucket for course cover images.
-- Images are publicly readable (no auth needed) so mobile/web can load them
-- directly via the Supabase public URL without a signed URL.
-- ─────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'course-thumbnails',
  'course-thumbnails',
  true,          -- PUBLIC - served as CDN, no auth required
  5242880,       -- 5 MB per file
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Anyone can read (public bucket still needs a SELECT policy)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'Public read course thumbnails'
  ) then
    create policy "Public read course thumbnails"
      on storage.objects for select
      using (bucket_id = 'course-thumbnails');
  end if;
end $$;
