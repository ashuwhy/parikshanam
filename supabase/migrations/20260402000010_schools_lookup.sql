-- Schools lookup table + FK on profiles
-- Replaces the free-text `school` column added in 20260402000009

-- ── 1. schools table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.schools (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view schools"
  ON public.schools FOR SELECT USING (true);

GRANT SELECT ON public.schools TO anon, authenticated;

-- ── 2. Seed initial schools ───────────────────────────────────
INSERT INTO public.schools (name) VALUES
  ('Army Public School'),
  ('Delhi Public School'),
  ('Kendriya Vidyalaya'),
  ('Navodaya Vidyalaya'),
  ('Air Force School'),
  ('Navy Children School'),
  ('Other')
ON CONFLICT (name) DO NOTHING;

-- ── 3. Add school_id FK on profiles ───────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS school_id uuid REFERENCES public.schools(id);

-- ── 4. Drop the old free-text school column ───────────────────
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS school;
