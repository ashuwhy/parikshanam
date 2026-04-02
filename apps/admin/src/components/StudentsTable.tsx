'use client'

import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'

export type StudentRow = {
  id: string
  full_name: string | null
  phone: string | null
  school_name: string | null
  is_active: boolean
  created_at: string
}

const col = createColumnHelper<StudentRow>()
const columns = [
  col.accessor('full_name', { header: 'Name', cell: (i) => (
    <Link href={`/students/${i.row.original.id}`} className="text-brand-primary hover:underline">
      {i.getValue() ?? '-'}
    </Link>
  )}),
  col.accessor('phone', { header: 'Phone', cell: (i) => i.getValue() ?? '-' }),
  col.accessor('school_name', { header: 'School', cell: (i) => i.getValue() ?? <span className="text-text-muted italic text-xs">Not set</span> }),
  col.accessor('is_active', { header: 'Status', cell: (i) => (
    <span className={`text-xs px-2 py-0.5 rounded-full ${i.getValue() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      {i.getValue() ? 'Active' : 'Inactive'}
    </span>
  )}),
  col.accessor('created_at', { header: 'Joined', cell: (i) => new Date(i.getValue()).toLocaleDateString('en-IN') }),
]

export function StudentsTable({ students }: { students: StudentRow[] }) {
  return <DataTable columns={columns} data={students} />
}
