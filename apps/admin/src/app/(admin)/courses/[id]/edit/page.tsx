import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { CourseForm } from '@/components/CourseForm'
import { redirect, notFound } from 'next/navigation'
import type { CourseFormData } from '@/components/CourseForm'

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: course }, { data: olympiadTypes }, { data: classLevels }] = await Promise.all([
    supabase.from('courses').select('*').eq('id', id).single(),
    supabase.from('olympiad_types').select('id, label').order('label'),
    supabase.from('class_levels').select('id, label').order('id'),
  ])
  if (!course) notFound()

  async function updateCourse(data: CourseFormData) {
    'use server'
    const admin = createAdminClient()
    // thumbnail_url is managed separately via ThumbnailUpload — never overwrite it here
    await admin.from('courses').update({
      title: data.title,
      subtitle: data.subtitle ?? null,
      description: data.description ?? null,
      price: data.price * 100,
      mrp: data.mrp ? data.mrp * 100 : null,
      olympiad_type_id: data.olympiad_type_id ?? null,
      min_class_id: data.min_class_id ?? null,
      max_class_id: data.max_class_id ?? null,
    }).eq('id', id)
    redirect(`/courses/${id}`)
  }

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">
        Edit: {course.title}
      </h1>
      <CourseForm
        defaultValues={{
          title: course.title,
          subtitle: course.subtitle ?? undefined,
          description: course.description ?? undefined,
          price: course.price / 100,
          mrp: course.mrp ? course.mrp / 100 : undefined,
          olympiad_type_id: course.olympiad_type_id ?? undefined,
          min_class_id: course.min_class_id ?? undefined,
          max_class_id: course.max_class_id ?? undefined,
        }}
        olympiadTypes={olympiadTypes ?? []}
        classLevels={classLevels ?? []}
        onSubmit={updateCourse}
        submitLabel="Save Changes"
      />
    </div>
  )
}
