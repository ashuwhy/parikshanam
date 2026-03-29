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
    cell: (i) => (
      <span className="font-semibold text-brand-navy whitespace-nowrap">
        {i.getValue() ?? '-'}
      </span>
    ),
    size: 140,
  }),
  col.accessor((r) => r.course?.title, {
    id: 'course',
    header: 'Course',
    cell: (i) => (
      <div className="min-w-[180px] max-w-[280px]">
        <p className="text-sm font-medium leading-tight text-text-body line-clamp-2">
          {i.getValue() ?? '-'}
        </p>
      </div>
    ),
    size: 200,
  }),
  col.accessor('amount', {
    header: 'Amount',
    cell: (i) => (
      <span className="font-bold text-brand-primary whitespace-nowrap">
        ₹{(i.getValue() / 100).toLocaleString('en-IN')}
      </span>
    ),
    size: 90,
  }),
  col.accessor('payment_method', {
    header: 'Method',
    cell: (i) => {
      const val = i.getValue()
      return (
        <span
          className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-[var(--radius-control-sm)] font-black ${
            val === 'upi' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-surface-subtle text-text-muted border border-ui-border'
          }`}
        >
          {val === 'upi' ? 'UPI' : 'Card'}
        </span>
      )
    },
    size: 90,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (i) => {
      const val = i.getValue()
      return (
        <span
          className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-[var(--radius-control-sm)] font-black ${
            val === 'completed'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : val === 'rejected'
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {val}
        </span>
      )
    },
    size: 100,
  }),
  col.display({
    id: 'proof',
    header: 'Proof',
    cell: (i) => {
      const url = i.row.original.screenshot_url
      if (!url) return <span className="text-text-muted text-xs italic">none</span>
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-dark transition-colors"
        >
          View
          <ExternalLink className="size-3.5 shrink-0 stroke-[2.5]" aria-hidden />
        </a>
      )
    },
    size: 80,
  }),
  col.display({
    id: 'actions',
    header: 'Actions',
    cell: (i) => {
      const row = i.row.original
      if (row.payment_method === 'upi' && row.status === 'pending') {
        return <ApproveActions id={row.id} />
      }
      return <span className="text-text-muted text-xs font-mono">{row.razorpay_payment_id ?? '-'}</span>
    },
    size: 160,
  }),
  col.accessor('created_at', {
    header: 'Date',
    cell: (i) => (
      <span className="text-text-muted text-xs whitespace-nowrap">
        {new Date(i.getValue()).toLocaleDateString('en-IN')}
      </span>
    ),
    size: 100,
  }),
]

export function PurchasesTable({ purchases }: { purchases: PurchaseRow[] }) {
  return <DataTable columns={columns} data={purchases} />
}
