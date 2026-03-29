import { createAdminClient } from '@/lib/supabase/admin'
import { Activity, User, Clock, Terminal } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ActivityPage() {
  const admin = createAdminClient()
  const { data: events } = await admin
    .from('tracking_events')
    .select('*, profile:profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">
          Activity Log
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Real-time stream of student and platform events
        </p>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="divide-y divide-ui-border">
          {events?.length === 0 && (
            <div className="p-12 text-center">
              <Activity className="size-10 text-text-muted/30 mx-auto mb-3" />
              <p className="text-text-muted font-medium">No events tracked yet.</p>
            </div>
          )}
          {events?.map((e) => (
            <div key={e.id} className="p-4 hover:bg-surface-subtle transition-colors flex items-start gap-4">
              <div className="size-10 rounded-xl bg-surface-subtle border border-ui-border flex items-center justify-center shrink-0">
                <Terminal size={18} className="text-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-brand-navy truncate">
                    {e.event_name.replace(/_/g, ' ')}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted whitespace-nowrap bg-surface-subtle px-2 py-0.5 rounded-full border border-ui-border">
                    <Clock size={10} />
                    {new Date(e.created_at).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <User size={12} />
                    {e.profile?.full_name ?? 'Anonymous'}
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-brand-primary/60">
                    {e.source}
                  </span>
                </div>
                {Object.keys(e.properties).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(e.properties as Record<string, any>).map(([k, v]) => (
                      <span key={k} className="text-[9px] bg-brand-navy/5 text-brand-navy px-1.5 py-0.5 rounded border border-brand-navy/10 font-mono">
                        {k}: {String(v)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
