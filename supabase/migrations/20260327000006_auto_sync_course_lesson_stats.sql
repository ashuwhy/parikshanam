-- ─────────────────────────────────────────────────────────────────────────────
-- Auto-sync courses.total_lessons + duration_hours from lessons table.
-- Trigger fires on every INSERT/UPDATE/DELETE on lessons and recalculates:
--   total_lessons  = count of lessons for that course
--   duration_hours = ceil(sum(duration_minutes) / 60), min 0
-- Also backfills existing courses.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION sync_course_lesson_stats()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_course_id uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_course_id := OLD.course_id;
  ELSE
    v_course_id := NEW.course_id;
  END IF;

  UPDATE public.courses
  SET
    total_lessons  = (
      SELECT COUNT(*)
      FROM public.lessons
      WHERE course_id = v_course_id
    ),
    duration_hours = (
      SELECT GREATEST(0, CEIL(COALESCE(SUM(duration_minutes), 0) / 60.0))::integer
      FROM public.lessons
      WHERE course_id = v_course_id
    )
  WHERE id = v_course_id;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_course_stats ON public.lessons;
CREATE TRIGGER trg_sync_course_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION sync_course_lesson_stats();

-- Backfill existing courses
UPDATE public.courses c
SET
  total_lessons  = (SELECT COUNT(*) FROM public.lessons l WHERE l.course_id = c.id),
  duration_hours = (
    SELECT GREATEST(0, CEIL(COALESCE(SUM(l.duration_minutes), 0) / 60.0))::integer
    FROM public.lessons l WHERE l.course_id = c.id
  );
