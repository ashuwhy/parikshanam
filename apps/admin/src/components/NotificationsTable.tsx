'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/DataTable'

export type NotificationRow = {
  id: string
  title: string
  body: string
  audience: string
  audience_target_id: string | null
  status: string
  scheduled_at: string
  sent_count: number
  created_at: string
}

const columns: ColumnDef<NotificationRow, unknown>[] = [
  {
    header: 'Audience',
    id: 'audience',
    accessorKey: 'audience',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
          <Bell size={14} className="text-brand-primary" strokeWidth={2.5} />
        </div>
        <div>
          <span className="font-bold text-sm text-brand-navy block uppercase tracking-wider">
            {row.original.audience}
          </span>
          {row.original.audience_target_id && (
            <span className="text-xs text-text-muted truncate max-w-[150px] inline-block">
              {row.original.audience_target_id}
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    header: 'Content',
    id: 'content',
    accessorKey: 'title',
    cell: ({ row }) => (
      <div className="max-w-xs">
        <span className="font-bold text-sm text-brand-navy block truncate">{row.original.title}</span>
        <span className="text-xs text-text-muted truncate block">{row.original.body}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    id: 'status',
    accessorKey: 'status',
    cell: ({ getValue }) => {
      const v = getValue<string>()
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            v === 'sent'
              ? 'bg-green-100 text-green-700'
              : v === 'pending'
                ? 'bg-orange-100 text-orange-700'
                : v === 'processing'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-red-100 text-red-700'
          }`}
        >
          {v}
        </span>
      )
    },
  },
  {
    header: 'Scheduled / Sent',
    id: 'scheduled_at',
    accessorKey: 'scheduled_at',
    cell: ({ getValue }) => (
      <span className="text-xs text-text-muted font-bold block">
        {new Date(getValue<string>()).toLocaleString()}
      </span>
    ),
  },
  {
    header: 'Recipients',
    id: 'sent_count',
    accessorKey: 'sent_count',
    cell: ({ getValue }) => (
      <span className="text-sm font-bold text-brand-navy">{getValue<number>()}</span>
    ),
  },
]

export function NotificationsTable({ notifications }: { notifications: NotificationRow[] }) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-ui-border bg-surface-elevated px-5 py-14 text-center">
        <p className="text-sm text-text-muted font-medium mb-4">No push notifications yet.</p>
        <Link
          href="/notifications/new"
          className="btn-press-motion inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-brand-primary text-white text-sm font-bold px-4 py-2.5 hover:bg-[#d4640a] active:translate-y-[1px] motion-reduce:active:translate-y-0"
        >
          Compose notification
        </Link>
      </div>
    )
  }

  return <DataTable columns={columns} data={notifications} />
}
