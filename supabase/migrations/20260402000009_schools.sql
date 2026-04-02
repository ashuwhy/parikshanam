-- Schools dropdown options + single school_name text on profiles

-- ── 1. schools lookup table (for onboarding dropdown) ─────────
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

-- ── 3. Single text column on profiles ────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS school_name text;
