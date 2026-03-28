'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  courseId: string
  currentUrl: string | null
}

const ACCEPTED = 'image/jpeg,image/png,image/webp'
const MAX_BYTES = 5 * 1024 * 1024

export function ThumbnailUpload({ courseId, currentUrl }: Props) {
  const [url, setUrl] = useState<string | null>(currentUrl)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleFile(file: File) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please select a JPEG, PNG, or WebP image')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Image must be under 5 MB')
      return
    }

    setError(null)
    setProgress(10)

    const res = await fetch('/api/upload-thumbnail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, mimeType: file.type }),
    })
    if (!res.ok) { setError('Failed to get upload URL'); setProgress(null); return }
    const { token, path, publicUrl } = await res.json()

    setProgress(40)
    const { error: uploadError } = await supabase.storage
      .from('course-thumbnails')
      .uploadToSignedUrl(path, token, file, { upsert: true })

    if (uploadError) { setError(uploadError.message); setProgress(null); return }

    setProgress(80)
    const patchRes = await fetch(`/api/courses/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thumbnail_url: publicUrl }),
    })
    if (!patchRes.ok) { setError('Uploaded but failed to save URL'); setProgress(null); return }

    setProgress(null)
    // Append timestamp to bust the browser cache when the same filename is replaced
    setUrl(`${publicUrl}?t=${Date.now()}`)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="bg-surface-elevated border border-ui-border rounded-[var(--radius-card)] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),0_8px_24px_-12px_rgba(27,58,110,0.08)]">
      <h3 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy mb-1">
        Course Thumbnail
      </h3>
      <p className="text-xs text-text-muted mb-4">
        Shown on course cards. JPEG, PNG, or WebP - 16:9 recommended, max 5 MB.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      {progress !== null ? (
        <div className="border border-ui-border rounded-[var(--radius-nested)] px-4 py-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-brand-navy">Uploading…</span>
            <span className="font-medium text-brand-primary">{progress}%</span>
          </div>
          <div className="h-2 bg-surface-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : url ? (
        <div className="relative rounded-[var(--radius-nested)] overflow-hidden border border-ui-border group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Course thumbnail"
            className="w-full h-44 object-cover block"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold text-white bg-black/60 hover:bg-black/80 rounded-[var(--radius-control-sm)] px-4 py-2"
            >
              Replace image
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`w-full border-2 border-dashed rounded-[var(--radius-nested)] px-6 py-12 text-sm transition-colors ${
            dragging
              ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
              : 'border-ui-border text-text-muted hover:border-brand-primary hover:text-brand-primary'
          }`}
        >
          Click or drag an image here
          <span className="block mt-1 text-xs opacity-70">JPEG · PNG · WebP - max 5 MB</span>
        </button>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
}
