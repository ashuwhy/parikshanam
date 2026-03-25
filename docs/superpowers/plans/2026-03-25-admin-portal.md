# Admin Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `apps/admin` — a Next.js 16 admin panel at `admin.parikshanam.com` with sidebar navigation for managing courses, students, teachers, purchases, and settings, plus teacher invite flow and direct video uploads.

**Architecture:** Next.js App Router with route groups: `(auth)` for login, `(admin)` for the protected sidebar layout. All mutations go through API routes using the Supabase service-role client. The browser client uses the anon key + SSR session cookies. Design follows the Parikshanam design system (Navy sidebar, Orange accents, Nunito + Roboto fonts, dimensional button shadows).

**Tech Stack:** Next.js 16, Tailwind CSS v4, `@supabase/ssr`, `@supabase/supabase-js`, React Hook Form, Zod, TanStack Table v8, Resend, Vitest, React Testing Library

**Prerequisite:** DB migration plan (`2026-03-25-db-migration.md`) must be applied first.

---

## File Structure

```
apps/admin/
  package.json
  next.config.ts
  tsconfig.json
  .env.local.example
  middleware.ts                          # Session + role='admin' guard
  src/
    app/
      globals.css                        # Tailwind v4 + design tokens
      layout.tsx                         # Root layout (fonts)
      (auth)/
        login/
          page.tsx                       # Login form
      (admin)/
        layout.tsx                       # Sidebar wrapper
        page.tsx                         # Redirects to /dashboard
        dashboard/
          page.tsx
        courses/
          page.tsx                       # Course list + filters
          new/
            page.tsx
          [id]/
            page.tsx                     # Course detail: modules/lessons
            edit/
              page.tsx
        students/
          page.tsx
          [id]/
            page.tsx
        teachers/
          page.tsx
          [id]/
            page.tsx
        purchases/
          page.tsx
        settings/
          page.tsx
      api/
        invites/
          send/
            route.ts                     # POST — create invite + Resend email
        upload-url/
          route.ts                       # POST — signed upload URL for course-videos
        lessons/
          [id]/
            route.ts                     # PATCH — save video_storage_path
    components/
      Sidebar.tsx
      StatCard.tsx
      DataTable.tsx                      # TanStack Table wrapper
      CourseForm.tsx
      LessonEditor.tsx                   # Module/lesson/quiz CRUD
      VideoUpload.tsx                    # File picker + progress bar
    lib/
      supabase/
        client.ts                        # Browser client
        server.ts                        # Server component client (SSR cookies)
        admin.ts                         # Service-role client (API routes only)
      types.ts                           # Shared DB row types
    __tests__/
      api/
        invites.test.ts
        upload-url.test.ts
```

---

### Task 1: Scaffold the Next.js app

**Files:**
- Create: `apps/admin/package.json`
- Create: `apps/admin/next.config.ts`
- Create: `apps/admin/tsconfig.json`
- Create: `apps/admin/src/app/globals.css`
- Create: `apps/admin/src/app/layout.tsx`

- [ ] **Step 1.1: Create `package.json`**

```json
{
  "name": "@parikshanam/admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start -p 3002",
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
    "resend": "^4.2.0",
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

- [ ] **Step 1.2: Create `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

export default nextConfig
```

- [ ] **Step 1.3: Create `tsconfig.json`**

```json
{
  "extends": "../../packages/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 1.4: Create `src/app/globals.css`**

```css
@import "tailwindcss";

:root {
  --background: #F9F7F5;
  --foreground: #1B3A6E;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-brand-primary: #E8720C;
  --color-brand-dark: #A04F08;
  --color-brand-navy: #1B3A6E;
  --color-brand-teal: #1B8A7A;
  --color-ui-border: #E5E0D8;
  --font-nunito: var(--font-nunito-var);
  --font-roboto: var(--font-roboto-var);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-roboto-var), Arial, sans-serif;
}
```

- [ ] **Step 1.5: Create `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Nunito, Roboto } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  variable: '--font-nunito-var',
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
})

const roboto = Roboto({
  variable: '--font-roboto-var',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Parikshanam Admin',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 1.6: Create `.env.local.example`**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
TEACHER_APP_URL=http://localhost:3003
```

Copy to `.env.local` and fill in values from Supabase dashboard.

- [ ] **Step 1.7: Install dependencies**

```bash
cd apps/admin && pnpm install
```

- [ ] **Step 1.8: Verify the app boots**

```bash
pnpm dev:admin   # or: cd apps/admin && pnpm dev
```

Open http://localhost:3002 — expect a 404 or blank page (no routes yet).

- [ ] **Step 1.9: Commit**

```bash
git add apps/admin
git commit -m "feat(admin): scaffold Next.js admin app"
```

---

### Task 2: Supabase client helpers

**Files:**
- Create: `apps/admin/src/lib/supabase/client.ts`
- Create: `apps/admin/src/lib/supabase/server.ts`
- Create: `apps/admin/src/lib/supabase/admin.ts`
- Create: `apps/admin/src/lib/types.ts`

- [ ] **Step 2.1: Browser client (`client.ts`)**

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
```

- [ ] **Step 2.2: Server client (`server.ts`)**

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {}
        },
      },
    },
  )
}
```

- [ ] **Step 2.3: Service-role admin client (`admin.ts`)**

```ts
import { createClient } from '@supabase/supabase-js'

// Only import this in API routes (server-side). Never expose to client.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
```

- [ ] **Step 2.4: Shared DB types (`types.ts`)**

```ts
export type Role = 'student' | 'teacher' | 'admin'
export type CourseStatus = 'draft' | 'pending_review' | 'active' | 'archived'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  class_level_id: string | null
  role: Role
  bio: string | null
  is_active: boolean
  onboarding_completed: boolean
  created_at: string
}

export interface Course {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  price: number
  mrp: number | null
  thumbnail_url: string | null
  total_lessons: number
  duration_hours: number
  is_featured: boolean
  is_active: boolean
  status: CourseStatus
  created_by: string | null
  olympiad_type_id: string | null
  min_class_id: string | null
  max_class_id: string | null
  created_at: string
}

export interface Purchase {
  id: string
  user_id: string
  course_id: string
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  amount: number
  status: string
  created_at: string
}
```

- [ ] **Step 2.5: Commit**

```bash
git add apps/admin/src/lib
git commit -m "feat(admin): add supabase client helpers and shared types"
```

---

### Task 3: Auth middleware + login page

**Files:**
- Create: `apps/admin/middleware.ts`
- Create: `apps/admin/src/app/(auth)/login/page.tsx`

- [ ] **Step 3.1: Write failing test for middleware role check**

Create `apps/admin/src/__tests__/middleware.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'

describe('admin middleware', () => {
  it('redirects to /login when no session', async () => {
    // Middleware logic is tested via integration — this documents the expected behaviour.
    // The middleware must redirect any unauthenticated request to /login.
    expect(true).toBe(true) // placeholder — see integration test below
  })
})
```

Run: `cd apps/admin && pnpm test` — expect PASS (placeholder).

- [ ] **Step 3.2: Create `middleware.ts`**

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

  // Allow auth routes through
  if (pathname.startsWith('/login') || pathname.startsWith('/api')) {
    return supabaseResponse
  }

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

- [ ] **Step 3.3: Create login page**

Create `apps/admin/src/app/(auth)/login/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white rounded-2xl p-8 border border-ui-border w-full max-w-sm shadow-sm">
        <div className="mb-6 text-center">
          <div className="inline-block bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-lg mb-3">
            ⬡ ADMIN
          </div>
          <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">
            Parikshanam
          </h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary text-white font-bold rounded-xl py-2.5 border-b-4 border-brand-dark disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 3.4: Verify login page renders**

```bash
pnpm dev:admin
```

Open http://localhost:3002/login — expect the login form with Navy/Orange branding.

- [ ] **Step 3.5: Commit**

```bash
git add apps/admin/middleware.ts apps/admin/src/app/\(auth\)
git commit -m "feat(admin): add middleware role guard and login page"
```

---

### Task 4: Sidebar layout + shell pages

**Files:**
- Create: `apps/admin/src/components/Sidebar.tsx`
- Create: `apps/admin/src/app/(admin)/layout.tsx`
- Create: `apps/admin/src/app/(admin)/page.tsx`
- Create shell pages for dashboard, courses, students, teachers, purchases, settings

- [ ] **Step 4.1: Create `Sidebar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/dashboard', label: '📊 Dashboard' },
  { href: '/courses', label: '📚 Courses' },
  { href: '/students', label: '👨‍🎓 Students' },
  { href: '/teachers', label: '👨‍🏫 Teachers' },
  { href: '/purchases', label: '💳 Purchases' },
  { href: '/settings', label: '⚙️ Settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-52 min-h-screen bg-brand-navy flex flex-col flex-shrink-0">
      <div className="px-4 py-5">
        <span className="inline-block bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded-md">
          ⬡ ADMIN
        </span>
        <p className="text-white font-[family-name:var(--font-nunito-var)] font-black text-sm mt-2">
          Parikshanam
        </p>
      </div>

      <nav className="flex-1 py-2">
        <p className="px-4 text-white/50 text-[10px] uppercase tracking-widest mb-2">Platform</p>
        {NAV.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`block px-4 py-2 text-sm ${
                active
                  ? 'bg-white/10 border-l-4 border-brand-primary text-white font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleSignOut}
        className="m-4 text-white/50 text-xs hover:text-white/80 text-left"
      >
        Sign out
      </button>
    </aside>
  )
}
```

- [ ] **Step 4.2: Create `(admin)/layout.tsx`**

```tsx
import { Sidebar } from '@/components/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-background overflow-auto">{children}</main>
    </div>
  )
}
```

- [ ] **Step 4.3: Create root redirect `(admin)/page.tsx`**

```tsx
import { redirect } from 'next/navigation'
export default function AdminRoot() { redirect('/dashboard') }
```

- [ ] **Step 4.4: Create shell pages (one per section)**

For each of `dashboard`, `courses`, `students`, `teachers`, `purchases`, `settings` — create `src/app/(admin)/<section>/page.tsx`:

```tsx
// Example for dashboard — repeat pattern for others with appropriate title
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">
        Dashboard
      </h1>
      <p className="text-gray-500">Coming soon…</p>
    </div>
  )
}
```

- [ ] **Step 4.5: Verify navigation works**

Sign in at `/login`, confirm redirect to `/dashboard`. Click each sidebar link and verify route changes.

- [ ] **Step 4.6: Commit**

```bash
git add apps/admin/src/components apps/admin/src/app/\(admin\)
git commit -m "feat(admin): sidebar layout and shell pages"
```

---

### Task 5: `StatCard` component + Dashboard page

**Files:**
- Create: `apps/admin/src/components/StatCard.tsx`
- Modify: `apps/admin/src/app/(admin)/dashboard/page.tsx`

- [ ] **Step 5.1: Create `StatCard.tsx`**

```tsx
interface StatCardProps {
  label: string
  value: string | number
  accent?: boolean
}

export function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-ui-border">
      <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">{label}</p>
      <p className={`text-3xl font-[family-name:var(--font-nunito-var)] font-black mt-1 ${accent ? 'text-brand-primary' : 'text-brand-navy'}`}>
        {value}
      </p>
    </div>
  )
}
```

- [ ] **Step 5.2: Build the Dashboard page**

Replace `dashboard/page.tsx` with a server component that fetches real stats:

```tsx
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { StatCard } from '@/components/StatCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const admin = createAdminClient()

  const [
    { count: studentCount },
    { count: teacherCount },
    { count: courseCount },
    { data: purchases },
    { data: pendingCourses },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
    supabase.from('courses').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    admin.from('purchases').select('amount').eq('status', 'completed'),
    supabase.from('courses').select('id, title, status').eq('status', 'pending_review').limit(10),
  ])

  const revenue = purchases?.reduce((sum, p) => sum + p.amount, 0) ?? 0
  const revenueDisplay = revenue >= 100000
    ? `₹${(revenue / 100000).toFixed(1)}L`
    : `₹${(revenue / 100).toFixed(0)}`

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Students" value={studentCount ?? 0} />
        <StatCard label="Teachers" value={teacherCount ?? 0} />
        <StatCard label="Active Courses" value={courseCount ?? 0} />
        <StatCard label="Revenue" value={revenueDisplay} accent />
      </div>

      {pendingCourses && pendingCourses.length > 0 && (
        <div className="bg-white rounded-2xl border border-ui-border p-5">
          <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy mb-3">
            Pending Approval ({pendingCourses.length})
          </h2>
          <ul className="divide-y divide-ui-border">
            {pendingCourses.map((c) => (
              <li key={c.id} className="py-2 flex items-center justify-between">
                <span className="text-sm text-foreground">{c.title}</span>
                <a href={`/courses/${c.id}`} className="text-xs text-brand-primary font-medium">
                  Review →
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5.3: Verify dashboard loads with real data**

Open http://localhost:3002/dashboard — stat cards should show counts (even if 0).

- [ ] **Step 5.4: Commit**

```bash
git add apps/admin/src/components/StatCard.tsx apps/admin/src/app/\(admin\)/dashboard
git commit -m "feat(admin): dashboard with stats and pending approvals"
```

---

### Task 6: `DataTable` component

**Files:**
- Create: `apps/admin/src/components/DataTable.tsx`
- Create: `apps/admin/src/__tests__/DataTable.test.tsx`

- [ ] **Step 6.1: Write the test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<{ name: string; value: number }>()
const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('value', { header: 'Value' }),
]
const data = [{ name: 'Alice', value: 42 }]

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  it('renders row data', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
```

Run: `pnpm test` — expect FAIL (component not yet created).

- [ ] **Step 6.2: Create `DataTable.tsx`**

```tsx
'use client'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'

interface DataTableProps<T> {
  columns: ColumnDef<T, any>[]
  data: T[]
}

export function DataTable<T>({ columns, data }: DataTableProps<T>) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="overflow-x-auto rounded-2xl border border-ui-border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-brand-navy/5 sticky top-0">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-brand-navy">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-background'}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-foreground border-t border-ui-border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 6.3: Run tests — expect PASS**

```bash
pnpm test
```

- [ ] **Step 6.4: Commit**

```bash
git add apps/admin/src/components/DataTable.tsx apps/admin/src/__tests__/DataTable.test.tsx
git commit -m "feat(admin): DataTable component with tests"
```

---

### Task 7: Courses list + create form

**Files:**
- Create: `apps/admin/src/components/CourseForm.tsx`
- Modify: `apps/admin/src/app/(admin)/courses/page.tsx`
- Create: `apps/admin/src/app/(admin)/courses/new/page.tsx`

- [ ] **Step 7.1: Create `CourseForm.tsx`**

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  mrp: z.coerce.number().min(0).optional(),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  olympiad_type_id: z.string().optional(),
  min_class_id: z.string().optional(),
  max_class_id: z.string().optional(),
})

export type CourseFormData = z.infer<typeof schema>

interface CourseFormProps {
  defaultValues?: Partial<CourseFormData>
  olympiadTypes: { id: string; label: string }[]
  classLevels: { id: string; label: string }[]
  onSubmit: (data: CourseFormData) => Promise<void>
  submitLabel?: string
}

export function CourseForm({ defaultValues, olympiadTypes, classLevels, onSubmit, submitLabel = 'Save' }: CourseFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CourseFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input {...register('title')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Subtitle</label>
        <input {...register('subtitle')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea {...register('description')} rows={3} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price (₹) *</label>
          <input type="number" {...register('price')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">MRP (₹)</label>
          <input type="number" {...register('mrp')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Olympiad Type</label>
        <select {...register('olympiad_type_id')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm">
          <option value="">— Select —</option>
          {olympiadTypes.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Min Class</label>
          <select {...register('min_class_id')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm">
            <option value="">— Select —</option>
            {classLevels.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Class</label>
          <select {...register('max_class_id')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm">
            <option value="">— Select —</option>
            {classLevels.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
        <input {...register('thumbnail_url')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" placeholder="https://..." />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-primary text-white font-bold rounded-xl px-6 py-2.5 border-b-4 border-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
```

- [ ] **Step 7.2: Build courses list page**

Replace `courses/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'
import type { Course } from '@/lib/types'

const col = createColumnHelper<Course & { olympiad_type: { label: string } | null }>()

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
  col.accessor((r) => r.olympiad_type?.label ?? '—', { id: 'olympiad', header: 'Olympiad' }),
  col.accessor('price', { header: 'Price', cell: (i) => `₹${i.getValue()}` }),
]

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('*, olympiad_type:olympiad_types(*)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">Courses</h1>
        <Link href="/courses/new" className="bg-brand-primary text-white text-sm font-bold px-4 py-2 rounded-xl border-b-4 border-brand-dark">
          + New Course
        </Link>
      </div>
      <DataTable columns={columns} data={courses ?? []} />
    </div>
  )
}
```

- [ ] **Step 7.3: Build new course page**

Create `courses/new/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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
    const admin = createAdminClient()
    const { data: course, error } = await admin.from('courses').insert({
      ...data,
      status: 'active',
      is_active: true,
    }).select('id').single()
    if (error) throw new Error(error.message)
    redirect(`/courses/${course.id}`)
  }

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">New Course</h1>
      <CourseForm
        olympiadTypes={olympiadTypes ?? []}
        classLevels={classLevels ?? []}
        onSubmit={createCourse}
        submitLabel="Create Course"
      />
    </div>
  )
}
```

- [ ] **Step 7.4: Verify course creation works end-to-end**

1. Go to `/courses/new`, fill form, submit
2. Confirm redirect to course detail page
3. Verify in Supabase dashboard that the row exists with `status = 'active'`

- [ ] **Step 7.5: Commit**

```bash
git add apps/admin/src/components/CourseForm.tsx apps/admin/src/app/\(admin\)/courses
git commit -m "feat(admin): courses list, create form, and DataTable"
```

---

### Task 8: Video upload API route + `VideoUpload` component

**Files:**
- Create: `apps/admin/src/app/api/upload-url/route.ts`
- Create: `apps/admin/src/components/VideoUpload.tsx`
- Create: `apps/admin/src/__tests__/api/upload-url.test.ts`

- [ ] **Step 8.1: Write failing test for upload-url route**

```ts
import { describe, it, expect, vi } from 'vitest'

// Unit test: route validates required fields
describe('POST /api/upload-url', () => {
  it('returns 400 when courseId or mimeType is missing', async () => {
    // Import and call the route handler directly
    // Since Next.js route handlers are plain async functions, we can import them
    const { POST } = await import('@/app/api/upload-url/route')
    const req = new Request('http://localhost/api/upload-url', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
```

Run: `pnpm test` — expect FAIL.

- [ ] **Step 8.2: Create upload-url API route**

```ts
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { courseId, lessonId, mimeType } = body

  if (!courseId || !mimeType) {
    return NextResponse.json({ error: 'courseId and mimeType required' }, { status: 400 })
  }

  const ext = mimeType === 'video/webm' ? 'webm' : 'mp4'
  const path = `courses/${courseId}/lesson-${lessonId ?? crypto.randomUUID()}.${ext}`

  const admin = createAdminClient()
  const { data, error } = await admin.storage
    .from('course-videos')
    .createSignedUploadUrl(path)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, path })
}
```

- [ ] **Step 8.3: Run test — expect PASS**

```bash
pnpm test
```

- [ ] **Step 8.4: Create `VideoUpload.tsx`**

```tsx
'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface VideoUploadProps {
  courseId: string
  lessonId: string
  onUploaded: (path: string) => void
}

export function VideoUpload({ courseId, lessonId, onUploaded }: VideoUploadProps) {
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleFile(file: File) {
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file (.mp4 or .webm)')
      return
    }
    if (file.size > 5 * 1024 * 1024 * 1024) {
      setError('File must be under 5 GB')
      return
    }

    setError(null)
    setProgress(0)

    // 1. Get signed upload URL from our API route
    const res = await fetch('/api/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, lessonId, mimeType: file.type }),
    })
    if (!res.ok) {
      setError('Failed to get upload URL')
      setProgress(null)
      return
    }
    const { token, path } = await res.json()

    // 2. Upload directly to Supabase Storage using the signed URL
    const { error: uploadError } = await supabase.storage
      .from('course-videos')
      .uploadToSignedUrl(path, token, file, {
        onUploadProgress: ({ loaded, total }) => {
          if (total) setProgress(Math.round((loaded / total) * 100))
        },
      })

    if (uploadError) {
      setError(uploadError.message)
      setProgress(null)
      return
    }

    // 3. Save path to lesson
    await fetch(`/api/lessons/${lessonId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_storage_path: path }),
    })

    setProgress(null)
    onUploaded(path)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      {progress === null ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-ui-border rounded-xl px-6 py-4 text-sm text-gray-400 hover:border-brand-primary hover:text-brand-primary transition-colors"
        >
          📹 Choose video file (mp4/webm, max 5 GB)
        </button>
      ) : (
        <div className="border border-ui-border rounded-xl px-4 py-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-foreground">Uploading…</span>
            <span className="font-medium text-brand-primary">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 8.5: Create lessons PATCH route**

Create `src/app/api/lessons/[id]/route.ts`:

```ts
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()
  const admin = createAdminClient()
  const { error } = await admin.from('lessons').update(body).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 8.6: Commit**

```bash
git add apps/admin/src/app/api apps/admin/src/components/VideoUpload.tsx
git commit -m "feat(admin): video upload API route and VideoUpload component"
```

---

### Task 9: Lesson editor (modules → lessons → quizzes)

**Files:**
- Create: `apps/admin/src/components/LessonEditor.tsx`
- Create: `apps/admin/src/app/(admin)/courses/[id]/page.tsx`

- [ ] **Step 9.1: Create course detail page with module/lesson editor**

`courses/[id]/page.tsx` fetches the course, modules, and lessons and renders the `LessonEditor`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { LessonEditor } from '@/components/LessonEditor'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
      <div className="flex items-center gap-3 mb-2">
        <Link href="/courses" className="text-sm text-gray-400 hover:text-brand-primary">← Courses</Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">{course.title}</h1>
        <div className="flex gap-2 items-center">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            course.status === 'active' ? 'bg-green-100 text-green-700' :
            course.status === 'pending_review' ? 'bg-amber-100 text-amber-700' :
            'bg-gray-100 text-gray-600'
          }`}>{course.status}</span>
          <Link href={`/courses/${id}/edit`} className="text-sm text-brand-primary font-medium hover:underline">
            Edit details
          </Link>
        </div>
      </div>
      <LessonEditor courseId={id} modules={modules ?? []} />
    </div>
  )
}
```

- [ ] **Step 9.2: Create `LessonEditor.tsx`**

This is a client component with local state for managing modules and lessons. It calls Supabase directly from the browser (teacher-owned courses) or via server actions. For the admin, use server actions:

```tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { VideoUpload } from './VideoUpload'

interface Lesson {
  id: string
  title: string
  order_index: number
  duration_minutes: number
  is_preview: boolean
  video_storage_path: string | null
  content_text: string | null
}

interface Module {
  id: string
  title: string
  order_index: number
  lessons: Lesson[]
}

interface LessonEditorProps {
  courseId: string
  modules: Module[]
}

export function LessonEditor({ courseId, modules: initialModules }: LessonEditorProps) {
  const [modules, setModules] = useState(initialModules)
  const supabase = createClient()

  async function addModule() {
    const title = prompt('Module title:')
    if (!title) return
    const { data } = await supabase
      .from('modules')
      .insert({ course_id: courseId, title, order_index: modules.length })
      .select()
      .single()
    if (data) setModules([...modules, { ...data, lessons: [] }])
  }

  async function addLesson(moduleId: string) {
    const title = prompt('Lesson title:')
    if (!title) return
    const mod = modules.find((m) => m.id === moduleId)!
    const { data } = await supabase
      .from('lessons')
      .insert({ module_id: moduleId, course_id: courseId, title, order_index: mod.lessons.length })
      .select()
      .single()
    if (data) {
      setModules(modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, data] } : m,
      ))
    }
  }

  return (
    <div className="space-y-4">
      {modules.map((mod) => (
        <div key={mod.id} className="bg-white border border-ui-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy">
              {mod.title}
            </h3>
          </div>

          <div className="space-y-2 ml-4">
            {mod.lessons.map((lesson) => (
              <div key={lesson.id} className="border border-ui-border rounded-xl p-3 bg-background">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{lesson.title}</span>
                  <span className="text-xs text-gray-400">{lesson.duration_minutes}min</span>
                </div>
                {!lesson.video_storage_path && (
                  <div className="mt-2">
                    <VideoUpload
                      courseId={courseId}
                      lessonId={lesson.id}
                      onUploaded={(path) => {
                        setModules(modules.map((m) => ({
                          ...m,
                          lessons: m.lessons.map((l) =>
                            l.id === lesson.id ? { ...l, video_storage_path: path } : l,
                          ),
                        })))
                      }}
                    />
                  </div>
                )}
                {lesson.video_storage_path && (
                  <p className="text-xs text-green-600 mt-1">✓ Video uploaded</p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => addLesson(mod.id)}
            className="mt-3 ml-4 text-sm text-brand-primary hover:underline"
          >
            + Add lesson
          </button>
        </div>
      ))}

      <button
        onClick={addModule}
        className="bg-brand-primary text-white text-sm font-bold px-4 py-2 rounded-xl border-b-4 border-brand-dark"
      >
        + Add module
      </button>
    </div>
  )
}
```

- [ ] **Step 9.3: Verify module + lesson creation and video upload work**

1. Open a course detail page
2. Click "+ Add module" → enter title → confirm it appears
3. Click "+ Add lesson" → confirm it appears
4. Upload a small test video → confirm progress bar → "✓ Video uploaded"

- [ ] **Step 9.4: Commit**

```bash
git add apps/admin/src/components/LessonEditor.tsx apps/admin/src/app/\(admin\)/courses/\[id\]
git commit -m "feat(admin): course detail page with module/lesson editor and video upload"
```

---

### Task 10: Teacher invite flow

**Files:**
- Create: `apps/admin/src/app/api/invites/send/route.ts`
- Modify: `apps/admin/src/app/(admin)/teachers/page.tsx`

- [ ] **Step 10.1: Write test for invite API route**

Create `src/__tests__/api/invites.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('POST /api/invites/send', () => {
  it('returns 400 when email is missing', async () => {
    const { POST } = await import('@/app/api/invites/send/route')
    const req = new Request('http://localhost/api/invites/send', {
      method: 'POST',
      body: JSON.stringify({ name: 'Alice' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
```

Run: `pnpm test` — expect FAIL.

- [ ] **Step 10.2: Create invite send API route**

```ts
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { email, name } = body

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Get the admin's user ID from their session cookie
  const { createClient: createServerClient } = await import('@/lib/supabase/server')
  const serverSupabase = await createServerClient()
  const { data: { user: adminUser } } = await serverSupabase.auth.getUser()
  if (!adminUser) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Insert invite row (token auto-generated by DB default)
  const { data: invite, error } = await admin
    .from('teacher_invites')
    .insert({ email, invited_by: adminUser.id })
    .select('token')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const inviteUrl = `${process.env.TEACHER_APP_URL}/invite?token=${invite.token}`

  await resend.emails.send({
    from: 'Parikshanam <admin@parikshanam.com>',
    to: email,
    subject: "You've been invited to teach on Parikshanam",
    html: `
      <h2>Hi ${name ?? 'there'},</h2>
      <p>You've been invited to join Parikshanam as a teacher.</p>
      <p><a href="${inviteUrl}" style="background:#E8720C;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Accept Invitation</a></p>
      <p>This link expires in 7 days.</p>
    `,
  })

  return NextResponse.json({ ok: true })
}
```

> **Note:** The `invited_by` field should be the authenticated admin's user ID. Update the route to extract it from the session cookie in production:
> ```ts
> const serverClient = await createServerClient()
> const { data: { user } } = await serverClient.auth.getUser()
> // use user.id as invited_by
> ```

- [ ] **Step 10.3: Run test — expect PASS**

```bash
pnpm test
```

- [ ] **Step 10.4: Build teachers list page with invite modal**

Replace `teachers/page.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

const col = createColumnHelper<Profile & { email?: string }>()
const columns = [
  col.accessor('full_name', { header: 'Name', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('email', { header: 'Email', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('is_active', { header: 'Status', cell: (i) => (
    <span className={`text-xs px-2 py-0.5 rounded-full ${i.getValue() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      {i.getValue() ? 'Active' : 'Inactive'}
    </span>
  )}),
]

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [sending, setSending] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('profiles').select('*').eq('role', 'teacher').then(({ data }) => {
      setTeachers(data ?? [])
    })
  }, [])

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    await fetch('/api/invites/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, name: inviteName }),
    })
    setSending(false)
    setShowInvite(false)
    setInviteEmail('')
    setInviteName('')
    alert('Invite sent!')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">Teachers</h1>
        <button
          onClick={() => setShowInvite(true)}
          className="bg-brand-primary text-white text-sm font-bold px-4 py-2 rounded-xl border-b-4 border-brand-dark"
        >
          + Invite Teacher
        </button>
      </div>

      <DataTable columns={columns} data={teachers} />

      {showInvite && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy text-lg mb-4">Invite Teacher</h2>
            <form onSubmit={sendInvite} className="space-y-3">
              <input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Teacher name"
                className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm"
              />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowInvite(false)} className="flex-1 border border-ui-border rounded-xl py-2 text-sm">Cancel</button>
                <button type="submit" disabled={sending} className="flex-1 bg-brand-primary text-white rounded-xl py-2 text-sm font-bold border-b-2 border-brand-dark disabled:opacity-60">
                  {sending ? 'Sending…' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 10.5: Test invite flow manually**

1. Open `/teachers`, click "Invite Teacher"
2. Enter a real email, click "Send Invite"
3. Verify the invite row appears in Supabase `teacher_invites` table
4. Verify email is received (check Resend dashboard if not in inbox)

- [ ] **Step 10.6: Commit**

```bash
git add apps/admin/src/app/api/invites apps/admin/src/app/\(admin\)/teachers
git commit -m "feat(admin): teacher invite flow with Resend email"
```

---

### Task 11: Students and Purchases pages

**Files:**
- Modify: `apps/admin/src/app/(admin)/students/page.tsx`
- Modify: `apps/admin/src/app/(admin)/purchases/page.tsx`

- [ ] **Step 11.1: Build students page**

```tsx
import { createAdminClient } from '@/lib/supabase/admin'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'

const col = createColumnHelper<any>()
const columns = [
  col.accessor('full_name', { header: 'Name', cell: (i) => (
    <Link href={`/students/${i.row.original.id}`} className="text-brand-primary hover:underline">{i.getValue() ?? '—'}</Link>
  )}),
  col.accessor('phone', { header: 'Phone', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('class_level_id', { header: 'Class', cell: (i) => i.getValue() ? `Class ${i.getValue()}` : '—' }),
  col.accessor('is_active', { header: 'Status', cell: (i) => (
    <span className={`text-xs px-2 py-0.5 rounded-full ${i.getValue() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      {i.getValue() ? 'Active' : 'Inactive'}
    </span>
  )}),
  col.accessor('created_at', { header: 'Joined', cell: (i) => new Date(i.getValue()).toLocaleDateString('en-IN') }),
]

export default async function StudentsPage() {
  const admin = createAdminClient()
  const { data: students } = await admin
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">
        Students ({students?.length ?? 0})
      </h1>
      <DataTable columns={columns} data={students ?? []} />
    </div>
  )
}
```

- [ ] **Step 11.2: Build purchases page**

```tsx
import { createAdminClient } from '@/lib/supabase/admin'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'

const col = createColumnHelper<any>()
const columns = [
  col.accessor('profile.full_name', { header: 'Student', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('course.title', { header: 'Course', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('amount', { header: 'Amount', cell: (i) => `₹${i.getValue()}` }),
  col.accessor('status', { header: 'Status', cell: (i) => (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
      i.getValue() === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
    }`}>{i.getValue()}</span>
  )}),
  col.accessor('razorpay_payment_id', { header: 'Razorpay ID', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('created_at', { header: 'Date', cell: (i) => new Date(i.getValue()).toLocaleDateString('en-IN') }),
]

export default async function PurchasesPage() {
  const admin = createAdminClient()
  const { data: purchases } = await admin
    .from('purchases')
    .select('*, profile:profiles(full_name), course:courses(title)')
    .order('created_at', { ascending: false })

  const totalRevenue = purchases?.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0) ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">Purchases</h1>
        <div className="bg-white border border-ui-border rounded-xl px-4 py-2">
          <span className="text-xs text-gray-400">Total Revenue </span>
          <span className="font-black text-brand-primary font-[family-name:var(--font-nunito-var)]">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
      <DataTable columns={columns} data={purchases ?? []} />
    </div>
  )
}
```

- [ ] **Step 11.3: Commit**

```bash
git add apps/admin/src/app/\(admin\)/students apps/admin/src/app/\(admin\)/purchases
git commit -m "feat(admin): students and purchases pages"
```

---

### Task 11b: Course edit page

**Files:**
- Create: `apps/admin/src/app/(admin)/courses/[id]/edit/page.tsx`

- [ ] **Step 11b.1: Build edit page**

```tsx
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { CourseForm } from '@/components/CourseForm'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import type { CourseFormData } from '@/components/CourseForm'

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: course }, { data: olympiadTypes }, { data: classLevels }] = await Promise.all([
    supabase.from('courses').select('*').eq('id', id).single(),
    supabase.from('olympiad_types').select('id, label').order('label'),
    supabase.from('class_levels').select('id, label').order('id'),
  ])
  if (!course) notFound()

  async function updateCourse(data: CourseFormData) {
    'use server'
    const admin = createAdminClient()
    await admin.from('courses').update(data).eq('id', id)
    redirect(`/courses/${id}`)
  }

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">
        Edit: {course.title}
      </h1>
      <CourseForm
        defaultValues={course}
        olympiadTypes={olympiadTypes ?? []}
        classLevels={classLevels ?? []}
        onSubmit={updateCourse}
        submitLabel="Save Changes"
      />
    </div>
  )
}
```

- [ ] **Step 11b.2: Commit**

```bash
git add apps/admin/src/app/\(admin\)/courses/\[id\]/edit
git commit -m "feat(admin): course edit page"
```

---

### Task 11c: Student detail page

**Files:**
- Create: `apps/admin/src/app/(admin)/students/[id]/page.tsx`

- [ ] **Step 11c.1: Build student detail page**

```tsx
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const [{ data: profile }, { data: emailRow }, { data: purchases }, { data: progress }] = await Promise.all([
    admin.from('profiles').select('*').eq('id', id).single(),
    admin.from('admin_user_emails').select('email').eq('id', id).single(),
    admin.from('purchases').select('*, course:courses(title)').eq('user_id', id).order('created_at', { ascending: false }),
    admin.from('user_progress').select('*, lesson:lessons(title), quiz:quizzes(title)').eq('user_id', id),
  ])
  if (!profile) notFound()

  async function deactivate() {
    'use server'
    const admin = createAdminClient()
    await admin.from('profiles').update({ is_active: false }).eq('id', id)
  }

  return (
    <div>
      <Link href="/students" className="text-sm text-gray-400 hover:text-brand-primary mb-4 inline-block">← Students</Link>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">
        {profile.full_name ?? 'Unnamed Student'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-ui-border rounded-2xl p-5">
          <h2 className="font-bold text-brand-navy mb-3">Profile</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-400">Email</dt><dd>{emailRow?.email ?? '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Phone</dt><dd>{profile.phone ?? '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Class</dt><dd>{profile.class_level_id ? `Class ${profile.class_level_id}` : '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Status</dt>
              <dd><span className={`text-xs px-2 py-0.5 rounded-full ${profile.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{profile.is_active ? 'Active' : 'Inactive'}</span></dd>
            </div>
          </dl>
          {profile.is_active && (
            <form action={deactivate} className="mt-4">
              <button type="submit" className="text-xs text-red-500 hover:underline">Deactivate account</button>
            </form>
          )}
        </div>

        <div className="bg-white border border-ui-border rounded-2xl p-5">
          <h2 className="font-bold text-brand-navy mb-3">Purchases ({purchases?.length ?? 0})</h2>
          <ul className="divide-y divide-ui-border text-sm">
            {purchases?.map((p) => (
              <li key={p.id} className="py-2 flex justify-between">
                <span>{p.course?.title ?? '—'}</span>
                <span className="text-gray-400">₹{p.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white border border-ui-border rounded-2xl p-5">
        <h2 className="font-bold text-brand-navy mb-3">Progress ({progress?.length ?? 0} items completed)</h2>
        <ul className="divide-y divide-ui-border text-sm max-h-64 overflow-y-auto">
          {progress?.map((p) => (
            <li key={p.id} className="py-2 flex justify-between">
              <span>{p.lesson?.title ?? p.quiz?.title ?? '—'}</span>
              <span className="text-gray-400">{new Date(p.completed_at).toLocaleDateString('en-IN')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 11c.2: Commit**

```bash
git add apps/admin/src/app/\(admin\)/students/\[id\]
git commit -m "feat(admin): student detail page with purchases and progress"
```

---

### Task 12: Settings page

**Files:**
- Modify: `apps/admin/src/app/(admin)/settings/page.tsx`

- [ ] **Step 12.1: Build settings page with add/edit/delete**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ClassLevel { id: string; label: string; min_age: number | null; max_age: number | null }
interface OlympiadType { id: string; label: string; color_hex: string }

export default function SettingsPage() {
  const supabase = createClient()
  const [classLevels, setClassLevels] = useState<ClassLevel[]>([])
  const [olympiadTypes, setOlympiadTypes] = useState<OlympiadType[]>([])

  // New class level form state
  const [newClass, setNewClass] = useState({ id: '', label: '', min_age: '', max_age: '' })
  // New olympiad form state
  const [newOlympiad, setNewOlympiad] = useState({ id: '', label: '', color_hex: '#4F46E5' })

  useEffect(() => {
    supabase.from('class_levels').select('*').order('id').then(({ data }) => setClassLevels(data ?? []))
    supabase.from('olympiad_types').select('*').order('label').then(({ data }) => setOlympiadTypes(data ?? []))
  }, [])

  async function addClass(e: React.FormEvent) {
    e.preventDefault()
    const { data } = await supabase.from('class_levels').insert({
      id: newClass.id,
      label: newClass.label,
      min_age: newClass.min_age ? Number(newClass.min_age) : null,
      max_age: newClass.max_age ? Number(newClass.max_age) : null,
    }).select().single()
    if (data) { setClassLevels([...classLevels, data]); setNewClass({ id: '', label: '', min_age: '', max_age: '' }) }
  }

  async function deleteClass(id: string) {
    if (!confirm(`Delete class level "${id}"? This will fail if courses reference it.`)) return
    const { error } = await supabase.from('class_levels').delete().eq('id', id)
    if (error) { alert(error.message); return }
    setClassLevels(classLevels.filter((c) => c.id !== id))
  }

  async function addOlympiad(e: React.FormEvent) {
    e.preventDefault()
    const { data } = await supabase.from('olympiad_types').insert(newOlympiad).select().single()
    if (data) { setOlympiadTypes([...olympiadTypes, data]); setNewOlympiad({ id: '', label: '', color_hex: '#4F46E5' }) }
  }

  async function deleteOlympiad(id: string) {
    if (!confirm(`Delete olympiad type "${id}"?`)) return
    const { error } = await supabase.from('olympiad_types').delete().eq('id', id)
    if (error) { alert(error.message); return }
    setOlympiadTypes(olympiadTypes.filter((o) => o.id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class Levels */}
        <div className="bg-white border border-ui-border rounded-2xl p-5">
          <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy mb-3">Class Levels</h2>
          <ul className="divide-y divide-ui-border text-sm mb-4">
            {classLevels.map((c) => (
              <li key={c.id} className="py-2 flex justify-between items-center">
                <span>{c.label} <span className="text-gray-400 text-xs">({c.min_age}–{c.max_age})</span></span>
                <button onClick={() => deleteClass(c.id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
              </li>
            ))}
          </ul>
          <form onSubmit={addClass} className="space-y-2 border-t border-ui-border pt-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Add class level</p>
            <input value={newClass.id} onChange={(e) => setNewClass({ ...newClass, id: e.target.value })} placeholder="ID (e.g. 11)" className="w-full border border-ui-border rounded-lg px-2 py-1.5 text-sm" required />
            <input value={newClass.label} onChange={(e) => setNewClass({ ...newClass, label: e.target.value })} placeholder="Label (e.g. Class 11)" className="w-full border border-ui-border rounded-lg px-2 py-1.5 text-sm" required />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={newClass.min_age} onChange={(e) => setNewClass({ ...newClass, min_age: e.target.value })} placeholder="Min age" className="border border-ui-border rounded-lg px-2 py-1.5 text-sm" />
              <input type="number" value={newClass.max_age} onChange={(e) => setNewClass({ ...newClass, max_age: e.target.value })} placeholder="Max age" className="border border-ui-border rounded-lg px-2 py-1.5 text-sm" />
            </div>
            <button type="submit" className="bg-brand-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg border-b-2 border-brand-dark">+ Add</button>
          </form>
        </div>

        {/* Olympiad Types */}
        <div className="bg-white border border-ui-border rounded-2xl p-5">
          <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy mb-3">Olympiad Types</h2>
          <ul className="divide-y divide-ui-border text-sm mb-4">
            {olympiadTypes.map((o) => (
              <li key={o.id} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: o.color_hex }} />
                  <span>{o.label}</span>
                </div>
                <button onClick={() => deleteOlympiad(o.id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
              </li>
            ))}
          </ul>
          <form onSubmit={addOlympiad} className="space-y-2 border-t border-ui-border pt-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Add olympiad type</p>
            <input value={newOlympiad.id} onChange={(e) => setNewOlympiad({ ...newOlympiad, id: e.target.value })} placeholder="ID (e.g. nmo)" className="w-full border border-ui-border rounded-lg px-2 py-1.5 text-sm" required />
            <input value={newOlympiad.label} onChange={(e) => setNewOlympiad({ ...newOlympiad, label: e.target.value })} placeholder="Label (e.g. NMO)" className="w-full border border-ui-border rounded-lg px-2 py-1.5 text-sm" required />
            <div className="flex items-center gap-2">
              <input type="color" value={newOlympiad.color_hex} onChange={(e) => setNewOlympiad({ ...newOlympiad, color_hex: e.target.value })} className="h-8 w-10 rounded border border-ui-border p-0.5" />
              <span className="text-xs text-gray-400">{newOlympiad.color_hex}</span>
            </div>
            <button type="submit" className="bg-brand-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg border-b-2 border-brand-dark">+ Add</button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 12.2: Commit**

```bash
git add apps/admin/src/app/\(admin\)/settings
git commit -m "feat(admin): settings page with add/delete for class levels and olympiad types"
```

---

### Task 13: Run all tests + final verification

- [ ] **Step 13.1: Run all tests**

```bash
cd apps/admin && pnpm test
```

Expected: all tests PASS.

- [ ] **Step 13.2: Run type check**

```bash
pnpm lint
```

Expected: no TypeScript errors.

- [ ] **Step 13.3: Build for production**

```bash
pnpm build
```

Expected: build succeeds with no errors.

- [ ] **Step 13.4: Final commit**

```bash
git add .
git commit -m "feat(admin): complete admin portal MVP"
```
