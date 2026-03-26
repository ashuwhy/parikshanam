export type Role = 'student' | 'teacher' | 'admin'
export type CourseStatus = 'draft' | 'pending_review' | 'active' | 'archived'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  class_level_id: string | null
  role: Role
  bio: string | null
  is_active: boolean
  onboarding_completed: boolean
  created_at: string
}

export interface Course {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  price: number
  mrp: number | null
  thumbnail_url: string | null
  total_lessons: number
  duration_hours: number
  is_featured: boolean
  is_active: boolean
  status: CourseStatus
  created_by: string | null
  olympiad_type_id: string | null
  min_class_id: string | null
  max_class_id: string | null
  created_at: string
}

export interface Purchase {
  id: string
  user_id: string
  course_id: string
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  amount: number
  status: string
  created_at: string
}
