insert into public.courses
  (title, subtitle, description, price, mrp, class_levels, olympiad_type,
   total_lessons, duration_hours, is_featured, is_active)
values (
  'Class 8 Mathematics Olympiad Masterclass',
  'Complete IMO & SOF preparation for Class 8',
  'Master all topics covered in the International Mathematics Olympiad (IMO) and Science Olympiad Foundation exams for Class 8. Covers Number Systems, Algebra, Geometry, Data Handling with 40+ practice tests.',
  49900,
  99900,
  ARRAY['8'],
  'IMO',
  42, 18,
  true, true
);
