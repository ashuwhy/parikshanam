'use client'

import { useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  courseId: string
  lessonId: string
  currentUrl: string | null
  onUploaded: (url: string) => void
}

const ACCEPTED = 'image/jpeg,image/png,image/webp'
const MAX_BYTES = 5 * 1024 * 1024

export function LessonThumbnailUpload({ courseId, lessonId, currentUrl, onUploaded }: Props) {
  const [url, setUrl] = useState<string | null>(currentUrl)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleFile(file: File) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('JPEG, PNG or WebP only')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Max 5 MB')
      return
    }

    setError(null)
    setLoading(true)

    const res = await fetch('/api/upload-thumbnail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, lessonId, mimeType: file.type }),
    })
    if (!res.ok) { setError('Upload URL failed'); setLoading(false); return }
    const { token, path, publicUrl } = await res.json()

    const { error: uploadError } = await supabase.storage
      .from('course-thumbnails')
      .uploadToSignedUrl(path, token, file, { upsert: true })
    if (uploadError) { setError(uploadError.message); setLoading(false); return }

    const patchRes = await fetch(`/api/lessons/${lessonId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thumbnail_url: publicUrl }),
    })
    if (!patchRes.ok) { setError('Saved storage but DB update failed'); setLoading(false); return }

    setLoading(false)
    const busted = `${publicUrl}?t=${Date.now()}`
    setUrl(busted)
    onUploaded(busted)
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      <button
        type="button"
        title={url ? 'Replace thumbnail' : 'Upload thumbnail'}
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="relative w-[88px] h-[50px] rounded-[var(--radius-control-sm)] overflow-hidden border-2 border-dashed border-ui-border hover:border-brand-primary transition-colors shrink-0 bg-surface-subtle flex items-center justify-center"
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Lesson thumbnail" className="w-full h-full object-cover" />
        ) : null}

        {/* Upload / loading overlay */}
        <span
          className={`absolute inset-0 flex items-center justify-center text-[10px] font-medium transition-colors
            ${loading ? 'bg-surface-elevated/80 text-brand-primary' : url ? 'bg-black/0 hover:bg-black/50 text-transparent hover:text-white' : 'text-text-muted'}`}
        >
          {loading ? '…' : url ? 'Replace' : <ImagePlus className="size-5 shrink-0 stroke-[2]" aria-hidden />}
        </span>
      </button>

      {error && <p className="text-red-500 text-[10px] leading-tight max-w-[88px]">{error}</p>}
    </div>
  )
}
