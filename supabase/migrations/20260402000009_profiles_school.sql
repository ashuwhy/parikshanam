-- Add school column to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS school text;
