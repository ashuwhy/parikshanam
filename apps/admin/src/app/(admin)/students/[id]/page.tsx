import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { BackLink } from '@/components/BackLink'

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const [{ data: profile }, { data: emailRow }, { data: purchases }, { data: progress }] = await Promise.all([
    admin.from('profiles').select('*').eq('id', id).single(),
    admin.from('admin_user_emails').select('email').eq('id', id).single(),
    admin.from('purchases').select('*, course:courses(title)').eq('user_id', id).order('created_at', { ascending: false }),
    admin.from('user_progress').select('*, lesson:lessons(title), quiz:quizzes(title)').eq('user_id', id),
  ])
  if (!profile) notFound()

  async function deactivate() {
    'use server'
    const admin = createAdminClient()
    await admin.from('profiles').update({ is_active: false }).eq('id', id)
  }

  return (
    <div>
      <BackLink href="/students" className="mb-4">
        Students
      </BackLink>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">
        {profile.full_name ?? 'Unnamed Student'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface-elevated border border-ui-border rounded-[var(--radius-card)] p-5">
          <h2 className="font-bold text-brand-navy mb-3">Profile</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-text-muted">Email</dt><dd className="text-text-body text-right">{emailRow?.email ?? '-'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-text-muted">Phone</dt><dd className="text-text-body text-right">{profile.phone ?? '-'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-text-muted">School</dt><dd className="text-text-body text-right">{profile.school ?? '-'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-text-muted">Class</dt><dd className="text-text-body text-right">{profile.class_level_id ? `Class ${profile.class_level_id}` : '-'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-text-muted">Status</dt>
              <dd><span className={`text-xs px-2 py-0.5 rounded-full ${profile.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{profile.is_active ? 'Active' : 'Inactive'}</span></dd>
            </div>
          </dl>
          {profile.is_active && (
            <form action={deactivate} className="mt-4">
              <button type="submit" className="text-xs text-red-500 hover:underline">Deactivate account</button>
            </form>
          )}
        </div>

        <div className="bg-surface-elevated border border-ui-border rounded-[var(--radius-card)] p-5">
          <h2 className="font-bold text-brand-navy mb-3">Purchases ({purchases?.length ?? 0})</h2>
          <ul className="divide-y divide-ui-border text-sm">
            {purchases?.map((p) => (
              <li key={p.id} className="py-2 flex justify-between gap-4">
                <span className="text-text-body">{p.course?.title ?? '-'}</span>
                <span className="text-text-muted shrink-0">₹{(p.amount / 100).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-surface-elevated border border-ui-border rounded-[var(--radius-card)] p-5">
        <h2 className="font-bold text-brand-navy mb-3">Progress ({progress?.length ?? 0} items completed)</h2>
        <ul className="divide-y divide-ui-border text-sm max-h-64 overflow-y-auto">
          {progress?.map((p) => (
            <li key={p.id} className="py-2 flex justify-between gap-4">
              <span className="text-text-body">{p.lesson?.title ?? p.quiz?.title ?? '-'}</span>
              <span className="text-text-muted shrink-0">{new Date(p.completed_at).toLocaleDateString('en-IN')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
