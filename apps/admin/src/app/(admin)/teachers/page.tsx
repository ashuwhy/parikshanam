'use client'

import { useState, useEffect } from 'react'
import { UserPlus } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

const col = createColumnHelper<Profile>()
const columns = [
  col.accessor('full_name', { header: 'Name', cell: (i) => i.getValue() ?? '-' }),
  col.accessor('is_active', {
    header: 'Status',
    cell: (i) => (
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          i.getValue() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        }`}
      >
        {i.getValue() ? 'Active' : 'Inactive'}
      </span>
    ),
  }),
]

const inputClass =
  'w-full border border-ui-border rounded-[var(--radius-control-sm)] px-3 py-2 text-sm text-text-body focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus:outline-none'

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Profile[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [sending, setSending] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .eq('role', 'teacher')
      .then(({ data }) => {
        setTeachers(data ?? [])
      })
  }, [])

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    await fetch('/api/invites/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, name: inviteName }),
    })
    setSending(false)
    setShowInvite(false)
    setInviteEmail('')
    setInviteName('')
    alert('Invite sent!')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">
          Teachers
        </h1>
        <button
          type="button"
          onClick={() => setShowInvite(true)}
          className="btn-press-motion inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-brand-primary text-white text-sm font-bold px-4 py-2 hover:bg-[#d4640a] active:translate-y-[1px] motion-reduce:active:translate-y-0"
        >
          <UserPlus className="size-4 shrink-0 stroke-[2]" aria-hidden />
          Invite Teacher
        </button>
      </div>

      <DataTable columns={columns} data={teachers} />

      {showInvite && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-elevated rounded-[var(--radius-card)] p-6 w-full max-w-sm border border-ui-border">
            <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy text-lg mb-4">
              Invite Teacher
            </h2>
            <form onSubmit={sendInvite} className="space-y-3">
              <input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Teacher name"
                className={inputClass}
              />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email address"
                required
                className={inputClass}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowInvite(false)}
                  className="btn-press-motion flex-1 rounded-[var(--radius-button)] border-2 border-ui-border bg-surface-elevated py-2 text-sm text-text-body hover:bg-surface-subtle active:translate-y-[1px] motion-reduce:active:translate-y-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-press-motion flex-1 rounded-[var(--radius-button)] bg-brand-primary text-white py-2 text-sm font-bold hover:bg-[#d4640a] active:translate-y-[1px] motion-reduce:active:translate-y-0 disabled:opacity-60 disabled:active:translate-y-0"
                >
                  {sending ? 'Sending…' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
