'use client'

import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'

type PurchaseRow = {
  id: string
  status: string
  created_at: string
  profile: { full_name: string | null } | null
  course: { title: string } | null
}

const col = createColumnHelper<PurchaseRow>()
const columns = [
  col.accessor((r) => r.profile?.full_name, { id: 'student', header: 'Student', cell: (i) => i.getValue() ?? '-' }),
  col.accessor((r) => r.course?.title, { id: 'course', header: 'Course', cell: (i) => i.getValue() ?? '-' }),
  col.accessor('status', { header: 'Payment', cell: (i) => i.getValue() }),
  col.accessor('created_at', { header: 'Enrolled', cell: (i) => new Date(i.getValue()).toLocaleDateString('en-IN') }),
]

export function StudentsTable({ purchases }: { purchases: PurchaseRow[] }) {
  return <DataTable columns={columns} data={purchases} />
}
