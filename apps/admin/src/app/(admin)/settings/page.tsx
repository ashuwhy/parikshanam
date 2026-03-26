'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ClassLevel { id: string; label: string; min_age: number | null; max_age: number | null }
interface OlympiadType { id: string; label: string; color_hex: string }

export default function SettingsPage() {
  const supabase = createClient()
  const [classLevels, setClassLevels] = useState<ClassLevel[]>([])
  const [olympiadTypes, setOlympiadTypes] = useState<OlympiadType[]>([])

  const [newClass, setNewClass] = useState({ id: '', label: '', min_age: '', max_age: '' })
  const [newOlympiad, setNewOlympiad] = useState({ id: '', label: '', color_hex: '#4F46E5' })

  useEffect(() => {
    supabase.from('class_levels').select('*').order('id').then(({ data }) => setClassLevels(data ?? []))
    supabase.from('olympiad_types').select('*').order('label').then(({ data }) => setOlympiadTypes(data ?? []))
  }, [])

  async function addClass(e: React.FormEvent) {
    e.preventDefault()
    const { data } = await supabase.from('class_levels').insert({
      id: newClass.id,
      label: newClass.label,
      min_age: newClass.min_age ? Number(newClass.min_age) : null,
      max_age: newClass.max_age ? Number(newClass.max_age) : null,
    }).select().single()
    if (data) { setClassLevels([...classLevels, data]); setNewClass({ id: '', label: '', min_age: '', max_age: '' }) }
  }

  async function deleteClass(id: string) {
    if (!confirm(`Delete class level "${id}"? This will fail if courses reference it.`)) return
    const { error } = await supabase.from('class_levels').delete().eq('id', id)
    if (error) { alert(error.message); return }
    setClassLevels(classLevels.filter((c) => c.id !== id))
  }

  async function addOlympiad(e: React.FormEvent) {
    e.preventDefault()
    const { data } = await supabase.from('olympiad_types').insert(newOlympiad).select().single()
    if (data) { setOlympiadTypes([...olympiadTypes, data]); setNewOlympiad({ id: '', label: '', color_hex: '#4F46E5' }) }
  }

  async function deleteOlympiad(id: string) {
    if (!confirm(`Delete olympiad type "${id}"?`)) return
    const { error } = await supabase.from('olympiad_types').delete().eq('id', id)
    if (error) { alert(error.message); return }
    setOlympiadTypes(olympiadTypes.filter((o) => o.id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class Levels */}
        <div className="bg-white border border-ui-border rounded-2xl p-5">
          <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy mb-3">Class Levels</h2>
          <ul className="divide-y divide-ui-border text-sm mb-4">
            {classLevels.map((c) => (
              <li key={c.id} className="py-2 flex justify-between items-center">
                <span>{c.label} <span className="text-gray-400 text-xs">({c.min_age}–{c.max_age})</span></span>
                <button onClick={() => deleteClass(c.id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
              </li>
            ))}
          </ul>
          <form onSubmit={addClass} className="space-y-2 border-t border-ui-border pt-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Add class level</p>
            <input value={newClass.id} onChange={(e) => setNewClass({ ...newClass, id: e.target.value })} placeholder="ID (e.g. 11)" className="w-full border border-ui-border rounded-lg px-2 py-1.5 text-sm" required />
            <input value={newClass.label} onChange={(e) => setNewClass({ ...newClass, label: e.target.value })} placeholder="Label (e.g. Class 11)" className="w-full border border-ui-border rounded-lg px-2 py-1.5 text-sm" required />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={newClass.min_age} onChange={(e) => setNewClass({ ...newClass, min_age: e.target.value })} placeholder="Min age" className="border border-ui-border rounded-lg px-2 py-1.5 text-sm" />
              <input type="number" value={newClass.max_age} onChange={(e) => setNewClass({ ...newClass, max_age: e.target.value })} placeholder="Max age" className="border border-ui-border rounded-lg px-2 py-1.5 text-sm" />
            </div>
            <button type="submit" className="bg-brand-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg border-b-2 border-brand-dark">+ Add</button>
          </form>
        </div>

        {/* Olympiad Types */}
        <div className="bg-white border border-ui-border rounded-2xl p-5">
          <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy mb-3">Olympiad Types</h2>
          <ul className="divide-y divide-ui-border text-sm mb-4">
            {olympiadTypes.map((o) => (
              <li key={o.id} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: o.color_hex }} />
                  <span>{o.label}</span>
                </div>
                <button onClick={() => deleteOlympiad(o.id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
              </li>
            ))}
          </ul>
          <form onSubmit={addOlympiad} className="space-y-2 border-t border-ui-border pt-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Add olympiad type</p>
            <input value={newOlympiad.id} onChange={(e) => setNewOlympiad({ ...newOlympiad, id: e.target.value })} placeholder="ID (e.g. nmo)" className="w-full border border-ui-border rounded-lg px-2 py-1.5 text-sm" required />
            <input value={newOlympiad.label} onChange={(e) => setNewOlympiad({ ...newOlympiad, label: e.target.value })} placeholder="Label (e.g. NMO)" className="w-full border border-ui-border rounded-lg px-2 py-1.5 text-sm" required />
            <div className="flex items-center gap-2">
              <input type="color" value={newOlympiad.color_hex} onChange={(e) => setNewOlympiad({ ...newOlympiad, color_hex: e.target.value })} className="h-8 w-10 rounded border border-ui-border p-0.5" />
              <span className="text-xs text-gray-400">{newOlympiad.color_hex}</span>
            </div>
            <button type="submit" className="bg-brand-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg border-b-2 border-brand-dark">+ Add</button>
          </form>
        </div>
      </div>
    </div>
  )
}
