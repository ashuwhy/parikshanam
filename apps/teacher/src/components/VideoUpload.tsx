'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface VideoUploadProps {
  courseId: string
  lessonId: string
  onUploaded: (path: string) => void
}

export function VideoUpload({ courseId, lessonId, onUploaded }: VideoUploadProps) {
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
    setProgress(0)

    const res = await fetch('/api/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, lessonId, mimeType: file.type }),
    })
    if (!res.ok) {
      setError('Failed to get upload URL')
      setProgress(null)
      return
    }
    const { token, path } = await res.json()

    const { error: uploadError } = await supabase.storage
      .from('course-videos')
      .uploadToSignedUrl(path, token, file, {
        onUploadProgress: ({ loaded, total }) => {
          if (total) setProgress(Math.round((loaded / total) * 100))
        },
      })

    if (uploadError) {
      setError(uploadError.message)
      setProgress(null)
      return
    }

    await fetch(`/api/lessons/${lessonId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_storage_path: path }),
    })

    setProgress(null)
    onUploaded(path)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      {progress === null ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-ui-border rounded-xl px-6 py-4 text-sm text-gray-400 hover:border-brand-primary hover:text-brand-primary transition-colors"
        >
          📹 Choose video file (mp4/webm, max 5 GB)
        </button>
      ) : (
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
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
}
