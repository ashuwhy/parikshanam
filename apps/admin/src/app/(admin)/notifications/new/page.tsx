'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Send } from 'lucide-react'
import { BackLink } from '@/components/BackLink'

const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  body: z.string().min(1, 'Message body is required').max(500),
  audience: z.enum(['all', 'class', 'course', 'user']),
  audience_target_id: z.string().optional(),
  data_url: z.string().optional(),
  send_now: z.boolean().default(true),
  scheduled_at: z.string().optional(),
})

type FormValues = z.infer<typeof notificationSchema>

const inputClass =
  'w-full bg-surface-subtle border border-ui-border rounded-2xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all'

export default function NewNotificationPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      body: '',
      audience: 'all',
      send_now: true,
      data_url: '',
      scheduled_at: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    },
  })

  const audience = watch('audience')
  const title = watch('title')
  const body = watch('body')
  const sendNow = watch('send_now')
  const dataUrl = watch('data_url')

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true)
    setErrorMsg('')
    try {
      const payload = {
        ...data,
        data: data.data_url ? { url: data.data_url } : {},
      }
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const resData = await res.json()

      if (!res.ok) {
        throw new Error(resData.error || 'Failed to send notification')
      }

      router.push('/notifications')
      router.refresh()
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-8">
        <div className="mb-2">
          <BackLink href="/notifications">Notifications</BackLink>
        </div>
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-1 animate-fade-in-up">
          Compose notification
        </h1>
        <p className="text-text-muted text-sm mt-1 animate-fade-in-up delay-1">
          Send a push notification to users&apos; phones. It appears like the preview on the right.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-surface-elevated p-6 md:p-8 rounded-[var(--radius-card)] border border-ui-border"
        >
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-bold border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-text-muted font-black mb-1.5 ml-1">
                Notification title
              </label>
              <input
                {...register('title')}
                placeholder="e.g. New Math course available"
                className={inputClass}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-text-muted font-black mb-1.5 ml-1">
                Message body
              </label>
              <textarea
                {...register('body')}
                placeholder="Short message shown under the title on the device"
                rows={4}
                className={`${inputClass} resize-none`}
              />
              {errors.body && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.body.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-text-muted font-black mb-1.5 ml-1">
                Target audience
              </label>
              <select
                {...register('audience')}
                className={`${inputClass} cursor-pointer rounded-xl`}
              >
                <option value="all">All users</option>
                <option value="class">Specific class level</option>
                <option value="course">Purchasers of a course</option>
                <option value="user">Specific user</option>
              </select>
            </div>

            {audience !== 'all' && (
              <div className="animate-fade-in">
                <label className="block text-[11px] uppercase tracking-widest text-text-muted font-black mb-1.5 ml-1">
                  Target ID
                </label>
                <input
                  {...register('audience_target_id')}
                  placeholder={`Paste the ${audience} UUID from the dashboard`}
                  className={inputClass}
                />
                <p className="text-sm text-text-muted mt-1.5 ml-1">
                  Class ID, course ID, or user ID — same IDs you see in Supabase or the admin tables.
                </p>
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-text-muted font-black mb-1.5 ml-1">
                Open in app (optional)
              </label>
              <input
                {...register('data_url')}
                placeholder="/course/550e8400-e29b-41d4-a716-446655440000"
                className={inputClass}
                autoComplete="off"
              />
              <div className="mt-2 ml-1 space-y-2 text-sm text-text-muted leading-relaxed">
                <p>
                  When the user taps the notification, the app navigates to this route. Enter an{' '}
                  <strong className="text-text-body font-semibold">in-app path only</strong>, not a
                  website URL — no <code className="text-xs bg-surface-subtle px-1 py-0.5 rounded">https://</code>{' '}
                  and no domain.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <code className="text-xs bg-surface-subtle px-1 py-0.5 rounded">/course/&lt;course-id&gt;</code>{' '}
                    — course home
                  </li>
                  <li>
                    <code className="text-xs bg-surface-subtle px-1 py-0.5 rounded">
                      /course/&lt;course-id&gt;/lesson/&lt;lesson-id&gt;
                    </code>{' '}
                    — a specific lesson
                  </li>
                  <li>Leave empty to open the app on the home screen (same as if you use the app as a student).</li>
                </ul>
                <p className="text-xs text-text-muted/90">
                  IDs are the same UUIDs you use elsewhere in the admin; if you test on your phone
                  while logged in as admin, the app still opens the screen when the path is valid.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-ui-border space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-subtle rounded-2xl border border-ui-border">
                <div>
                  <span className="block text-sm font-bold text-brand-navy">Send immediately</span>
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                    Default
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register('send_now')} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary" />
                </label>
              </div>

              {!sendNow && (
                <div className="animate-fade-in">
                  <label className="block text-[11px] uppercase tracking-widest text-text-muted font-black mb-1.5 ml-1">
                    Schedule for later
                  </label>
                  <input
                    type="datetime-local"
                    {...register('scheduled_at')}
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-press-motion w-full flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-brand-primary text-white py-3.5 px-6 text-sm font-black tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d4640a] active:translate-y-[1px] motion-reduce:active:translate-y-0"
          >
            {submitting ? (
              'Sending…'
            ) : (
              <>
                <Send size={18} strokeWidth={2.5} />
                Send notification
              </>
            )}
          </button>
        </form>

        <aside className="lg:sticky lg:top-8 w-full max-w-[340px] mx-auto lg:max-w-none lg:mx-0 lg:ml-auto">
          <h2 className="text-[11px] uppercase tracking-widest text-text-muted font-black mb-4 text-center lg:text-left">
            Preview on device
          </h2>

          {/* Device shell: light frame + screen + single notification card */}
          <div className="rounded-[1.75rem] border border-neutral-200/90 bg-white p-2 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)]">
            <div className="overflow-hidden rounded-[1.35rem] bg-[#E8E8ED]">
              <div className="flex justify-center pt-2.5 pb-1" aria-hidden>
                <div className="h-[22px] w-[88px] rounded-full bg-black/10" />
              </div>

              <div className="px-3 pb-5 pt-3">
                <div
                  role="img"
                  aria-label="Push notification preview"
                  className="rounded-[14px] bg-white p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-black/5"
                >
                  <div className="flex gap-3">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-[12px] bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
                      <Image
                        src="/app-icon.png"
                        alt=""
                        width={44}
                        height={44}
                        className="size-11 object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-[family-name:var(--font-nunito-var)] font-black text-[13px] uppercase tracking-wide text-neutral-900">
                          Parikshanam
                        </span>
                        <time className="shrink-0 text-[11px] font-medium text-neutral-400 tabular-nums">
                          now
                        </time>
                      </div>
                      <p className="mt-1 font-bold text-[15px] leading-snug text-neutral-950">
                        {title || 'Notification title'}
                      </p>
                      <p className="mt-1 text-[13px] leading-[1.45] text-neutral-600">
                        {body || 'Your message appears here as you type…'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {dataUrl?.trim() ? (
            <p className="mt-4 text-center lg:text-left text-xs text-text-muted leading-relaxed">
              <span className="font-semibold text-text-body">Tap opens: </span>
              <code className="rounded bg-surface-subtle px-1.5 py-0.5 text-[11px] text-text-body break-all">
                {dataUrl.trim()}
              </code>
            </p>
          ) : (
            <p className="mt-4 text-center lg:text-left text-xs text-text-muted">
              Add an in-app path above to show where the app opens when tapped.
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}
