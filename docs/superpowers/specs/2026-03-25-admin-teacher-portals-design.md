# Admin & Teacher Portals - Design Spec

**Date:** 2026-03-25
**Project:** Parikshanam
**Status:** Approved

---

## Overview

Two new Next.js apps added to the monorepo:

| App | Subdomain | Path |
|-----|-----------|------|
| Admin Portal | admin.parikshanam.com | `apps/admin` |
| Teacher Portal | teach.parikshanam.com | `apps/teacher` |

Both use the existing Parikshanam design system (Orange `#E8720C` primary, Navy `#1B3A6E` structural, Nunito + Roboto fonts, dimensional shadows). Both connect to the same Supabase project.

---

## 1. Architecture

### Monorepo Structure

```
apps/
  admin/        ← admin.parikshanam.com (Next.js 16, Tailwind v4)
  teacher/      ← teach.parikshanam.com (Next.js 16, Tailwind v4)
  web/          ← parikshanam.com (existing)
  mobile/       ← Expo app (existing)
  api/          ← FastAPI (existing)
```

`pnpm-workspace.yaml` already uses `apps/*` glob - no change needed. `turbo.json` `pipeline` gains `dev`, `build`, `lint` entries for the two new apps (same pattern as existing apps).

Each app is an independent Next.js deployment. No shared `packages/ui` - design system tokens are co-located in each app's `globals.css` (same values as `apps/web`).

### Tech Stack (both apps)

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Auth & DB:** Supabase JS client (`@supabase/ssr`)
- **Forms:** React Hook Form + Zod
- **Tables:** TanStack Table v8
- **Email:** Resend (transactional - teacher invites, admin app only)
- **Fonts:** Nunito + Roboto (same as `apps/web`)

---

## 2. Database Changes

New migration: `supabase/migrations/YYYYMMDD_admin_teacher_roles.sql`

### `profiles` table (update)

```sql
ALTER TABLE public.profiles
  ADD COLUMN role text NOT NULL DEFAULT 'student'
    CHECK (role IN ('student', 'teacher', 'admin')),
  ADD COLUMN bio text,
  ADD COLUMN is_active boolean NOT NULL DEFAULT true;
```

The existing `handle_new_user` trigger inserts `(id, phone)` - the DEFAULT `'student'` ensures no breakage for new student signups.

Teacher accounts are created via service-role (see invite flow below), which sets `role = 'teacher'` explicitly - the trigger is not involved.

### `teacher_invites` table (new)

```sql
CREATE TABLE public.teacher_invites (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email       text NOT NULL,
  token       text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by  uuid REFERENCES auth.users(id) NOT NULL,
  expires_at  timestamptz NOT NULL DEFAULT now() + interval '7 days',
  accepted_at timestamptz,
  created_at  timestamptz DEFAULT now()
);
-- No RLS: only accessed via service-role API routes
ALTER TABLE public.teacher_invites ENABLE ROW LEVEL SECURITY;
```

Token is 64-char hex (32 random bytes via `gen_random_bytes`). Stored as plain text - it is single-use, short-lived (7 days), and generated server-side, so hashing is not required. Token lookup only happens in a service-role API route, never exposed to client.

### `course_teachers` table (new)

```sql
CREATE TABLE public.course_teachers (
  course_id    uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  teacher_id   uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_by  uuid REFERENCES auth.users(id),
  assigned_at  timestamptz DEFAULT now(),
  PRIMARY KEY (course_id, teacher_id)
);
ALTER TABLE public.course_teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view their own course assignments"
  ON public.course_teachers FOR SELECT
  USING (auth.uid() = teacher_id);
```

### `courses` table (update)

```sql
ALTER TABLE public.courses
  ADD COLUMN status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending_review', 'active', 'archived')),
  ADD COLUMN created_by uuid REFERENCES auth.users(id);

-- Keep is_active in sync with status via trigger
CREATE OR REPLACE FUNCTION sync_course_is_active()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.is_active := (NEW.status = 'active');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_course_status_change
  BEFORE INSERT OR UPDATE OF status ON public.courses
  FOR EACH ROW EXECUTE FUNCTION sync_course_is_active();
```

The existing `is_active` boolean is kept for backwards compatibility with the mobile app. The trigger keeps it in sync automatically.

### RLS Policies - Teacher Write Access

```sql
-- Teachers can view and edit their own courses
CREATE POLICY "Teachers can select own courses"
  ON public.courses FOR SELECT
  USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM public.course_teachers ct WHERE ct.course_id = id AND ct.teacher_id = auth.uid())
  );

-- Ensure created_by is always set to the inserting user (prevents silent INSERT failures)
CREATE OR REPLACE FUNCTION set_course_created_by()
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
  FOR EACH ROW EXECUTE FUNCTION set_course_created_by();

CREATE POLICY "Teachers can insert courses"
  ON public.courses FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Teachers can update own courses"
  ON public.courses FOR UPDATE
  USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM public.course_teachers ct WHERE ct.course_id = id AND ct.teacher_id = auth.uid())
  );

-- Modules: teacher can manage if they own the parent course
CREATE POLICY "Teachers can manage modules for own courses"
  ON public.modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND (
        c.created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.course_teachers ct WHERE ct.course_id = c.id AND ct.teacher_id = auth.uid())
      )
    )
  );

-- Helper function - avoids repeating the ownership subquery in every policy
CREATE OR REPLACE FUNCTION teacher_owns_course(cid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = cid AND (
      c.created_by = auth.uid() OR
      EXISTS (SELECT 1 FROM public.course_teachers ct WHERE ct.course_id = c.id AND ct.teacher_id = auth.uid())
    )
  );
$$;

CREATE POLICY "Teachers can manage own lessons"
  ON public.lessons FOR ALL USING (teacher_owns_course(course_id));

CREATE POLICY "Teachers can manage own quizzes"
  ON public.quizzes FOR ALL USING (teacher_owns_course(course_id));

CREATE POLICY "Teachers can manage own quiz questions"
  ON public.quiz_questions FOR ALL
  USING (EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = quiz_id AND teacher_owns_course(q.course_id)));

CREATE POLICY "Teachers can manage own quiz options"
  ON public.quiz_options FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.quiz_questions qq
    JOIN public.quizzes q ON q.id = qq.quiz_id
    WHERE qq.id = question_id AND teacher_owns_course(q.course_id)
  ));

-- Teachers can see progress for students enrolled in their courses
CREATE POLICY "Teachers can view progress for own course students"
  ON public.user_progress FOR SELECT
  USING (teacher_owns_course(course_id));
```

**Existing `"Anyone can view active courses"` policy:** Kept as-is. The `sync_course_is_active` trigger sets `is_active = false` for all non-`'active'` status rows, so draft/pending/archived courses remain invisible to students. Teachers gain read access to their own courses via the teacher SELECT policy (OR-union semantics), which is the intended behaviour.

**Admin operations:** All admin mutations use the Supabase service-role client in Next.js API routes - RLS is bypassed entirely.

---

## 3. Admin Portal (`apps/admin`)

### Authentication

- Email + password via Supabase Auth
- Middleware (`middleware.ts`) reads session cookie, fetches `profiles.role`, redirects to `/login` if not `'admin'`
- All data mutations use service-role client (`createClient(url, serviceRoleKey)`) in API routes under `app/api/`

### Navigation (sidebar)

```
Dashboard
Courses
Students
Teachers
Purchases
Settings
```

### Sections

#### Dashboard
- Stat cards: total students, active teachers, published courses, total revenue (₹)
- List of courses with `status = 'pending_review'` (approve/reject inline)
- Recent purchases feed (last 20)

#### Courses
- Table: all courses, filterable by status / olympiad type / class range
- Create course form: title, subtitle, description, price, MRP, thumbnail upload, `olympiad_type_id` (select from `olympiad_types`), `min_class_id` + `max_class_id` (select from `class_levels`), assign teacher
- Edit course - same form
- Course detail: manage modules → lessons (with video upload) → quizzes
- Approve / reject teacher-submitted courses (status dropdown)
- Toggle active / archive

#### Students
- Searchable table: name, phone, email, class level, join date, purchase count
- Email is sourced from `auth.users` (not in `profiles`). Admin UI queries via a Postgres view with access explicitly revoked from public roles:
  ```sql
  CREATE VIEW public.admin_user_emails
    WITH (security_barrier = true) AS
    SELECT id, email FROM auth.users;

  -- Revoke public access - only service-role (used by admin API routes) can query this
  REVOKE SELECT ON public.admin_user_emails FROM anon, authenticated;
  ```
- Student detail: profile info, edit email (`supabase.auth.admin.updateUserById(id, { email })`), purchase history, course progress
- Deactivate account (`profiles.is_active = false`)

#### Teachers
- Table: name, email, course count, joined date, active status
- Email sourced the same way as students (via `admin_user_emails` view, service-role)
- Invite teacher: enter email + name → API route creates `teacher_invites` row (token via `gen_random_bytes`) → sends Resend email
- Teacher detail: their courses, edit email, deactivate

#### Purchases
- Table: student name, course title, amount (₹), Razorpay payment ID, status, date
- Filter by date range, course, payment status
- Revenue summary: total, by course, by month

#### Settings
- Manage `class_levels` table: add/edit label, min/max age; delete (blocked if referenced by courses)
- Manage `olympiad_types` table: add/edit label + color hex; delete (blocked if referenced)

---

## 4. Teacher Portal (`apps/teacher`)

### Authentication - Invite-Only Flow

**Invite creation (admin side, `/api/invites/send` in `apps/admin`):**
1. Admin submits email + teacher name
2. API route (service role) inserts into `teacher_invites` (token auto-generated by DB default)
3. Resend email sent: `teach.parikshanam.com/invite?token=<hex-token>` with 7-day expiry warning

**Invite acceptance (teacher side, `/invite?token=...` in `apps/teacher`):**
1. Page loads token from query param, calls `/api/invites/verify` (teacher app API route, service role)
2. API verifies token exists, `accepted_at IS NULL`, `expires_at > now()` - returns `{ email, valid: true }` or `{ valid: false, reason }`
3. Teacher fills in name + password and submits
4. `/api/invites/accept` (service role):
   - Calls `supabase.auth.admin.createUser({ email, password, email_confirm: true })`
   - Updates `profiles` row: `SET role = 'teacher', full_name = ...` (trigger already created the row)
   - Marks invite: `UPDATE teacher_invites SET accepted_at = now() WHERE token = ...`
5. Teacher signed in via `signInWithPassword`, redirected to dashboard

**Returning teachers:** Standard email + password login at `/login`. Middleware checks `profiles.role = 'teacher'`.

### Navigation (sidebar)

```
Dashboard
My Courses
My Students
Profile
```

### Sections

#### Dashboard
- Stat cards: my courses (total), total enrolled students, lessons published, courses pending approval
- Pending-review courses highlighted with action to view
- Recent student activity (last 10 progress events)

#### My Courses
- List of courses where `created_by = auth.uid()` OR in `course_teachers`
- Status badge: Draft / Pending Review / Active / Archived
- Create course: title, subtitle, description, price, MRP, thumbnail URL, `olympiad_type_id`, `min_class_id` + `max_class_id`; status auto-set to `pending_review` on submit
- Course editor:
  - Module management (add, rename, reorder via drag-handle, delete)
  - Lesson management per module: title, content text, duration, `is_preview` toggle, order
  - Video upload: browser picks `.mp4`/`.webm` file → teacher app API route (`/api/upload-url`, service role) generates a Supabase Storage signed upload URL for `course-videos` bucket → client uploads directly to Storage via `PUT` with progress tracking → path `courses/<course-id>/lesson-<uuid>.mp4` saved to `lessons.video_storage_path`
  - Quiz management: add quiz to module, add questions (text + 4 options + correct answer index) - see quiz schema below

#### My Students
- Students enrolled in teacher's courses (join `purchases` + `profiles`)
- Per student: lessons completed / total, quizzes completed - read-only

#### Profile
- Edit name, bio, avatar URL
- Change email (calls `supabase.auth.updateUser({ email })`)

---

## 5. Video Upload Flow

Both admin and teacher use the same signed-URL upload pattern:

1. Client selects file (validated: mp4/webm/quicktime, max 5 GB)
2. Client calls own app's API route: `POST /api/upload-url` with `{ courseId, lessonId, mimeType }`
3. API route (service role) calls `supabase.storage.from('course-videos').createSignedUploadUrl(path)` - returns `{ signedUrl, token, path }` (`@supabase/storage-js` v2+)
4. Returns `{ signedUrl, token, path }` to client
5. Client calls `supabase.storage.from('course-videos').uploadToSignedUrl(path, token, file, { onUploadProgress })` - this is the correct client-side method; do **not** use a raw `PUT` to `signedUrl`
6. On success, client calls `PATCH /api/lessons/[id]` with `{ video_storage_path: path }`

The `course-videos` bucket remains private. No new storage INSERT policies are needed - signed upload URLs are generated server-side by service role and work without client policies.

---

## 6. Quiz Schema (new tables)

> **Migration ordering note:** The `quiz_questions` and `quiz_options` DDL below must appear **before** the RLS policies that reference them in Section 2. Write the migration file in this order: (1) `ALTER TABLE profiles`, (2) `teacher_invites`, (3) `course_teachers`, (4) `courses` alterations + trigger, (5) `quiz_questions` + `quiz_options` tables + `ENABLE ROW LEVEL SECURITY`, (6) `teacher_owns_course()` function, (7) all RLS policies, (8) `admin_user_emails` view + revokes.

```sql
CREATE TABLE public.quiz_questions (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id     uuid REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question    text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE public.quiz_options (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id     uuid REFERENCES public.quiz_questions(id) ON DELETE CASCADE NOT NULL,
  option_text     text NOT NULL,
  is_correct      boolean NOT NULL DEFAULT false,
  order_index     integer NOT NULL DEFAULT 0
);
```

RLS policies for both tables are defined in Section 2 (`"Teachers can manage own quiz questions"`, `"Teachers can manage own quiz options"`). Both tables require `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` in the migration.

---

## 7. Email - Teacher Invite

Sent via Resend from `apps/admin` API route (`/api/invites/send`).

**Subject:** You've been invited to teach on Parikshanam

**Body (plain + HTML):** Teacher's name, invite link (`${TEACHER_APP_URL}/invite?token=...`), expires-in notice (7 days).

`TEACHER_APP_URL` env var controls the base URL so staging vs. production work correctly.

---

## 8. Design System

Both apps share the Parikshanam visual language:

| Token | Value |
|-------|-------|
| Primary | `#E8720C` |
| Primary dark (shadow) | `#A04F08` |
| Navy | `#1B3A6E` |
| Teal | `#1B8A7A` |
| Background | `#F9F7F5` |
| Card surface | `#FFFFFF` |
| Border | `#E5E0D8` |

- **Sidebar:** Navy background, orange left-border active indicator, white text
- **Buttons:** Orange primary with `border-b-4 border-[#A04F08]` dimensional shadow
- **Cards:** White, `rounded-2xl`, warm border
- **Tables:** Alternating row tint, orange sort indicators, sticky header
- **Fonts:** Nunito (headings), Roboto (body)

---

## 9. Environment Variables

### `apps/admin/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
TEACHER_APP_URL=https://teach.parikshanam.com   # or http://localhost:3001 in dev
```

### `apps/teacher/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # needed for /api/upload-url and /api/invites/* routes
```

---

## 10. Out of Scope (MVP)

- Push notifications to students
- Analytics charts beyond stat cards
- Multi-admin support with granular permissions
- Student-facing chat or messaging
