'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

type School = { id: string; name: string; created_at: string }

const inputClass =
  'w-full border border-ui-border rounded-[var(--radius-control-sm)] px-3 py-2 text-sm text-text-body focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus:outline-none'

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/schools')
      .then((r) => r.json())
      .then((data: School[]) => setSchools(data))
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const res = await fetch('/api/schools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    })
    if (res.ok) {
      const school: School = await res.json()
      setSchools((prev) => [...prev, school].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
      setShowAdd(false)
    } else {
      const { error: msg } = await res.json() as { error: string }
      setError(msg)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this school? Students already assigned will keep their existing record.')) return
    setDeletingId(id)
    await fetch('/api/schools', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSchools((prev) => prev.filter((s) => s.id !== id))
    setDeletingId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">
          Schools ({schools.length})
        </h1>
        <button
          type="button"
          onClick={() => { setShowAdd(true); setError(null) }}
          className="btn-press-motion inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-brand-primary text-white text-sm font-bold px-4 py-2 hover:bg-[#d4640a] active:translate-y-[1px] motion-reduce:active:translate-y-0"
        >
          <Plus className="size-4 shrink-0 stroke-[2.5]" aria-hidden />
          Add School
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : schools.length === 0 ? (
        <p className="text-sm text-text-muted">No schools yet.</p>
      ) : (
        <div className="bg-surface-elevated border border-ui-border rounded-[var(--radius-card)] divide-y divide-ui-border">
          {schools.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-text-body font-medium">{s.name}</span>
              <button
                type="button"
                onClick={() => handleDelete(s.id)}
                disabled={deletingId === s.id}
                className="text-text-muted hover:text-red-500 transition-colors disabled:opacity-40"
                aria-label={`Remove ${s.name}`}
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-elevated rounded-[var(--radius-card)] p-6 w-full max-w-sm border border-ui-border">
            <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy text-lg mb-4">
              Add School
            </h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Army Public School, Pune"
                required
                className={inputClass}
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="btn-press-motion flex-1 rounded-[var(--radius-button)] border-2 border-ui-border bg-surface-elevated py-2 text-sm text-text-body hover:bg-surface-subtle active:translate-y-[1px] motion-reduce:active:translate-y-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !newName.trim()}
                  className="btn-press-motion flex-1 rounded-[var(--radius-button)] bg-brand-primary text-white py-2 text-sm font-bold hover:bg-[#d4640a] active:translate-y-[1px] motion-reduce:active:translate-y-0 disabled:opacity-60 disabled:active:translate-y-0"
                >
                  {saving ? 'Saving…' : 'Add School'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
