import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { StatCard } from '@/components/StatCard'
import { PendingCourseReviewLink } from '@/components/PendingCourseReviewLink'

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

  const revenueRupees = (purchases?.reduce((sum, p) => sum + p.amount, 0) ?? 0) / 100
  const revenueDisplay = revenueRupees >= 100000
    ? `₹${(revenueRupees / 100000).toFixed(1)}L`
    : `₹${revenueRupees.toLocaleString('en-IN')}`

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6 animate-fade-in-up">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up delay-1">
        <StatCard label="Students" value={studentCount ?? 0} />
        <StatCard label="Teachers" value={teacherCount ?? 0} />
        <StatCard label="Active Courses" value={courseCount ?? 0} />
        <StatCard label="Revenue" value={revenueDisplay} accent />
      </div>

      {pendingCourses && pendingCourses.length > 0 && (
        <div className="bg-surface-elevated rounded-[var(--radius-card)] border border-ui-border p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),0_8px_24px_-12px_rgba(27,58,110,0.1)] animate-fade-in-up delay-2">
          <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy mb-3">
            Pending Approval ({pendingCourses.length})
          </h2>
          <ul className="divide-y divide-ui-border">
            {pendingCourses.map((c) => (
              <li key={c.id} className="py-2 flex items-center justify-between gap-3">
                <span className="text-sm text-text-body">{c.title}</span>
                <PendingCourseReviewLink courseId={c.id} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
