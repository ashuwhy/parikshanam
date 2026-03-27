'use client'

import { useState } from 'react'
import { LessonThumbnailUpload } from './LessonThumbnailUpload'
import { VideoUpload } from './VideoUpload'

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

export function LessonEditor({ courseId, modules: initialModules }: LessonEditorProps) {
  const [modules, setModules] = useState(initialModules)
  const [error, setError] = useState<string | null>(null)
  const [replacingVideo, setReplacingVideo] = useState<Set<string>>(new Set())

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
                  {/* Thumbnail */}
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

                  {/* Title + duration + video */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{lesson.title}</span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {lesson.duration_minutes > 0 ? `${lesson.duration_minutes} min` : '—'}
                      </span>
                    </div>

                    {!lesson.video_storage_path || replacingVideo.has(lesson.id) ? (
                      <div className="mt-2">
                        <VideoUpload
                          courseId={courseId}
                          lessonId={lesson.id}
                          onUploaded={(path, durationMinutes) => {
                            setReplacingVideo((prev) => {
                              const next = new Set(prev)
                              next.delete(lesson.id)
                              return next
                            })
                            setModules(modules.map((m) => ({
                              ...m,
                              lessons: m.lessons.map((l) =>
                                l.id === lesson.id
                                  ? { ...l, video_storage_path: path, duration_minutes: durationMinutes }
                                  : l,
                              ),
                            })))
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-green-600">✓ Video uploaded</p>
                        <button
                          type="button"
                          onClick={() => setReplacingVideo((prev) => new Set([...prev, lesson.id]))}
                          className="text-xs text-brand-primary hover:underline"
                        >
                          Replace
                        </button>
                      </div>
                    )}
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
