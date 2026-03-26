import { createClient } from '@/lib/supabase/server'
import { CoursesTable } from '@/components/CoursesTable'
import Link from 'next/link'

export default async function MyCoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: assignedIds } = await supabase
    .from('course_teachers')
    .select('course_id')
    .eq('teacher_id', user!.id)

  const assignedCourseIds = assignedIds?.map((r) => r.course_id) ?? []

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, status, price')
    .or(`created_by.eq.${user!.id}${assignedCourseIds.length ? `,id.in.(${assignedCourseIds.join(',')})` : ''}`)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">My Courses</h1>
        <Link href="/courses/new" className="bg-brand-primary text-white text-sm font-bold px-4 py-2 rounded-xl border-b-4 border-brand-dark">
          + New Course
        </Link>
      </div>
      <CoursesTable courses={courses ?? []} />
    </div>
  )
}
