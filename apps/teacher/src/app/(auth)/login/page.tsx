'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white rounded-2xl p-8 border border-ui-border w-full max-w-sm shadow-sm">
        <div className="mb-6 text-center">
          <div className="inline-block bg-brand-teal text-white text-xs font-bold px-3 py-1 rounded-lg mb-3">
            📖 TEACHER
          </div>
          <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">
            Parikshanam
          </h1>
          <p className="text-sm text-gray-500 mt-1">Teacher Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-brand-primary text-white font-bold rounded-xl py-2.5 border-b-4 border-brand-dark disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
