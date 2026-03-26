import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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
    const admin = createAdminClient()
    const { data: course, error } = await admin.from('courses').insert({
      ...data,
      status: 'active',
      is_active: true,
    }).select('id').single()
    if (error) throw new Error(error.message)
    redirect(`/courses/${course.id}`)
  }

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">New Course</h1>
      <CourseForm
        olympiadTypes={olympiadTypes ?? []}
        classLevels={classLevels ?? []}
        onSubmit={createCourse}
        submitLabel="Create Course"
      />
    </div>
  )
}
