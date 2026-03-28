'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'

type PurchaseRow = {
  id: string
  amount: number
  status: string
  payment_method: string | null
  screenshot_url: string | null
  razorpay_payment_id: string | null
  created_at: string
  profile: { full_name: string | null } | null
  course: { title: string } | null
}

function ApproveActions({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)

  const act = async (status: 'completed' | 'rejected') => {
    setLoading(status === 'completed' ? 'approve' : 'reject')
    await fetch(`/api/purchases/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => void act('completed')}
        disabled={!!loading}
        className="btn-press-motion px-3 py-1 rounded-[var(--radius-control-sm)] text-xs font-bold bg-green-100 text-green-700 hover:bg-green-200 active:translate-y-px disabled:opacity-50"
      >
        {loading === 'approve' ? '…' : 'Approve'}
      </button>
      <button
        type="button"
        onClick={() => void act('rejected')}
        disabled={!!loading}
        className="btn-press-motion px-3 py-1 rounded-[var(--radius-control-sm)] text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 active:translate-y-px disabled:opacity-50"
      >
        {loading === 'reject' ? '…' : 'Reject'}
      </button>
    </div>
  )
}

const col = createColumnHelper<PurchaseRow>()

const columns = [
  col.accessor((r) => r.profile?.full_name, {
    id: 'student',
    header: 'Student',
    cell: (i) => i.getValue() ?? '-',
  }),
  col.accessor((r) => r.course?.title, {
    id: 'course',
    header: 'Course',
    cell: (i) => i.getValue() ?? '-',
  }),
  col.accessor('amount', {
    header: 'Amount',
    cell: (i) => `₹${(i.getValue() / 100).toLocaleString('en-IN')}`,
  }),
  col.accessor('payment_method', {
    header: 'Method',
    cell: (i) => (
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          i.getValue() === 'upi' ? 'bg-blue-100 text-blue-700' : 'bg-surface-subtle text-text-muted'
        }`}
      >
        {i.getValue() === 'upi' ? 'UPI' : 'Razorpay'}
      </span>
    ),
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (i) => (
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          i.getValue() === 'completed'
            ? 'bg-green-100 text-green-700'
            : i.getValue() === 'rejected'
              ? 'bg-red-100 text-red-600'
              : 'bg-amber-100 text-amber-700'
        }`}
      >
        {i.getValue()}
      </span>
    ),
  }),
  col.display({
    id: 'proof',
    header: 'Proof',
    cell: (i) => {
      const url = i.row.original.screenshot_url
      if (!url) return <span className="text-text-muted text-xs">-</span>
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-brand-primary hover:underline"
        >
          View
          <ExternalLink className="size-3 shrink-0 stroke-[2]" aria-hidden />
        </a>
      )
    },
  }),
  col.display({
    id: 'actions',
    header: 'Actions',
    cell: (i) => {
      const row = i.row.original
      if (row.payment_method === 'upi' && row.status === 'pending') {
        return <ApproveActions id={row.id} />
      }
      return <span className="text-text-muted text-xs">{row.razorpay_payment_id ?? '-'}</span>
    },
  }),
  col.accessor('created_at', {
    header: 'Date',
    cell: (i) => new Date(i.getValue()).toLocaleDateString('en-IN'),
  }),
]

export function PurchasesTable({ purchases }: { purchases: PurchaseRow[] }) {
  return <DataTable columns={columns} data={purchases} />
}
