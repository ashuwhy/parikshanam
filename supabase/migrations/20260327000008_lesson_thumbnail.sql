-- Add thumbnail_url to lessons so each lesson can have its own cover image.
alter table public.lessons add column if not exists thumbnail_url text;
