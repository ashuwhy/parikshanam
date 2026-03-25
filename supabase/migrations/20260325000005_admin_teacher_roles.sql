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
