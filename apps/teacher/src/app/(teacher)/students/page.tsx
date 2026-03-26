import { createClient } from '@/lib/supabase/server'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'

const col = createColumnHelper<any>()
const columns = [
  col.accessor('profile.full_name', { header: 'Student', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('course.title', { header: 'Course', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('status', { header: 'Payment', cell: (i) => i.getValue() }),
  col.accessor('created_at', { header: 'Enrolled', cell: (i) => new Date(i.getValue()).toLocaleDateString('en-IN') }),
]

export default async function MyStudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get courses owned (created_by) or assigned (course_teachers)
  const { data: assignedRows } = await supabase
    .from('course_teachers')
    .select('course_id')
    .eq('teacher_id', user!.id)

  const assignedIds = assignedRows?.map((r) => r.course_id) ?? []

  const { data: myCourses } = await supabase
    .from('courses')
    .select('id')
    .or(`created_by.eq.${user!.id}${assignedIds.length ? `,id.in.(${assignedIds.join(',')})` : ''}`)

  const courseIds = myCourses?.map((c) => c.id) ?? []

  const purchases = courseIds.length
    ? (await supabase
        .from('purchases')
        .select('*, profile:profiles(full_name), course:courses(title)')
        .in('course_id', courseIds)
        .order('created_at', { ascending: false })).data
    : []

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">
        My Students ({purchases?.length ?? 0})
      </h1>
      <DataTable columns={columns} data={purchases ?? []} />
    </div>
  )
}
