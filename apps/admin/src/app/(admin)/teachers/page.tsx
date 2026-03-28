'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

const col = createColumnHelper<Profile>()
const columns = [
  col.accessor('full_name', { header: 'Name', cell: (i) => i.getValue() ?? '-' }),
  col.accessor('is_active', { header: 'Status', cell: (i) => (
    <span className={`text-xs px-2 py-0.5 rounded-full ${i.getValue() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      {i.getValue() ? 'Active' : 'Inactive'}
    </span>
  )}),
]

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Profile[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [sending, setSending] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('profiles').select('*').eq('role', 'teacher').then(({ data }) => {
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
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">Teachers</h1>
        <button
          onClick={() => setShowInvite(true)}
          className="bg-brand-primary text-white text-sm font-bold px-4 py-2 rounded-xl border-b-4 border-brand-dark"
        >
          + Invite Teacher
        </button>
      </div>

      <DataTable columns={columns} data={teachers} />

      {showInvite && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy text-lg mb-4">Invite Teacher</h2>
            <form onSubmit={sendInvite} className="space-y-3">
              <input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Teacher name"
                className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm"
              />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowInvite(false)} className="flex-1 border border-ui-border rounded-xl py-2 text-sm">Cancel</button>
                <button type="submit" disabled={sending} className="flex-1 bg-brand-primary text-white rounded-xl py-2 text-sm font-bold border-b-2 border-brand-dark disabled:opacity-60">
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
