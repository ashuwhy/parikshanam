# DB Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add role-based access (student/teacher/admin), teacher invite tokens, course-teacher assignments, quiz content tables, video/lesson RLS policies, and an admin email view — all in a single idempotent Supabase migration.

**Architecture:** One new migration file with strict DDL ordering: tables first, then functions/triggers, then RLS policies, then the admin email view. All new policies follow the `teacher_owns_course()` security-definer helper pattern. No breaking changes to the mobile app — `is_active` is kept in sync via trigger.

**Tech Stack:** PostgreSQL / Supabase, `supabase` CLI, `pnpm supabase:push`

---

## File Structure

```
supabase/migrations/
  20260325000005_admin_teacher_roles.sql   ← NEW (the whole migration)
```

---

### Task 1: Create the migration file skeleton

**Files:**
- Create: `supabase/migrations/20260325000005_admin_teacher_roles.sql`

- [ ] **Step 1.1: Create the file with a section header comment**

```sql
-- ─────────────────────────────────────────────────────────────
-- Admin & Teacher Roles, Invites, Quiz Content, RLS
-- Order: (1) table DDL → (2) triggers/functions → (3) RLS policies → (4) views
-- ─────────────────────────────────────────────────────────────
```

Run: `ls supabase/migrations/` — confirm the file appears.

- [ ] **Step 1.2: Commit the empty skeleton**

```bash
git add supabase/migrations/20260325000005_admin_teacher_roles.sql
git commit -m "chore: add migration skeleton for admin/teacher roles"
```

---

### Task 2: Add `profiles` columns

**Files:**
- Modify: `supabase/migrations/20260325000005_admin_teacher_roles.sql`

- [ ] **Step 2.1: Append the `profiles` ALTER TABLE**

Add to the migration file:

```sql
-- ── 1. profiles: role + bio + is_active ────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student'
    CHECK (role IN ('student', 'teacher', 'admin')),
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
```

- [ ] **Step 2.2: Verify locally with Supabase CLI**

```bash
pnpm supabase db reset --local
```

Expected: migration runs without errors.

If no local Supabase is configured, skip reset and verify syntax with:
```bash
pnpm supabase db lint
```

- [ ] **Step 2.3: Commit**

```bash
git add supabase/migrations/20260325000005_admin_teacher_roles.sql
git commit -m "feat(db): add role, bio, is_active to profiles"
```

---

### Task 3: Add `teacher_invites` table

**Files:**
- Modify: `supabase/migrations/20260325000005_admin_teacher_roles.sql`

- [ ] **Step 3.1: Append the table DDL**

```sql
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
```

- [ ] **Step 3.2: Verify with `supabase db lint`**

- [ ] **Step 3.3: Commit**

```bash
git commit -am "feat(db): add teacher_invites table"
```

---

### Task 4: Add `course_teachers` table

**Files:**
- Modify: `supabase/migrations/20260325000005_admin_teacher_roles.sql`

- [ ] **Step 4.1: Append**

```sql
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
```

- [ ] **Step 4.2: Verify with lint**

- [ ] **Step 4.3: Commit**

```bash
git commit -am "feat(db): add course_teachers table"
```

---

### Task 5: Add `courses` status column + sync trigger

**Files:**
- Modify: `supabase/migrations/20260325000005_admin_teacher_roles.sql`

- [ ] **Step 5.1: Append**

```sql
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
```

- [ ] **Step 5.2: Verify existing courses stay visible**

After running the migration, the existing "Anyone can view active courses" SELECT policy on `courses` uses `is_active = true`. The trigger sets `is_active = true` only when `status = 'active'`. Existing courses have `is_active = true` and `status` defaulting to `'draft'`. We need to backfill:

```sql
-- Backfill: existing active courses get status = 'active'
UPDATE public.courses
SET status = 'active'
WHERE is_active = true AND status = 'draft';
```

Add this UPDATE to the migration file after the trigger definition.

- [ ] **Step 5.3: Commit**

```bash
git commit -am "feat(db): add courses.status + is_active sync trigger + backfill"
```

---

### Task 6: Add `quiz_questions` and `quiz_options` tables

**Files:**
- Modify: `supabase/migrations/20260325000005_admin_teacher_roles.sql`

These tables must exist **before** the RLS policies in Task 7 reference them.

- [ ] **Step 6.1: Append**

```sql
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
```

- [ ] **Step 6.2: Commit**

```bash
git commit -am "feat(db): add quiz_questions and quiz_options tables"
```

---

### Task 7: Add `teacher_owns_course()` helper + all teacher RLS policies

**Files:**
- Modify: `supabase/migrations/20260325000005_admin_teacher_roles.sql`

- [ ] **Step 7.1: Append the security-definer helper function**

```sql
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
```

- [ ] **Step 7.2: Append all teacher RLS policies**

```sql
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
```

- [ ] **Step 7.3: Commit**

```bash
git commit -am "feat(db): add teacher_owns_course helper + all teacher RLS policies"
```

---

### Task 8: Add `admin_user_emails` view

**Files:**
- Modify: `supabase/migrations/20260325000005_admin_teacher_roles.sql`

- [ ] **Step 8.1: Append**

```sql
-- ── 8. admin_user_emails view ─────────────────────────────────
-- Exposes auth.users email to service-role only.
-- Must be queried via admin API routes — never from client.
CREATE OR REPLACE VIEW public.admin_user_emails
  WITH (security_barrier = true) AS
  SELECT id, email FROM auth.users;

REVOKE SELECT ON public.admin_user_emails FROM anon, authenticated;
```

- [ ] **Step 8.2: Commit**

```bash
git commit -am "feat(db): add admin_user_emails view (service-role only)"
```

---

### Task 9: Push migration to remote Supabase

- [ ] **Step 9.1: Verify the full migration file is valid**

```bash
pnpm supabase db lint
```

Expected: no errors.

- [ ] **Step 9.2: Push to remote**

```bash
pnpm supabase:push
```

Expected: migration `20260325000005_admin_teacher_roles` applied successfully.

- [ ] **Step 9.3: Verify in Supabase dashboard**

Open Supabase Dashboard → Table Editor and confirm:
- `profiles` has `role`, `bio`, `is_active` columns
- `teacher_invites` table exists
- `course_teachers` table exists
- `courses` has `status` and `created_by` columns
- `quiz_questions` and `quiz_options` tables exist

Open Authentication → Policies and confirm teacher policies exist on `courses`, `modules`, `lessons`, `quizzes`, `quiz_questions`, `quiz_options`, `user_progress`.

- [ ] **Step 9.4: Final commit**

```bash
git commit -am "feat(db): complete admin/teacher roles migration" --allow-empty
```
