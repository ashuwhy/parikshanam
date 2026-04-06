import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { NotificationsTable } from '@/components/NotificationsTable'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  const admin = createAdminClient()
  const { data: notifications } = await admin
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })

  const rows = notifications ?? []

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy animate-fade-in-up">
            Notifications ({rows.length})
          </h1>
          <p className="text-text-muted text-sm mt-1 animate-fade-in-up delay-1">
            Push notifications sent to users
          </p>
        </div>
        <Link
          href="/notifications/new"
          className="btn-press-motion inline-flex items-center justify-center gap-2 self-start md:self-auto rounded-[var(--radius-button)] bg-brand-primary text-white text-sm font-bold px-4 py-2.5 hover:bg-[#d4640a] active:translate-y-[1px] motion-reduce:active:translate-y-0 animate-fade-in-up delay-2"
        >
          <Plus className="size-4 shrink-0 stroke-[2.5]" aria-hidden />
          New notification
        </Link>
      </div>
      <div className="animate-fade-in-up delay-3">
        <NotificationsTable notifications={rows} />
      </div>
    </div>
  )
}
