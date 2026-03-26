import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { StatCard } from '@/components/StatCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const admin = createAdminClient()

  const [
    { count: studentCount },
    { count: teacherCount },
    { count: courseCount },
    { data: purchases },
    { data: pendingCourses },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
    supabase.from('courses').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    admin.from('purchases').select('amount').eq('status', 'completed'),
    supabase.from('courses').select('id, title, status').eq('status', 'pending_review').limit(10),
  ])

  const revenue = purchases?.reduce((sum, p) => sum + p.amount, 0) ?? 0
  const revenueDisplay = revenue >= 100000
    ? `₹${(revenue / 100000).toFixed(1)}L`
    : `₹${(revenue / 100).toFixed(0)}`

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Students" value={studentCount ?? 0} />
        <StatCard label="Teachers" value={teacherCount ?? 0} />
        <StatCard label="Active Courses" value={courseCount ?? 0} />
        <StatCard label="Revenue" value={revenueDisplay} accent />
      </div>

      {pendingCourses && pendingCourses.length > 0 && (
        <div className="bg-white rounded-2xl border border-ui-border p-5">
          <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy mb-3">
            Pending Approval ({pendingCourses.length})
          </h2>
          <ul className="divide-y divide-ui-border">
            {pendingCourses.map((c) => (
              <li key={c.id} className="py-2 flex items-center justify-between">
                <span className="text-sm text-foreground">{c.title}</span>
                <a href={`/courses/${c.id}`} className="text-xs text-brand-primary font-medium">
                  Review →
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
