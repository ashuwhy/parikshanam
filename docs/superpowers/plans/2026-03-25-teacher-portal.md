# Teacher Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `apps/teacher` - a Next.js 16 teacher portal at `teach.parikshanam.com` with invite-only signup, a sidebar for managing courses (full authoring with video upload), viewing enrolled students, and editing profile.

**Architecture:** Next.js App Router with `(auth)` group (login + invite acceptance) and `(teacher)` group (protected sidebar). Teacher-scoped Supabase operations use the anon client + RLS (`teacher_owns_course()` policies). Video upload uses signed URLs via a service-role API route (`/api/upload-url`). The invite-accept flow uses a service-role API route to create the Supabase auth user and set `role = 'teacher'`.

**Tech Stack:** Next.js 16, Tailwind CSS v4, `@supabase/ssr`, React Hook Form, Zod, TanStack Table v8, Vitest, React Testing Library

**Prerequisites:**
1. DB migration plan (`2026-03-25-db-migration.md`) applied
2. Admin portal plan (`2026-03-25-admin-portal.md`) completed (teacher invite sends via admin app)

---

## File Structure

```
apps/teacher/
  package.json
  next.config.ts
  tsconfig.json
  .env.local.example
  middleware.ts                          # Session + role='teacher' guard
  src/
    app/
      globals.css                        # Same design tokens as apps/admin
      layout.tsx
      (auth)/
        login/
          page.tsx
        invite/
          page.tsx                       # Token verify + password setup
      (teacher)/
        layout.tsx                       # Sidebar wrapper
        page.tsx                         # → redirect to /dashboard
        dashboard/
          page.tsx
        courses/
          page.tsx
          new/
            page.tsx
          [id]/
            page.tsx                     # Course editor
        students/
          page.tsx
        profile/
          page.tsx
      api/
        invites/
          verify/
            route.ts                     # GET ?token= - verify token
          accept/
            route.ts                     # POST - create user + set role
        upload-url/
          route.ts                       # POST - signed upload URL
        lessons/
          [id]/
            route.ts                     # PATCH video_storage_path
    components/
      Sidebar.tsx
      StatCard.tsx
      DataTable.tsx
      CourseForm.tsx
      LessonEditor.tsx
      VideoUpload.tsx
    lib/
      supabase/
        client.ts
        server.ts
        admin.ts
      types.ts
    __tests__/
      api/
        invites.test.ts
        upload-url.test.ts
```

> **Note:** `Sidebar`, `StatCard`, `DataTable`, `CourseForm`, `LessonEditor`, and `VideoUpload` are identical in structure to `apps/admin`. Copy and adapt - the core logic is the same; the teacher versions operate under RLS rather than service role.

---

### Task 1: Scaffold the Next.js app

**Files:**
- Create: `apps/teacher/package.json`
- Create: `apps/teacher/next.config.ts`
- Create: `apps/teacher/tsconfig.json`
- Create: `apps/teacher/src/app/globals.css`
- Create: `apps/teacher/src/app/layout.tsx`

- [ ] **Step 1.1: Create `package.json`**

Same as `apps/admin/package.json` but:
- Name: `@parikshanam/teacher`
- Dev port: `3003`
- Remove `resend` from dependencies (teacher app doesn't send emails)

```json
{
  "name": "@parikshanam/teacher",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3003",
    "build": "next build",
    "start": "next start -p 3003",
    "lint": "tsc --noEmit",
    "test": "vitest"
  },
  "dependencies": {
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.49.4",
    "@tanstack/react-table": "^8.21.3",
    "next": "15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@hookform/resolvers": "^3.9.1",
    "react-hook-form": "^7.55.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@testing-library/react": "^16.3.0",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.0.15",
    "typescript": "^5",
    "vitest": "^3.1.1",
    "jsdom": "^26.0.0",
    "@testing-library/jest-dom": "^6.6.3"
  }
}
```

- [ ] **Step 1.2: Create `next.config.ts`, `tsconfig.json`, `globals.css`, `layout.tsx`**

Copy verbatim from `apps/admin`:
- `next.config.ts` - identical
- `tsconfig.json` - identical
- `src/app/globals.css` - identical
- `src/app/layout.tsx` - change `metadata.title` to `'Parikshanam - Teacher Portal'`

- [ ] **Step 1.3: Create `.env.local.example`**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Copy to `.env.local` and fill from Supabase dashboard.

- [ ] **Step 1.4: Install and verify**

```bash
cd apps/teacher && pnpm install && pnpm dev
```

Open http://localhost:3003 - expect 404 or blank page.

- [ ] **Step 1.5: Commit**

```bash
git add apps/teacher
git commit -m "feat(teacher): scaffold Next.js teacher app"
```

---

### Task 2: Supabase clients + types

**Files:**
- Create: `apps/teacher/src/lib/supabase/client.ts`
- Create: `apps/teacher/src/lib/supabase/server.ts`
- Create: `apps/teacher/src/lib/supabase/admin.ts`
- Create: `apps/teacher/src/lib/types.ts`

- [ ] **Step 2.1: Copy client helpers from `apps/admin`**

All three files (`client.ts`, `server.ts`, `admin.ts`) are **identical** to `apps/admin/src/lib/supabase/`. Copy them as-is.

- [ ] **Step 2.2: Copy types**

`types.ts` is identical to `apps/admin/src/lib/types.ts`. Copy as-is.

- [ ] **Step 2.3: Commit**

```bash
git add apps/teacher/src/lib
git commit -m "feat(teacher): add supabase client helpers and types"
```

---

### Task 3: Auth middleware + login page

**Files:**
- Create: `apps/teacher/middleware.ts`
- Create: `apps/teacher/src/app/(auth)/login/page.tsx`

- [ ] **Step 3.1: Create `middleware.ts`**

Same structure as admin middleware, but checks `role = 'teacher'`. Also allow `/invite` path through unauthenticated:

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/login') || pathname.startsWith('/invite') || pathname.startsWith('/api')) {
    return supabaseResponse
  }

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'teacher') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

- [ ] **Step 3.2: Create login page**

Same structure as admin login, but label changes:

```tsx
'use client'
// ... (copy from apps/admin login page)
// Change:
//   "⬡ ADMIN" badge → "📖 TEACHER" badge (bg-brand-teal)
//   "Admin Panel" subtitle → "Teacher Portal"
//   redirect after login → '/dashboard'
```

- [ ] **Step 3.3: Verify login renders at http://localhost:3003/login**

- [ ] **Step 3.4: Commit**

```bash
git add apps/teacher/middleware.ts apps/teacher/src/app/\(auth\)/login
git commit -m "feat(teacher): middleware role guard and login page"
```

---

### Task 4: Invite acceptance flow

**Files:**
- Create: `apps/teacher/src/app/api/invites/verify/route.ts`
- Create: `apps/teacher/src/app/api/invites/accept/route.ts`
- Create: `apps/teacher/src/app/(auth)/invite/page.tsx`

- [ ] **Step 4.1: Write tests for invite API routes**

Create `src/__tests__/api/invites.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('GET /api/invites/verify', () => {
  it('returns 400 when token is missing', async () => {
    const { GET } = await import('@/app/api/invites/verify/route')
    const req = new Request('http://localhost/api/invites/verify')
    const res = await GET(req)
    expect(res.status).toBe(400)
  })
})

describe('POST /api/invites/accept', () => {
  it('returns 400 when token or password is missing', async () => {
    const { POST } = await import('@/app/api/invites/accept/route')
    const req = new Request('http://localhost/api/invites/accept', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
```

Run: `pnpm test` - expect FAIL.

- [ ] **Step 4.2: Create verify route**

```ts
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ valid: false, reason: 'token required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: invite, error } = await admin
    .from('teacher_invites')
    .select('id, email, expires_at, accepted_at')
    .eq('token', token)
    .single()

  if (error || !invite) {
    return NextResponse.json({ valid: false, reason: 'invalid token' }, { status: 404 })
  }

  if (invite.accepted_at) {
    return NextResponse.json({ valid: false, reason: 'already used' })
  }

  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, reason: 'expired' })
  }

  return NextResponse.json({ valid: true, email: invite.email })
}
```

- [ ] **Step 4.3: Create accept route**

```ts
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { token, password, fullName } = body

  if (!token || !password) {
    return NextResponse.json({ error: 'token and password required' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Re-verify token (not expired, not used)
  const { data: invite } = await admin
    .from('teacher_invites')
    .select('id, email, accepted_at, expires_at')
    .eq('token', token)
    .single()

  if (!invite || invite.accepted_at || new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'invalid or expired token' }, { status: 400 })
  }

  // Create the Supabase auth user
  const { data: authData, error: createError } = await admin.auth.admin.createUser({
    email: invite.email,
    password,
    email_confirm: true,
  })

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 })
  }

  const userId = authData.user.id

  // The handle_new_user trigger already created a profiles row with role='student'
  // Update it to teacher and set the name
  await admin
    .from('profiles')
    .update({ role: 'teacher', full_name: fullName ?? null })
    .eq('id', userId)

  // Mark invite as accepted
  await admin
    .from('teacher_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)

  return NextResponse.json({ ok: true, email: invite.email })
}
```

- [ ] **Step 4.4: Run tests - expect PASS**

```bash
pnpm test
```

- [ ] **Step 4.5: Create invite page**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type State = 'loading' | 'valid' | 'invalid' | 'submitting' | 'done'

export default function InvitePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const router = useRouter()
  const supabase = createClient()

  const [state, setState] = useState<State>('loading')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (!token) { setState('invalid'); setReason('No token provided'); return }
    fetch(`/api/invites/verify?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) { setEmail(data.email); setState('valid') }
        else { setState('invalid'); setReason(data.reason ?? 'Invalid invite') }
      })
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('submitting')
    setError(null)

    const res = await fetch('/api/invites/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, fullName: name }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setState('valid')
      return
    }

    // Sign in the new teacher
    await supabase.auth.signInWithPassword({ email, password })
    setState('done')
    router.push('/dashboard')
  }

  if (state === 'loading') return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Verifying invite…</p>
    </div>
  )

  if (state === 'invalid') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 border border-ui-border max-w-sm text-center">
        <p className="text-2xl mb-2">⚠️</p>
        <h1 className="font-[family-name:var(--font-nunito-var)] font-black text-brand-navy text-xl mb-2">Invalid Invite</h1>
        <p className="text-gray-500 text-sm">{reason}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white rounded-2xl p-8 border border-ui-border w-full max-w-sm shadow-sm">
        <div className="mb-6 text-center">
          <div className="inline-block bg-brand-teal text-white text-xs font-bold px-3 py-1 rounded-lg mb-3">
            📖 TEACHER
          </div>
          <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">Set up your account</h1>
          <p className="text-sm text-gray-400 mt-1">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={state === 'submitting'}
            className="w-full bg-brand-primary text-white font-bold rounded-xl py-2.5 border-b-4 border-brand-dark disabled:opacity-60"
          >
            {state === 'submitting' ? 'Creating account…' : 'Accept Invitation'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 4.6: Test invite flow end-to-end**

1. Use the admin portal to send an invite to a test email
2. Click the link in the email - opens `/invite?token=...`
3. Page should show "Set up your account" with pre-filled email
4. Enter name + password, submit
5. Confirm redirect to `/dashboard`
6. Verify `profiles` row has `role = 'teacher'` and `accepted_at` is set in `teacher_invites`

- [ ] **Step 4.7: Commit**

```bash
git add apps/teacher/src/app/api/invites apps/teacher/src/app/\(auth\)/invite
git commit -m "feat(teacher): invite acceptance flow - verify token and create account"
```

---

### Task 5: Sidebar layout + shell pages

**Files:**
- Create: `apps/teacher/src/components/Sidebar.tsx`
- Create: `apps/teacher/src/app/(teacher)/layout.tsx`
- Create: `apps/teacher/src/app/(teacher)/page.tsx`
- Create shell pages for dashboard, courses, students, profile

- [ ] **Step 5.1: Create `Sidebar.tsx`**

Copy from `apps/admin` Sidebar, changing:
- Badge: `"📖 TEACHER"` with `bg-brand-teal`
- Nav items:
  ```ts
  const NAV = [
    { href: '/dashboard', label: '📊 Dashboard' },
    { href: '/courses', label: '📚 My Courses' },
    { href: '/students', label: '👨‍🎓 My Students' },
    { href: '/profile', label: '👤 Profile' },
  ]
  ```

- [ ] **Step 5.2: Create `(teacher)/layout.tsx` and `page.tsx`**

Same pattern as admin:

```tsx
// layout.tsx
import { Sidebar } from '@/components/Sidebar'
export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-background overflow-auto">{children}</main>
    </div>
  )
}
```

```tsx
// page.tsx
import { redirect } from 'next/navigation'
export default function Root() { redirect('/dashboard') }
```

- [ ] **Step 5.3: Create shell pages**

For `dashboard`, `courses`, `students`, `profile` - same boilerplate as admin shells.

- [ ] **Step 5.4: Verify navigation**

Log in as a teacher (using the test account created in Task 4). Confirm sidebar renders with teal badge and all 4 nav items.

- [ ] **Step 5.5: Commit**

```bash
git add apps/teacher/src/components apps/teacher/src/app/\(teacher\)
git commit -m "feat(teacher): sidebar layout and shell pages"
```

---

### Task 6: Teacher dashboard

**Files:**
- Modify: `apps/teacher/src/app/(teacher)/dashboard/page.tsx`

- [ ] **Step 6.1: Copy `StatCard` from admin**

Create `apps/teacher/src/components/StatCard.tsx` - identical to admin version.

- [ ] **Step 6.2: Build dashboard page**

```tsx
import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/StatCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Resolve all course IDs this teacher owns or is assigned to
  const { data: assignedRows } = await supabase
    .from('course_teachers')
    .select('course_id')
    .eq('teacher_id', user!.id)

  const assignedIds = assignedRows?.map((r) => r.course_id) ?? []
  const myCourseFilter = assignedIds.length
    ? `created_by.eq.${user!.id},id.in.(${assignedIds.join(',')})`
    : `created_by.eq.${user!.id}`

  const { data: myCourses } = await supabase
    .from('courses')
    .select('id, title, status')
    .or(myCourseFilter)

  const allCourseIds = myCourses?.map((c) => c.id) ?? []
  const pendingCourses = myCourses?.filter((c) => c.status === 'pending_review') ?? []

  const [{ count: studentCount }, { count: lessonCount }] = await Promise.all([
    supabase.from('purchases').select('*', { count: 'exact', head: true }).in('course_id', allCourseIds),
    supabase.from('lessons').select('*', { count: 'exact', head: true }).in('course_id', allCourseIds),
  ])

  const courseCount = myCourses?.length ?? 0

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="My Courses" value={courseCount ?? 0} />
        <StatCard label="Enrolled Students" value={studentCount ?? 0} />
        <StatCard label="Lessons Published" value={lessonCount ?? 0} />
        <StatCard label="Pending Review" value={pendingCourses?.length ?? 0} accent />
      </div>

      {pendingCourses && pendingCourses.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-amber-800 mb-3">
            Awaiting Admin Approval
          </h2>
          <ul className="space-y-2">
            {pendingCourses.map((c) => (
              <li key={c.id} className="flex items-center justify-between text-sm">
                <span>{c.title}</span>
                <a href={`/courses/${c.id}`} className="text-amber-700 font-medium hover:underline">View →</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 6.3: Commit**

```bash
git add apps/teacher/src/app/\(teacher\)/dashboard apps/teacher/src/components/StatCard.tsx
git commit -m "feat(teacher): dashboard with stats and pending approvals"
```

---

### Task 7: Video upload API + shared components

**Files:**
- Create: `apps/teacher/src/app/api/upload-url/route.ts`
- Create: `apps/teacher/src/app/api/lessons/[id]/route.ts`
- Create: `apps/teacher/src/components/VideoUpload.tsx`
- Create: `apps/teacher/src/components/DataTable.tsx`

- [ ] **Step 7.1: Write test for upload-url route**

Create `src/__tests__/api/upload-url.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('POST /api/upload-url', () => {
  it('returns 400 when courseId is missing', async () => {
    const { POST } = await import('@/app/api/upload-url/route')
    const req = new Request('http://localhost/api/upload-url', {
      method: 'POST',
      body: JSON.stringify({ mimeType: 'video/mp4' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
```

Run: `pnpm test` - expect FAIL.

- [ ] **Step 7.2: Copy upload-url route and lessons PATCH route from admin**

Both routes are **identical** to `apps/admin`. Copy as-is:
- `src/app/api/upload-url/route.ts`
- `src/app/api/lessons/[id]/route.ts`

- [ ] **Step 7.3: Run test - expect PASS**

```bash
pnpm test
```

- [ ] **Step 7.4: Copy `VideoUpload.tsx` and `DataTable.tsx` from admin**

Both components are **identical** to `apps/admin`. Copy as-is.

- [ ] **Step 7.5: Commit**

```bash
git add apps/teacher/src/app/api apps/teacher/src/components
git commit -m "feat(teacher): video upload route and shared UI components"
```

---

### Task 8: My Courses - list, create, edit

**Files:**
- Create: `apps/teacher/src/components/CourseForm.tsx`
- Create: `apps/teacher/src/components/LessonEditor.tsx`
- Modify: `apps/teacher/src/app/(teacher)/courses/page.tsx`
- Create: `apps/teacher/src/app/(teacher)/courses/new/page.tsx`
- Create: `apps/teacher/src/app/(teacher)/courses/[id]/page.tsx`

- [ ] **Step 8.1: Copy `CourseForm.tsx` from admin**

`CourseForm.tsx` is **identical**. Copy as-is.

- [ ] **Step 8.2: Copy `LessonEditor.tsx` from admin**

`LessonEditor.tsx` is **identical** (uses anon client which is fine - teacher RLS policies allow it). Copy as-is.

- [ ] **Step 8.3: Build My Courses list page**

```tsx
import { createClient } from '@/lib/supabase/server'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'
import type { Course } from '@/lib/types'

const col = createColumnHelper<Course>()
const columns = [
  col.accessor('title', { header: 'Title', cell: (i) => (
    <Link href={`/courses/${i.row.original.id}`} className="text-brand-primary font-medium hover:underline">
      {i.getValue()}
    </Link>
  )}),
  col.accessor('status', { header: 'Status', cell: (i) => (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
      i.getValue() === 'active' ? 'bg-green-100 text-green-700' :
      i.getValue() === 'pending_review' ? 'bg-amber-100 text-amber-700' :
      'bg-gray-100 text-gray-600'
    }`}>{i.getValue()}</span>
  )}),
  col.accessor('price', { header: 'Price', cell: (i) => `₹${i.getValue()}` }),
]

export default async function MyCoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get courses I created OR am assigned to via course_teachers
  const { data: assignedIds } = await supabase
    .from('course_teachers')
    .select('course_id')
    .eq('teacher_id', user!.id)

  const assignedCourseIds = assignedIds?.map((r) => r.course_id) ?? []

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .or(`created_by.eq.${user!.id}${assignedCourseIds.length ? `,id.in.(${assignedCourseIds.join(',')})` : ''}`)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">My Courses</h1>
        <Link href="/courses/new" className="bg-brand-primary text-white text-sm font-bold px-4 py-2 rounded-xl border-b-4 border-brand-dark">
          + New Course
        </Link>
      </div>
      <DataTable columns={columns} data={courses ?? []} />
    </div>
  )
}
```

- [ ] **Step 8.4: Build new course page**

```tsx
import { createClient } from '@/lib/supabase/server'
import { CourseForm } from '@/components/CourseForm'
import { redirect } from 'next/navigation'
import type { CourseFormData } from '@/components/CourseForm'

export default async function NewCoursePage() {
  const supabase = await createClient()
  const [{ data: olympiadTypes }, { data: classLevels }] = await Promise.all([
    supabase.from('olympiad_types').select('id, label').order('label'),
    supabase.from('class_levels').select('id, label').order('id'),
  ])

  async function createCourse(data: CourseFormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: course, error } = await supabase.from('courses').insert({
      ...data,
      status: 'pending_review',
      created_by: user!.id,
    }).select('id').single()
    if (error) throw new Error(error.message)
    redirect(`/courses/${course.id}`)
  }

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-2">New Course</h1>
      <p className="text-sm text-amber-600 mb-6 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        Your course will be submitted for admin review before going live.
      </p>
      <CourseForm
        olympiadTypes={olympiadTypes ?? []}
        classLevels={classLevels ?? []}
        onSubmit={createCourse}
        submitLabel="Submit for Review"
      />
    </div>
  )
}
```

- [ ] **Step 8.5: Build course editor page**

```tsx
import { createClient } from '@/lib/supabase/server'
import { LessonEditor } from '@/components/LessonEditor'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CourseEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: course } = await supabase.from('courses').select('*').eq('id', id).single()
  if (!course) notFound()

  const { data: modules } = await supabase
    .from('modules')
    .select('*, lessons(*)')
    .eq('course_id', id)
    .order('order_index')

  return (
    <div>
      <Link href="/courses" className="text-sm text-gray-400 hover:text-brand-primary mb-4 inline-block">← My Courses</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">{course.title}</h1>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          course.status === 'active' ? 'bg-green-100 text-green-700' :
          course.status === 'pending_review' ? 'bg-amber-100 text-amber-700' :
          'bg-gray-100 text-gray-600'
        }`}>{course.status}</span>
      </div>
      <LessonEditor courseId={id} modules={modules ?? []} />
    </div>
  )
}
```

- [ ] **Step 8.6: Test full course creation flow**

1. Log in as teacher, go to `/courses/new`
2. Fill form, submit → confirm redirect to course detail
3. Verify course in Supabase with `status = 'pending_review'`
4. Add a module and lesson, upload a test video
5. Confirm `video_storage_path` saved to `lessons` table

- [ ] **Step 8.7: Commit**

```bash
git add apps/teacher/src/components/CourseForm.tsx apps/teacher/src/components/LessonEditor.tsx
git add apps/teacher/src/app/\(teacher\)/courses
git commit -m "feat(teacher): my courses list, create, and editor with video upload"
```

---

### Task 9: My Students page

**Files:**
- Modify: `apps/teacher/src/app/(teacher)/students/page.tsx`

- [ ] **Step 9.1: Build students page**

```tsx
import { createClient } from '@/lib/supabase/server'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'

const col = createColumnHelper<any>()
const columns = [
  col.accessor('profile.full_name', { header: 'Student', cell: (i) => i.getValue() ?? '-' }),
  col.accessor('course.title', { header: 'Course', cell: (i) => i.getValue() ?? '-' }),
  col.accessor('status', { header: 'Payment', cell: (i) => i.getValue() }),
  col.accessor('created_at', { header: 'Enrolled', cell: (i) => new Date(i.getValue()).toLocaleDateString('en-IN') }),
]

export default async function MyStudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get all course IDs this teacher owns
  const { data: myCourses } = await supabase
    .from('courses')
    .select('id')
    .eq('created_by', user!.id)

  const courseIds = myCourses?.map((c) => c.id) ?? []

  const { data: purchases } = await supabase
    .from('purchases')
    .select('*, profile:profiles(full_name), course:courses(title)')
    .in('course_id', courseIds)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">
        My Students ({purchases?.length ?? 0})
      </h1>
      <DataTable columns={columns} data={purchases ?? []} />
    </div>
  )
}
```

- [ ] **Step 9.2: Commit**

```bash
git add apps/teacher/src/app/\(teacher\)/students
git commit -m "feat(teacher): my students page"
```

---

### Task 10: Profile page

**Files:**
- Modify: `apps/teacher/src/app/(teacher)/profile/page.tsx`

- [ ] **Step 10.1: Build profile page**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  full_name: z.string().min(1),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
})
type FormData = z.infer<typeof schema>

export default function ProfilePage() {
  const supabase = createClient()
  const [saved, setSaved] = useState(false)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('full_name, bio, avatar_url').eq('id', user.id).single()
        .then(({ data }) => { if (data) reset(data) })
    })
  }, [])

  async function onSubmit(formData: FormData) {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update(formData).eq('id', user!.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input {...register('full_name')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea {...register('bio')} rows={3} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Avatar URL</label>
          <input {...register('avatar_url')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" placeholder="https://..." />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-primary text-white font-bold rounded-xl px-6 py-2.5 border-b-4 border-brand-dark disabled:opacity-60"
        >
          {saved ? '✓ Saved' : isSubmitting ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 10.2: Commit**

```bash
git add apps/teacher/src/app/\(teacher\)/profile
git commit -m "feat(teacher): profile edit page"
```

---

### Task 11: Run all tests + final verification

- [ ] **Step 11.1: Run all tests**

```bash
cd apps/teacher && pnpm test
```

Expected: all tests PASS.

- [ ] **Step 11.2: Type check**

```bash
pnpm lint
```

Expected: no TypeScript errors.

- [ ] **Step 11.3: Production build**

```bash
pnpm build
```

Expected: build succeeds.

- [ ] **Step 11.4: End-to-end smoke test**

1. Admin invites teacher → teacher receives email → clicks link → sets up account → lands on dashboard ✓
2. Teacher creates course → appears in admin pending review → admin approves → course goes active ✓
3. Teacher adds module + lesson + uploads video → appears in `lessons` table ✓
4. Teacher views enrolled students ✓

- [ ] **Step 11.5: Final commit**

```bash
git add .
git commit -m "feat(teacher): complete teacher portal MVP"
```
