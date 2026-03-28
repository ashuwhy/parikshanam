import { createClient } from '@/lib/supabase/server'
import { LessonEditor } from '@/components/LessonEditor'
import { IntroYoutubeField } from '@/components/IntroYoutubeField'
import { ThumbnailUpload } from '@/components/ThumbnailUpload'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: course } = await supabase.from('courses').select('*').eq('id', id).single()
  if (!course) notFound()

  const { data: modules } = await supabase
    .from('modules')
    .select('*, lessons(*)')
    .eq('course_id', id)
    .order('order_index')

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Link href="/courses" className="text-sm text-gray-400 hover:text-brand-primary">← Courses</Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">{course.title}</h1>
        <div className="flex gap-2 items-center">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            course.status === 'active' ? 'bg-green-100 text-green-700' :
            course.status === 'pending_review' ? 'bg-amber-100 text-amber-700' :
            'bg-gray-100 text-gray-600'
          }`}>{course.status}</span>
          <Link href={`/courses/${id}/edit`} className="text-sm text-brand-primary font-medium hover:underline">
            Edit details
          </Link>
        </div>
      </div>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ThumbnailUpload courseId={id} currentUrl={course.thumbnail_url ?? null} />
        <IntroYoutubeField courseId={id} introPath={course.intro_video_path ?? null} />
      </div>
      <LessonEditor courseId={id} modules={modules ?? []} />
    </div>
  )
}
