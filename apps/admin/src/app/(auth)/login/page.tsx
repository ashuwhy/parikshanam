'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Hexagon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const inputClass =
  'w-full border border-ui-border rounded-[var(--radius-control-sm)] px-3 py-2 text-sm text-text-body focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus:outline-none'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/api/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-surface-elevated rounded-[var(--radius-card)] p-8 border border-ui-border w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-1.5 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-[var(--radius-control-sm)] mb-3">
            <Hexagon className="size-3.5 shrink-0 stroke-[2.5]" aria-hidden />
            ADMIN
          </div>
          <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">
            Parikshanam
          </h1>
          <p className="text-sm text-text-muted mt-1">Admin Panel</p>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="btn-press-motion w-full flex items-center justify-center gap-3 rounded-[var(--radius-button)] border-2 border-ui-border bg-surface-elevated py-2.5 text-sm font-semibold text-text-body hover:bg-surface-subtle active:translate-y-[1px] motion-reduce:active:translate-y-0 disabled:opacity-60 disabled:active:translate-y-0 mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
            />
          </svg>
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-ui-border" />
          <span className="text-xs text-text-muted font-medium">or</span>
          <div className="flex-1 h-px bg-ui-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="btn-press-motion w-full rounded-[var(--radius-button)] bg-brand-primary text-white font-bold py-2.5 hover:bg-[#d4640a] active:translate-y-[1px] motion-reduce:active:translate-y-0 disabled:opacity-60 disabled:active:translate-y-0"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
