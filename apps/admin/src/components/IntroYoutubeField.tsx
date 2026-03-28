'use client'

import { useEffect, useState } from 'react'

interface Props {
  courseId: string
  introPath: string | null
}

function looksLikeYoutubeId(s: string) {
  const t = s.trim()
  return t.length > 0 && !t.includes('/') && !t.startsWith('http')
}

export function IntroYoutubeField({ courseId, introPath }: Props) {
  const [value, setValue] = useState(introPath ?? '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    setValue(introPath ?? '')
    setMsg(null)
  }, [courseId, introPath])

  async function save() {
    setMsg(null)
    setSaving(true)
    const trimmed = value.trim()
    const res = await fetch(`/api/courses/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intro_video_path: trimmed || null }),
    })
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    setSaving(false)
    if (!res.ok) {
      setMsg(data.error ?? 'Save failed')
      return
    }
  }

  const previewId = value.trim()

  return (
    <div className="bg-surface-elevated border border-ui-border rounded-[var(--radius-card)] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),0_8px_24px_-12px_rgba(27,58,110,0.08)]">
      <h3 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy mb-1">
        Intro / preview video (YouTube)
      </h3>
      <p className="text-xs text-text-muted mb-4">
        Shown on the course page before purchase. Paste the YouTube video ID only (not the full URL).
      </p>

      <label className="text-sm font-bold text-brand-navy">YouTube video ID</label>
      <input
        type="text"
        placeholder="e.g. dQw4w9WgXcQ"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-1 w-full border border-ui-border rounded-[var(--radius-control-sm)] px-4 py-2 text-sm text-text-body focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus:outline-none"
      />
      <p className="text-xs text-text-muted mt-1">
        From the URL: youtube.com/watch?v=
        <strong>THIS_PART</strong>
      </p>

      <button
        type="button"
        onClick={() => void save()}
        disabled={saving}
        className="btn-press-motion mt-3 text-sm font-bold px-4 py-2 rounded-[var(--radius-button)] bg-brand-primary text-white shadow-[0_3px_0_0_#a04f08] hover:bg-[#d4640a] active:translate-y-[2px] motion-reduce:active:translate-y-0 active:shadow-[0_1px_0_0_#a04f08] disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0_3px_0_0_#a04f08]"
      >
        {saving ? 'Saving…' : 'Save intro video'}
      </button>
      {msg && <p className="text-red-500 text-xs mt-2">{msg}</p>}

      {looksLikeYoutubeId(previewId) ? (
        <iframe
          title="YouTube intro preview"
          className="w-full aspect-video mt-4 rounded-[var(--radius-nested)] border border-ui-border"
          src={`https://www.youtube-nocookie.com/embed/${previewId.trim()}`}
          allowFullScreen
        />
      ) : null}
    </div>
  )
}
