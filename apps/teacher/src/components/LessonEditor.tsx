'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { VideoUpload } from './VideoUpload'

interface Lesson {
  id: string
  title: string
  order_index: number
  duration_minutes: number
  is_preview: boolean
  video_storage_path: string | null
  content_text: string | null
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
  const supabase = createClient()

  async function addModule() {
    const title = prompt('Module title:')
    if (!title) return
    const { data } = await supabase
      .from('modules')
      .insert({ course_id: courseId, title, order_index: modules.length })
      .select()
      .single()
    if (data) setModules([...modules, { ...data, lessons: [] }])
  }

  async function addLesson(moduleId: string) {
    const title = prompt('Lesson title:')
    if (!title) return
    const mod = modules.find((m) => m.id === moduleId)!
    const { data } = await supabase
      .from('lessons')
      .insert({ module_id: moduleId, course_id: courseId, title, order_index: mod.lessons.length })
      .select()
      .single()
    if (data) {
      setModules(modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, data] } : m,
      ))
    }
  }

  return (
    <div className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{lesson.title}</span>
                  <span className="text-xs text-gray-400">{lesson.duration_minutes}min</span>
                </div>
                {!lesson.video_storage_path && (
                  <div className="mt-2">
                    <VideoUpload
                      courseId={courseId}
                      lessonId={lesson.id}
                      onUploaded={(path) => {
                        setModules(modules.map((m) => ({
                          ...m,
                          lessons: m.lessons.map((l) =>
                            l.id === lesson.id ? { ...l, video_storage_path: path } : l,
                          ),
                        })))
                      }}
                    />
                  </div>
                )}
                {lesson.video_storage_path && (
                  <p className="text-xs text-green-600 mt-1">✓ Video uploaded</p>
                )}
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
