'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  courseId: string
  currentPath: string | null
}

export function IntroVideoUpload({ courseId, currentPath }: Props) {
  const [path, setPath] = useState<string | null>(currentPath)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleFile(file: File) {
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file (.mp4 or .webm)')
      return
    }
    if (file.size > 5 * 1024 * 1024 * 1024) {
      setError('File must be under 5 GB')
      return
    }

    setError(null)
    setProgress(10)

    // Get signed upload URL (reuse existing upload-url route)
    const res = await fetch('/api/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, lessonId: `intro`, mimeType: file.type }),
    })
    if (!res.ok) { setError('Failed to get upload URL'); setProgress(null); return }
    const { token, path: storagePath } = await res.json()

    setProgress(40)
    const { error: uploadError } = await supabase.storage
      .from('course-videos')
      .uploadToSignedUrl(storagePath, token, file)

    if (uploadError) { setError(uploadError.message); setProgress(null); return }

    setProgress(80)
    const patchRes = await fetch(`/api/courses/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intro_video_path: storagePath }),
    })
    if (!patchRes.ok) { setError('Uploaded but failed to save path'); setProgress(null); return }

    setProgress(null)
    setPath(storagePath)
  }

  return (
    <div className="bg-white border border-ui-border rounded-2xl p-5">
      <h3 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy mb-1">
        Intro / Preview Video
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        Shown to students before purchase. Keep it under 3 minutes.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      {path ? (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <span>✓</span>
            <span className="font-medium">Intro video uploaded</span>
            <span className="text-green-500 truncate max-w-[200px]">{path.split('/').pop()}</span>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs text-brand-primary hover:underline ml-4 shrink-0"
          >
            Replace
          </button>
        </div>
      ) : progress !== null ? (
        <div className="border border-ui-border rounded-xl px-4 py-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-foreground">Uploading…</span>
            <span className="font-medium text-brand-primary">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-ui-border rounded-xl px-6 py-6 text-sm text-gray-400 hover:border-brand-primary hover:text-brand-primary transition-colors"
        >
          🎬 Upload intro video (mp4 / webm, max 5 GB)
        </button>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
}
