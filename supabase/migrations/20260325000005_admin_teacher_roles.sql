-- ─────────────────────────────────────────────────────────────
-- Admin & Teacher Roles, Invites, Quiz Content, RLS
-- Order: (1) table DDL → (2) triggers/functions → (3) RLS policies → (4) views
-- ─────────────────────────────────────────────────────────────

-- ── 1. profiles: role + bio + is_active ────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student'
    CHECK (role IN ('student', 'teacher', 'admin')),
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- ── 2. teacher_invites ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.teacher_invites (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email       text NOT NULL,
  token       text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by  uuid REFERENCES auth.users(id) NOT NULL,
  expires_at  timestamptz NOT NULL DEFAULT now() + interval '7 days',
  accepted_at timestamptz,
  created_at  timestamptz DEFAULT now()
);
-- RLS enabled but no anon/authenticated policies — only service-role accesses this
ALTER TABLE public.teacher_invites ENABLE ROW LEVEL SECURITY;

-- ── 3. course_teachers ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.course_teachers (
  course_id   uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  teacher_id  uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  PRIMARY KEY (course_id, teacher_id)
);
ALTER TABLE public.course_teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view their own course assignments"
  ON public.course_teachers FOR SELECT
  USING (auth.uid() = teacher_id);

-- ── 4. courses: status + created_by ───────────────────────────
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending_review', 'active', 'archived')),
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Sync is_active with status (mobile app reads is_active)
CREATE OR REPLACE FUNCTION public.sync_course_is_active()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.is_active := (NEW.status = 'active');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_course_status_change
  BEFORE INSERT OR UPDATE OF status ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.sync_course_is_active();

-- Set created_by automatically on INSERT if not provided
CREATE OR REPLACE FUNCTION public.set_course_created_by()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_course_insert_set_created_by
  BEFORE INSERT ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_course_created_by();

-- Backfill: existing active courses get status = 'active'
UPDATE public.courses
SET status = 'active'
WHERE is_active = true AND status = 'draft';
