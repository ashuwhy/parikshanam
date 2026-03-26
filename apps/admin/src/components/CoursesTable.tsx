'use client'

import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'

type CourseRow = {
  id: string
  title: string
  status: string
  price: number
  olympiad_type: { label: string } | null
}

const col = createColumnHelper<CourseRow>()
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
  col.accessor('price', { header: 'Price', cell: (i) => `₹${(i.getValue() / 100).toLocaleString('en-IN')}` }),
]

export function CoursesTable({ courses }: { courses: CourseRow[] }) {
  return <DataTable columns={columns} data={courses} />
}
