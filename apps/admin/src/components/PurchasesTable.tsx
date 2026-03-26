'use client'

import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'

type PurchaseRow = {
  id: string
  amount: number
  status: string
  razorpay_payment_id: string | null
  created_at: string
  profile: { full_name: string | null } | null
  course: { title: string } | null
}

const col = createColumnHelper<PurchaseRow>()
const columns = [
  col.accessor((r) => r.profile?.full_name, { id: 'student', header: 'Student', cell: (i) => i.getValue() ?? '—' }),
  col.accessor((r) => r.course?.title, { id: 'course', header: 'Course', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('amount', { header: 'Amount', cell: (i) => `₹${i.getValue()}` }),
  col.accessor('status', { header: 'Status', cell: (i) => (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
      i.getValue() === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
    }`}>{i.getValue()}</span>
  )}),
  col.accessor('razorpay_payment_id', { header: 'Razorpay ID', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('created_at', { header: 'Date', cell: (i) => new Date(i.getValue()).toLocaleDateString('en-IN') }),
]

export function PurchasesTable({ purchases }: { purchases: PurchaseRow[] }) {
  return <DataTable columns={columns} data={purchases} />
}
