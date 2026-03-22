export interface ClassLevel {
  id: string;
  label: string;
  min_age?: number | null;
  max_age?: number | null;
}

export interface OlympiadType {
  id: string;
  label: string;
  color_hex: string;
}

export interface Profile {
  id: string;
  phone: string | null;
  full_name: string | null;
  avatar_url: string | null;
  /** FK to `class_levels.id` (e.g. '6'…'12') */
  class_level_id: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  mrp: number | null;
  thumbnail_url: string | null;
  total_lessons: number;
  duration_hours: number;
  is_featured: boolean;
  is_active?: boolean;
  olympiad_type_id: string | null;
  min_class_id: string | null;
  max_class_id: string | null;
  olympiad_type?: OlympiadType | null;
  min_class?: ClassLevel | null;
  max_class?: ClassLevel | null;
}

export interface Purchase {
  id: string;
  user_id: string;
  course_id: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  amount: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
  course?: Course;
}

export function olympiadLabel(course: Course): string | null {
  return course.olympiad_type?.label ?? null;
}
