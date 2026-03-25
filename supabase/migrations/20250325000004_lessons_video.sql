-- ─────────────────────────────────────────────────────────────
-- Modules, Lessons, Quizzes, Progress + course-videos bucket
-- Safe to re-run: all statements use IF NOT EXISTS guards
-- ─────────────────────────────────────────────────────────────

-- ── Modules ────────────────────────────────────────────────────
create table if not exists public.modules (
  id           uuid default gen_random_uuid() primary key,
  course_id    uuid references public.courses(id) on delete cascade not null,
  title        text not null,
  order_index  integer not null default 0,
  created_at   timestamptz default now()
);

alter table public.modules enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'modules'
      and policyname = 'Anyone can view modules for active courses'
  ) then
    create policy "Anyone can view modules for active courses"
      on public.modules for select
      using (exists (
        select 1 from public.courses c
        where c.id = course_id and c.is_active = true
      ));
  end if;
end $$;

create index if not exists modules_course_id_idx on public.modules(course_id);

-- ── Lessons ────────────────────────────────────────────────────
create table if not exists public.lessons (
  id                   uuid default gen_random_uuid() primary key,
  module_id            uuid references public.modules(id) on delete cascade not null,
  course_id            uuid references public.courses(id) on delete cascade not null,
  title                text not null,
  content_text         text,
  -- Path within the 'course-videos' private bucket, e.g. courses/abc123/lesson-01.mp4
  -- Never store a full signed URL here — sign server-side on demand.
  video_storage_path   text,
  duration_minutes     integer default 0,
  is_preview           boolean default false,
  order_index          integer not null default 0,
  created_at           timestamptz default now()
);

-- Add columns to existing lessons table if it was created before this migration
alter table public.lessons add column if not exists course_id uuid references public.courses(id) on delete cascade;
alter table public.lessons add column if not exists video_storage_path text;
alter table public.lessons add column if not exists is_preview boolean default false;
alter table public.lessons add column if not exists content_text text;

alter table public.lessons enable row level security;

-- Everyone can see lesson metadata (title, duration).
-- The video itself is gated by the edge function.
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'lessons'
      and policyname = 'Anyone can view lessons for active courses'
  ) then
    create policy "Anyone can view lessons for active courses"
      on public.lessons for select
      using (exists (
        select 1 from public.courses c
        where c.id = course_id and c.is_active = true
      ));
  end if;
end $$;

create index if not exists lessons_module_id_idx  on public.lessons(module_id);
create index if not exists lessons_course_id_idx  on public.lessons(course_id);

-- ── Quizzes ────────────────────────────────────────────────────
create table if not exists public.quizzes (
  id          uuid default gen_random_uuid() primary key,
  module_id   uuid references public.modules(id) on delete cascade not null,
  course_id   uuid references public.courses(id) on delete cascade not null,
  title       text not null,
  order_index integer not null default 0,
  created_at  timestamptz default now()
);

-- Add course_id to existing quizzes table if it was created before this migration
alter table public.quizzes add column if not exists course_id uuid references public.courses(id) on delete cascade;

alter table public.quizzes enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'quizzes'
      and policyname = 'Anyone can view quizzes for active courses'
  ) then
    create policy "Anyone can view quizzes for active courses"
      on public.quizzes for select
      using (exists (
        select 1 from public.courses c
        where c.id = course_id and c.is_active = true
      ));
  end if;
end $$;

create index if not exists quizzes_module_id_idx on public.quizzes(module_id);

-- ── User Progress ──────────────────────────────────────────────
create table if not exists public.user_progress (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  course_id    uuid references public.courses(id) on delete cascade not null,
  lesson_id    uuid references public.lessons(id) on delete cascade,
  quiz_id      uuid references public.quizzes(id) on delete cascade,
  completed_at timestamptz default now(),
  -- one row per user+lesson and one per user+quiz
  constraint progress_lesson_unique unique (user_id, lesson_id),
  constraint progress_quiz_unique   unique (user_id, quiz_id),
  constraint progress_has_target    check (lesson_id is not null or quiz_id is not null)
);

-- Add course_id to existing user_progress table if it was created before this migration
alter table public.user_progress add column if not exists course_id uuid references public.courses(id) on delete cascade;

alter table public.user_progress enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_progress'
      and policyname = 'Users can view own progress'
  ) then
    create policy "Users can view own progress"
      on public.user_progress for select using (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_progress'
      and policyname = 'Users can insert own progress'
  ) then
    create policy "Users can insert own progress"
      on public.user_progress for insert with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_progress'
      and policyname = 'Users can update own progress'
  ) then
    create policy "Users can update own progress"
      on public.user_progress for update using (auth.uid() = user_id);
  end if;
end $$;

create index if not exists progress_user_id_idx   on public.user_progress(user_id);
create index if not exists progress_course_id_idx on public.user_progress(user_id, course_id);

-- ── Storage: course-videos (private) ───────────────────────────
-- Videos are stored here. Only the get-video-url Edge Function
-- (service role) can generate signed download URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'course-videos',
  'course-videos',
  false,           -- PRIVATE — no public URL access
  5368709120,      -- 5 GB max per file
  array['video/mp4', 'video/webm', 'video/quicktime', 'application/x-mpegURL']
)
on conflict (id) do nothing;

-- No storage policies needed for users — access is entirely through
-- the signed URLs generated by the edge function (service role).
-- Admins upload via Supabase dashboard or service role client only.
