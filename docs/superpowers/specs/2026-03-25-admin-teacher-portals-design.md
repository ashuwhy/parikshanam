# Admin & Teacher Portals — Design Spec

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

Each app is an independent Next.js deployment. No shared `packages/ui` — design system tokens are co-located in each app's `globals.css` (same values as `apps/web`).

### Tech Stack (both apps)

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Auth & DB:** Supabase JS client (`@supabase/ssr`)
- **Forms:** React Hook Form + Zod
- **Tables:** TanStack Table v8
- **Email:** Resend (transactional — teacher invites)
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

### `teacher_invites` table (new)

```sql
CREATE TABLE public.teacher_invites (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email       text NOT NULL,
  token       text NOT NULL UNIQUE,
  invited_by  uuid REFERENCES auth.users(id) NOT NULL,
  expires_at  timestamptz NOT NULL DEFAULT now() + interval '7 days',
  accepted_at timestamptz,
  created_at  timestamptz DEFAULT now()
);
```

Admin-only access — no RLS needed for anon/authenticated; only service role writes, token lookup is via API route.

### `course_teachers` table (new)

```sql
CREATE TABLE public.course_teachers (
  course_id    uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  teacher_id   uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_by  uuid REFERENCES auth.users(id),
  assigned_at  timestamptz DEFAULT now(),
  PRIMARY KEY (course_id, teacher_id)
);
```

### `courses` table (update)

```sql
ALTER TABLE public.courses
  ADD COLUMN status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending_review', 'active', 'archived')),
  ADD COLUMN created_by uuid REFERENCES auth.users(id);
```

The existing `is_active` boolean is kept for backwards compatibility with the mobile app. When `status = 'active'`, `is_active` is also `true`.

### RLS Policy Updates

- **Admin operations:** Use Supabase service-role client in Next.js API routes — bypasses RLS entirely.
- **Teacher — courses:** Can SELECT/UPDATE courses where they appear in `course_teachers`. Can INSERT new courses (status defaults to `pending_review`).
- **Teacher — modules/lessons/quizzes:** Can manage rows where `course_id` is in their `course_teachers` set.
- **Teacher — student progress:** Can SELECT `user_progress` for students enrolled in their courses (via `purchases` join).

---

## 3. Admin Portal (`apps/admin`)

### Authentication

- Email + password via Supabase Auth
- Middleware checks `profiles.role = 'admin'`; redirects to `/login` if not
- All data mutations use service-role client via Next.js API routes (`/api/*`)

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
- List of courses pending admin review/approval
- Recent purchases feed (last 20)

#### Courses
- Table: all courses, filterable by status / olympiad type / class range
- Create course form (title, subtitle, description, price, MRP, thumbnail, olympiad type, class range, assign teacher)
- Edit course — same form
- Course detail page: manage modules → lessons → video upload path, quizzes
- Approve / reject teacher-submitted courses (status toggle)
- Toggle `is_active` / archive

#### Students
- Searchable table: name, phone, email, class level, join date, purchase count
- Student detail: profile info, edit email, purchase history, course progress
- Deactivate account (sets `is_active = false`)

#### Teachers
- Table: name, email, course count, joined date, status
- Invite teacher: enter email → generates signed token → sends invite email via Resend → row in `teacher_invites`
- Teacher detail: their courses, edit email, deactivate

#### Purchases
- Table: student name, course, amount, Razorpay payment ID, status, date
- Filter by date range, course, status
- Revenue summary (total, by course, by month)

#### Settings
- Manage `class_levels` (add/edit/delete)
- Manage `olympiad_types` (add/edit label + color)

---

## 4. Teacher Portal (`apps/teacher`)

### Authentication — Invite-Only Flow

1. Admin invites teacher by email (creates `teacher_invites` row, sends Resend email)
2. Email contains link: `teach.parikshanam.com/invite?token=<uuid>`
3. `/invite` page verifies token is valid + unexpired
4. Teacher sets password → Supabase `signUp` → profile created with `role = 'teacher'`
5. Token marked `accepted_at = now()`
6. Teacher redirected to dashboard

Returning teachers: standard email + password login at `/login`. Middleware checks `role = 'teacher'`.

### Navigation (sidebar)

```
Dashboard
My Courses
My Students
Profile
```

### Sections

#### Dashboard
- Stat cards: my courses (total), enrolled students, lessons published, pending approvals
- Courses with pending_review status shown prominently
- Recent student activity

#### My Courses
- List of courses where teacher is in `course_teachers` OR `created_by = teacher`
- Status badge per course: Draft / Pending Review / Active / Archived
- Create new course form (same fields as admin, status defaults to `pending_review`)
- Course editor:
  - Module management (add/reorder/delete modules)
  - Lesson management per module (title, content text, video path, duration, is_preview toggle, order)
  - Quiz management per module
  - Video: direct upload from the portal to the `course-videos` Supabase Storage bucket. Upload UI shows progress bar. File stored at `courses/<course-id>/lesson-<uuid>.mp4`. Path saved to `lessons.video_storage_path`.

#### My Students
- Students enrolled in teacher's courses (via `purchases`)
- Progress per student: lessons completed / total, quizzes completed
- Read-only

#### Profile
- Edit name, bio, avatar URL
- Change email (triggers Supabase email change)

---

## 5. Email — Teacher Invite

Sent via Resend from a Next.js API route (`/api/invites/send`).

**Subject:** You've been invited to teach on Parikshanam

**Body:** Teacher name, invite link (`teach.parikshanam.com/invite?token=...`), 7-day expiry notice.

Resend API key stored in `RESEND_API_KEY` env var (admin app only).

---

## 6. Design System

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

- **Sidebar:** Navy background, orange active indicator, white text
- **Buttons:** Orange primary with `border-b-4 border-brand-dark` dimensional shadow
- **Cards:** White, `rounded-2xl`, warm border
- **Tables:** Striped rows, orange sort indicators, sticky header
- **Fonts:** Nunito (headings), Roboto (body) — same as mobile and web

---

## 7. Environment Variables

### `apps/admin/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
```

### `apps/teacher/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

### Video Upload (Admin & Teacher)

Admin can also upload videos when editing a lesson from the Courses section. Same direct-to-Supabase-Storage upload flow. Uses Supabase service-role signed upload URL (generated by API route) to write to the private `course-videos` bucket.

## 8. Out of Scope (MVP)

- Push notifications to students from admin
- Analytics/charts beyond stat cards
- Multi-admin support with granular permissions
- Student-facing chat or messaging
