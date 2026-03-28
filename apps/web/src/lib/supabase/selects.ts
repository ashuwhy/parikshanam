export const COURSE_LIST_SELECT = `
  *,
  olympiad_type:olympiad_types(*),
  min_class:class_levels!courses_min_class_id_fkey(*),
  max_class:class_levels!courses_max_class_id_fkey(*)
` as const;

export const PURCHASE_LIST_SELECT = `
  *,
  course:courses(
    *,
    olympiad_type:olympiad_types(*),
    min_class:class_levels!courses_min_class_id_fkey(*),
    max_class:class_levels!courses_max_class_id_fkey(*)
  )
` as const;
