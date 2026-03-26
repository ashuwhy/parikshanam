import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/StatCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Resolve all course IDs this teacher owns or is assigned to
  const { data: assignedRows } = await supabase
    .from('course_teachers')
    .select('course_id')
    .eq('teacher_id', user!.id)

  const assignedIds = assignedRows?.map((r) => r.course_id) ?? []
  const myCourseFilter = assignedIds.length
    ? `created_by.eq.${user!.id},id.in.(${assignedIds.join(',')})`
    : `created_by.eq.${user!.id}`

  const { data: myCourses } = await supabase
    .from('courses')
    .select('id, title, status')
    .or(myCourseFilter)

  const allCourseIds = myCourses?.map((c) => c.id) ?? []
  const pendingCourses = myCourses?.filter((c) => c.status === 'pending_review') ?? []

  let studentCount: number | null = 0
  let lessonCount: number | null = 0

  if (allCourseIds.length > 0) {
    const [{ count: sc }, { count: lc }] = await Promise.all([
      supabase.from('purchases').select('*', { count: 'exact', head: true }).in('course_id', allCourseIds),
      supabase.from('lessons').select('*', { count: 'exact', head: true }).in('course_id', allCourseIds),
    ])
    studentCount = sc
    lessonCount = lc
  }

  const courseCount = myCourses?.length ?? 0

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="My Courses" value={courseCount ?? 0} />
        <StatCard label="Enrolled Students" value={studentCount ?? 0} />
        <StatCard label="Lessons Published" value={lessonCount ?? 0} />
        <StatCard label="Pending Review" value={pendingCourses?.length ?? 0} accent />
      </div>

      {pendingCourses && pendingCourses.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-amber-800 mb-3">
            Awaiting Admin Approval
          </h2>
          <ul className="space-y-2">
            {pendingCourses.map((c) => (
              <li key={c.id} className="flex items-center justify-between text-sm">
                <span>{c.title}</span>
                <a href={`/courses/${c.id}`} className="text-amber-700 font-medium hover:underline">View →</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
