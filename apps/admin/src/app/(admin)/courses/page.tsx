import { createClient } from '@/lib/supabase/server'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'
import type { Course } from '@/lib/types'

const col = createColumnHelper<Course & { olympiad_type: { label: string } | null }>()

const columns = [
  col.accessor('title', { header: 'Title', cell: (i) => (
    <Link href={`/courses/${i.row.original.id}`} className="text-brand-primary font-medium hover:underline">
      {i.getValue()}
    </Link>
  )}),
  col.accessor('status', { header: 'Status', cell: (i) => (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
      i.getValue() === 'active' ? 'bg-green-100 text-green-700' :
      i.getValue() === 'pending_review' ? 'bg-amber-100 text-amber-700' :
      'bg-gray-100 text-gray-600'
    }`}>{i.getValue()}</span>
  )}),
  col.accessor((r) => r.olympiad_type?.label ?? '—', { id: 'olympiad', header: 'Olympiad' }),
  col.accessor('price', { header: 'Price', cell: (i) => `₹${i.getValue()}` }),
]

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('*, olympiad_type:olympiad_types(*)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">Courses</h1>
        <Link href="/courses/new" className="bg-brand-primary text-white text-sm font-bold px-4 py-2 rounded-xl border-b-4 border-brand-dark">
          + New Course
        </Link>
      </div>
      <DataTable columns={columns} data={courses ?? []} />
    </div>
  )
}
