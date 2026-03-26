'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type State = 'loading' | 'valid' | 'invalid' | 'submitting' | 'done'

export default function InvitePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const router = useRouter()
  const supabase = createClient()

  const [state, setState] = useState<State>('loading')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (!token) { setState('invalid'); setReason('No token provided'); return }
    fetch(`/api/invites/verify?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) { setEmail(data.email); setState('valid') }
        else { setState('invalid'); setReason(data.reason ?? 'Invalid invite') }
      })
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('submitting')
    setError(null)

    const res = await fetch('/api/invites/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, fullName: name }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setState('valid')
      return
    }

    // Sign in the new teacher
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError('Account created. Please sign in at /login.')
      setState('valid')
      return
    }
    setState('done')
    router.push('/dashboard')
  }

  if (state === 'loading') return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Verifying invite…</p>
    </div>
  )

  if (state === 'invalid') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 border border-ui-border max-w-sm text-center">
        <p className="text-2xl mb-2">⚠️</p>
        <h1 className="font-[family-name:var(--font-nunito-var)] font-black text-brand-navy text-xl mb-2">Invalid Invite</h1>
        <p className="text-gray-500 text-sm">{reason}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white rounded-2xl p-8 border border-ui-border w-full max-w-sm shadow-sm">
        <div className="mb-6 text-center">
          <div className="inline-block bg-brand-teal text-white text-xs font-bold px-3 py-1 rounded-lg mb-3">
            📖 TEACHER
          </div>
          <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">Set up your account</h1>
          <p className="text-sm text-gray-400 mt-1">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={state === 'submitting'}
            className="w-full bg-brand-primary text-white font-bold rounded-xl py-2.5 border-b-4 border-brand-dark disabled:opacity-60"
          >
            {state === 'submitting' ? 'Creating account…' : 'Accept Invitation'}
          </button>
        </form>
      </div>
    </div>
  )
}
