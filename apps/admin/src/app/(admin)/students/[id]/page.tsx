import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'

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
      <Link href="/students" className="text-sm text-gray-400 hover:text-brand-primary mb-4 inline-block">← Students</Link>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">
        {profile.full_name ?? 'Unnamed Student'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-ui-border rounded-2xl p-5">
          <h2 className="font-bold text-brand-navy mb-3">Profile</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-400">Email</dt><dd>{emailRow?.email ?? '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Phone</dt><dd>{profile.phone ?? '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Class</dt><dd>{profile.class_level_id ? `Class ${profile.class_level_id}` : '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Status</dt>
              <dd><span className={`text-xs px-2 py-0.5 rounded-full ${profile.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{profile.is_active ? 'Active' : 'Inactive'}</span></dd>
            </div>
          </dl>
          {profile.is_active && (
            <form action={deactivate} className="mt-4">
              <button type="submit" className="text-xs text-red-500 hover:underline">Deactivate account</button>
            </form>
          )}
        </div>

        <div className="bg-white border border-ui-border rounded-2xl p-5">
          <h2 className="font-bold text-brand-navy mb-3">Purchases ({purchases?.length ?? 0})</h2>
          <ul className="divide-y divide-ui-border text-sm">
            {purchases?.map((p) => (
              <li key={p.id} className="py-2 flex justify-between">
                <span>{p.course?.title ?? '—'}</span>
                <span className="text-gray-400">₹{p.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white border border-ui-border rounded-2xl p-5">
        <h2 className="font-bold text-brand-navy mb-3">Progress ({progress?.length ?? 0} items completed)</h2>
        <ul className="divide-y divide-ui-border text-sm max-h-64 overflow-y-auto">
          {progress?.map((p) => (
            <li key={p.id} className="py-2 flex justify-between">
              <span>{p.lesson?.title ?? p.quiz?.title ?? '—'}</span>
              <span className="text-gray-400">{new Date(p.completed_at).toLocaleDateString('en-IN')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
