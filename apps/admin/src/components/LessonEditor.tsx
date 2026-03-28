'use client'

import { useEffect, useState } from 'react'
import { LessonThumbnailUpload } from './LessonThumbnailUpload'

interface Lesson {
  id: string
  title: string
  order_index: number
  duration_minutes: number
  is_preview: boolean
  video_storage_path: string | null
  content_text: string | null
  thumbnail_url: string | null
}

interface Module {
  id: string
  title: string
  order_index: number
  lessons: Lesson[]
}

interface LessonEditorProps {
  courseId: string
  modules: Module[]
}

function LessonYoutubeField({
  lesson,
  onSaved,
}: {
  lesson: Lesson
  onSaved: (video_storage_path: string | null) => void
}) {
  const [value, setValue] = useState(lesson.video_storage_path ?? '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    setValue(lesson.video_storage_path ?? '')
    setMsg(null)
  }, [lesson.id, lesson.video_storage_path])

  async function save() {
    setMsg(null)
    setSaving(true)
    const trimmed = value.trim()
    const res = await fetch(`/api/lessons/${lesson.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_storage_path: trimmed || null }),
    })
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    setSaving(false)
    if (!res.ok) {
      setMsg(data.error ?? 'Save failed')
      return
    }
    onSaved(trimmed || null)
  }

  const previewId = value.trim()

  return (
    <div className="mt-2 space-y-2">
      <div>
        <label className="text-sm font-bold text-brand-navy">YouTube video ID</label>
        <input
          type="text"
          placeholder="e.g. dQw4w9WgXcQ"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-1 w-full border border-ui-border rounded-xl px-4 py-2 text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">
          From the URL: youtube.com/watch?v=
          <strong>THIS_PART</strong>
        </p>
      </div>
      <button
        type="button"
        onClick={() => void save()}
        disabled={saving}
        className="text-sm font-bold px-4 py-2 rounded-xl bg-brand-primary text-white border-b-4 border-brand-dark disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save video ID'}
      </button>
      {msg && <p className="text-xs text-red-600">{msg}</p>}
      {previewId ? (
        <iframe
          title="YouTube preview"
          className="w-full aspect-video mt-2 rounded-xl border border-ui-border"
          src={`https://www.youtube-nocookie.com/embed/${previewId}`}
          allowFullScreen
        />
      ) : null}
    </div>
  )
}

export function LessonEditor({ courseId, modules: initialModules }: LessonEditorProps) {
  const [modules, setModules] = useState(initialModules)
  const [error, setError] = useState<string | null>(null)

  async function addModule() {
    const title = prompt('Module title:')
    if (!title) return
    setError(null)
    const res = await fetch('/api/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseId, title, order_index: modules.length }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Failed to add module'); return }
    setModules([...modules, { ...data, lessons: [] }])
  }

  async function addLesson(moduleId: string) {
    const title = prompt('Lesson title:')
    if (!title) return
    setError(null)
    const mod = modules.find((m) => m.id === moduleId)!
    const res = await fetch('/api/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module_id: moduleId, course_id: courseId, title, order_index: mod.lessons.length }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Failed to add lesson'); return }
    setModules(modules.map((m) =>
      m.id === moduleId ? { ...m, lessons: [...m.lessons, data] } : m,
    ))
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
      )}

      {modules.map((mod) => (
        <div key={mod.id} className="bg-white border border-ui-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy">
              {mod.title}
            </h3>
          </div>

          <div className="space-y-2 ml-4">
            {mod.lessons.map((lesson) => (
              <div key={lesson.id} className="border border-ui-border rounded-xl p-3 bg-background">
                <div className="flex items-start gap-3">
                  <LessonThumbnailUpload
                    courseId={courseId}
                    lessonId={lesson.id}
                    currentUrl={lesson.thumbnail_url ?? null}
                    onUploaded={(url) => {
                      setModules(modules.map((m) => ({
                        ...m,
                        lessons: m.lessons.map((l) =>
                          l.id === lesson.id ? { ...l, thumbnail_url: url } : l,
                        ),
                      })))
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{lesson.title}</span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {lesson.duration_minutes > 0 ? `${lesson.duration_minutes} min` : '-'}
                      </span>
                    </div>

                    <LessonYoutubeField
                      lesson={lesson}
                      onSaved={(path) => {
                        setModules(modules.map((m) => ({
                          ...m,
                          lessons: m.lessons.map((l) =>
                            l.id === lesson.id ? { ...l, video_storage_path: path } : l,
                          ),
                        })))
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => addLesson(mod.id)}
            className="mt-3 ml-4 text-sm text-brand-primary hover:underline"
          >
            + Add lesson
          </button>
        </div>
      ))}

      <button
        onClick={addModule}
        className="bg-brand-primary text-white text-sm font-bold px-4 py-2 rounded-xl border-b-4 border-brand-dark"
      >
        + Add module
      </button>
    </div>
  )
}
