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
  token       text NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(32), 'hex'),
  invited_by  uuid REFERENCES auth.users(id) NOT NULL,
  expires_at  timestamptz NOT NULL DEFAULT now() + interval '7 days',
  accepted_at timestamptz,
  created_at  timestamptz DEFAULT now()
);
-- RLS enabled but no anon/authenticated policies - only service-role accesses this
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

-- ── 5. quiz_questions + quiz_options ──────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id     uuid REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question    text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS quiz_questions_quiz_id_idx ON public.quiz_questions(quiz_id);

CREATE TABLE IF NOT EXISTS public.quiz_options (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id  uuid REFERENCES public.quiz_questions(id) ON DELETE CASCADE NOT NULL,
  option_text  text NOT NULL,
  is_correct   boolean NOT NULL DEFAULT false,
  order_index  integer NOT NULL DEFAULT 0
);
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS quiz_options_question_id_idx ON public.quiz_options(question_id);

-- ── 6. RLS helper ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.teacher_owns_course(cid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = cid AND (
      c.created_by = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.course_teachers ct
        WHERE ct.course_id = c.id AND ct.teacher_id = auth.uid()
      )
    )
  );
$$;

-- ── 7. Teacher RLS policies ───────────────────────────────────

-- courses
CREATE POLICY "Teachers can select own courses"
  ON public.courses FOR SELECT
  USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM public.course_teachers ct WHERE ct.course_id = id AND ct.teacher_id = auth.uid())
  );

CREATE POLICY "Teachers can insert courses"
  ON public.courses FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Teachers can update own courses"
  ON public.courses FOR UPDATE
  USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM public.course_teachers ct WHERE ct.course_id = id AND ct.teacher_id = auth.uid())
  );

-- modules
CREATE POLICY "Teachers can manage own modules"
  ON public.modules FOR ALL
  USING (public.teacher_owns_course(course_id));

-- lessons
CREATE POLICY "Teachers can manage own lessons"
  ON public.lessons FOR ALL
  USING (public.teacher_owns_course(course_id));

-- quizzes
CREATE POLICY "Teachers can manage own quizzes"
  ON public.quizzes FOR ALL
  USING (public.teacher_owns_course(course_id));

-- quiz_questions
CREATE POLICY "Teachers can manage own quiz questions"
  ON public.quiz_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      WHERE q.id = quiz_id AND public.teacher_owns_course(q.course_id)
    )
  );

-- quiz_options
CREATE POLICY "Teachers can manage own quiz options"
  ON public.quiz_options FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_questions qq
      JOIN public.quizzes q ON q.id = qq.quiz_id
      WHERE qq.id = question_id AND public.teacher_owns_course(q.course_id)
    )
  );

-- user_progress (teachers can view progress for their course students)
CREATE POLICY "Teachers can view progress for own course students"
  ON public.user_progress FOR SELECT
  USING (public.teacher_owns_course(course_id));

-- ── 8. admin_user_emails view ─────────────────────────────────
-- Exposes auth.users email to service-role only.
-- Must be queried via admin API routes - never from client.
CREATE OR REPLACE VIEW public.admin_user_emails
  WITH (security_barrier = true) AS
  SELECT id, email FROM auth.users;

REVOKE SELECT ON public.admin_user_emails FROM anon, authenticated;
