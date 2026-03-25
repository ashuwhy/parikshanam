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
