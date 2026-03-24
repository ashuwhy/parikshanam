# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Parikshanam is a Turborepo monorepo with three apps:
- `apps/api` — Python 3.11+ / FastAPI backend
- `apps/mobile` — Expo (React Native) mobile app with Supabase
- `apps/web` — Next.js (App Router) web app
- `packages/typescript-config` — Shared TypeScript base configs

Package manager: **pnpm 9+**. Task runner: **Turborepo**.

## Commands

### Root (runs across all workspaces via Turborepo)
```bash
pnpm dev           # Run all apps in parallel
pnpm dev:api       # FastAPI at http://localhost:8000
pnpm dev:mobile    # Expo / Metro bundler
pnpm dev:web       # Next.js at http://localhost:3000
pnpm build         # Production builds (JS apps)
pnpm lint          # Lint all workspaces
pnpm format        # Prettier across all files
```

### API (Python)
```bash
cd apps/api
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
python -m uvicorn app.main:app --reload   # or: pnpm dev:api from root
python -m ruff check .                    # lint
python -m pytest                          # tests
```

### Mobile
```bash
cd apps/mobile
cp .env.example .env   # add Supabase URL + anon key
pnpm dev               # expo start
pnpm ios / pnpm android
tsc --noEmit           # type-check (also runs as pnpm lint)
```

### Supabase
```bash
pnpm supabase:link     # link to remote project
pnpm supabase:push     # push local migrations to remote
```

## Architecture

### Mobile (`apps/mobile`)

**Routing**: Expo Router (file-based). Groups:
- `(auth)/` — unauthenticated screens (welcome, sign-in)
- `(onboarding)/` — post-signup onboarding
- `(tabs)/` — main authenticated tab navigation
- `course/[id]/lesson/[lessonId]` — lesson viewer with video

**Auth flow**: `AuthContext` wraps the app with Supabase session. `NavigationGuard` in `_layout.tsx` redirects based on `session` + `profile` state. Auth state is exposed via `useAuth` hook (`hooks/useAuth.ts`).

**State management** (two layers):
- **Zustand stores** (`lib/stores/`) — local/UI state: `useAuthStore`, `useCoursesStore`, `useProfileStore`, `usePurchasesStore`, `useUiStore`
- **TanStack Query** (`hooks/useCourses.ts`, `hooks/usePurchases.ts`) — server-fetched data with caching

**Supabase client** lives in `lib/supabase.ts`. Typed selects are in `lib/supabase/selects.ts`.

**Styling**: NativeWind (Tailwind for React Native) via `global.css` + `tailwind.config.js`. Theme constants in `components/providers/ThemeProvider.tsx`. Use `cn()` from `lib/cn.ts` for conditional class merging.

**Payments**: Razorpay via `lib/razorpay.ts` and `react-native-razorpay`.

### API (`apps/api`)

Minimal FastAPI skeleton in `app/main.py`. Add routers under `app/` following FastAPI conventions. OpenAPI docs at http://localhost:8000/docs.

Linter: **ruff** (line length 100, Python 3.11+, rules: E, F, I, UP).

### Web (`apps/web`)

Next.js 16 App Router with Tailwind CSS v4. Currently minimal.

## Environment Variables

Mobile requires `apps/mobile/.env`:
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```
