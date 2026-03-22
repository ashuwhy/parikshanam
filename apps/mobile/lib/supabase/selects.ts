/** Embedded selects for PostgREST (Supabase). FK names match Postgres defaults. */
export const COURSE_LIST_SELECT = `
  *,
  olympiad_type:olympiad_types(*),
  min_class:class_levels!courses_min_class_id_fkey(*),
  max_class:class_levels!courses_max_class_id_fkey(*)
` as const;

/** Purchases row + nested course with same embeds as list. */
export const PURCHASE_LIST_SELECT = `
  *,
  course:courses(
    *,
    olympiad_type:olympiad_types(*),
    min_class:class_levels!courses_min_class_id_fkey(*),
    max_class:class_levels!courses_max_class_id_fkey(*)
  )
` as const;
