import { createClient } from '@/lib/supabase/server'
import { CoursesTable } from '@/components/CoursesTable'
import { CoursesNewLink } from '@/components/CoursesNewLink'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('*, olympiad_type:olympiad_types(*)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">Courses</h1>
        <CoursesNewLink />
      </div>
      <CoursesTable courses={courses ?? []} />
    </div>
  )
}
