-- Remove school_id FK from profiles (replaced by school_name text column)
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS school_id;
