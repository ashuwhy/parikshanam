'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/DataTable'

type NotificationRow = {
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

const columns: ColumnDef<NotificationRow, any>[] = [
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setNotifications(data as NotificationRow[])
      })
  }, [])

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-1 animate-fade-in-up">
            Notifications
          </h1>
          <p className="text-text-muted text-sm font-medium animate-fade-in-up delay-1">
            Push notifications sent to users
          </p>
        </div>
        <Link
          href="/notifications/new"
          className="inline-flex items-center gap-2 bg-brand-primary text-white px-4 py-2.5 rounded-xl text-sm transition-all hover:bg-brand-primary/90 hover:scale-[1.02] active:scale-95 shadow-sm font-bold"
        >
          <Plus size={18} strokeWidth={2.5} />
          New Notification
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-ui-border overflow-hidden shadow-sm">
        <DataTable columns={columns} data={notifications} />
      </div>
    </div>
  )
}
