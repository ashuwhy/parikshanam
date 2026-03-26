import { createClient } from '@/lib/supabase/server'
import { CourseForm } from '@/components/CourseForm'
import { redirect } from 'next/navigation'
import type { CourseFormData } from '@/components/CourseForm'

export default async function NewCoursePage() {
  const supabase = await createClient()
  const [{ data: olympiadTypes }, { data: classLevels }] = await Promise.all([
    supabase.from('olympiad_types').select('id, label').order('label'),
    supabase.from('class_levels').select('id, label').order('id'),
  ])

  async function createCourse(data: CourseFormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: course, error } = await supabase.from('courses').insert({
      ...data,
      status: 'pending_review',
      created_by: user!.id,
    }).select('id').single()
    if (error) throw new Error(error.message)
    redirect(`/courses/${course.id}`)
  }

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-2">New Course</h1>
      <p className="text-sm text-amber-600 mb-6 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        Your course will be submitted for admin review before going live.
      </p>
      <CourseForm
        olympiadTypes={olympiadTypes ?? []}
        classLevels={classLevels ?? []}
        onSubmit={createCourse}
        submitLabel="Submit for Review"
      />
    </div>
  )
}
