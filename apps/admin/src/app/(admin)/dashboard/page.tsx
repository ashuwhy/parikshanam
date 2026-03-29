import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { StatCard } from '@/components/StatCard'
import { PendingCourseReviewLink } from '@/components/PendingCourseReviewLink'
import Link from 'next/link'
import { Activity } from 'lucide-react'

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

  const { data: recentEvents } = await admin
    .from('tracking_events')
    .select('event_name, created_at, source')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-1 animate-fade-in-up">
        Dashboard
      </h1>
      <p className="text-text-muted text-sm mb-8 animate-fade-in-up delay-1">
        Overview of your platform&apos;s performance
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={revenueDisplay} accent />
        <StatCard label="Total Students" value={studentCount ?? 0} />
        <StatCard label="Total Courses" value={courseCount ?? 0} />
        <StatCard label="Teachers" value={teacherCount ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Pending Approval */}
        <div className="lg:col-span-2 space-y-8">
          {pendingCourses && pendingCourses.length > 0 && (
            <div className="bg-surface-elevated rounded-[var(--radius-card)] border border-ui-border p-5 animate-fade-in-up delay-2">
              <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy mb-3">
                Pending Approval ({pendingCourses.length})
              </h2>
              <div className="space-y-3">
                {pendingCourses.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-white border border-ui-border rounded-xl">
                    <span className="font-medium text-brand-navy truncate pr-4">{c.title}</span>
                    <Link
                      href={`/courses/${c.id}`}
                      className="text-xs font-bold text-brand-primary hover:underline underline-offset-4 shrink-0 transition-all"
                    >
                      Review →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="p-8 text-center bg-brand-navy/5 rounded-[var(--radius-card)] border-2 border-dashed border-brand-navy/10 animate-fade-in-up delay-3">
            <p className="text-brand-navy font-bold">More metrics coming soon</p>
            <p className="text-text-muted text-sm">Targeting conversion rates and student drop-off points.</p>
          </div>
        </div>

        {/* Right: Recent Activity */}
        <div className="bg-white border border-ui-border rounded-[var(--radius-card)] p-5 h-fit animate-fade-in-up delay-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-nunito-var)] font-bold text-brand-navy">
              Recent Activity
            </h2>
            <Link href="/activity" className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentEvents?.map((e, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="size-2 rounded-full bg-brand-primary shrink-0 mt-1.5" />
                <div>
                  <p className="text-[13px] font-bold text-brand-navy leading-snug">
                    {e.event_name.replace(/_/g, ' ')}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {new Date(e.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • {e.source}
                  </p>
                </div>
              </div>
            ))}
            {(!recentEvents || recentEvents.length === 0) && (
              <p className="text-xs text-text-muted italic">No recent activity detected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
