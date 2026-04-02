import { createAdminClient } from '@/lib/supabase/admin'
import { StudentsTable, type StudentRow } from '@/components/StudentsTable'

export default async function StudentsPage() {
  const admin = createAdminClient()
  const { data: students } = await admin
    .from('profiles')
    .select('id, full_name, phone, is_active, created_at, school:schools(name)')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">
        Students ({students?.length ?? 0})
      </h1>
      <StudentsTable students={(students ?? []) as unknown as StudentRow[]} />
    </div>
  )
}
