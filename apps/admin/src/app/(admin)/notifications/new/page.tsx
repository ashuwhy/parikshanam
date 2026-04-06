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

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-surface-elevated p-6 md:p-8 rounded-[var(--radius-card)] border border-ui-border order-2 lg:order-1"
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

        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-8">
            <p className="text-[11px] uppercase tracking-widest text-text-muted font-black mb-3 text-center lg:text-left">
              How it looks on a phone
            </p>
            <div className="bg-[#f2f2f7] rounded-[40px] w-full max-w-[320px] mx-auto lg:mx-0 lg:ml-auto border-[8px] border-white shadow-xl overflow-hidden relative min-h-[420px] lg:min-h-[560px]">
              <div className="absolute top-0 inset-x-0 h-6 bg-transparent z-10 flex justify-center pointer-events-none">
                <div className="w-32 h-6 bg-white rounded-b-3xl" />
              </div>

              <div className="pt-16 px-4 pb-8">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-white/80 max-w-full">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Image
                      src="/app-icon.png"
                      alt=""
                      width={36}
                      height={36}
                      className="size-9 rounded-lg shrink-0 shadow-sm"
                    />
                    <span className="text-xs font-bold text-neutral-800 uppercase tracking-widest">
                      Parikshanam
                    </span>
                    <span className="text-[10px] text-neutral-500 ml-auto tabular-nums">now</span>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 leading-tight mb-1">
                    {title || 'Notification title'}
                  </h4>
                  <p className="text-sm text-neutral-600 leading-snug">
                    {body || 'Your message appears here as you type…'}
                  </p>
                  {dataUrl?.trim() ? (
                    <p className="mt-3 pt-3 border-t border-neutral-200/80 text-[11px] text-neutral-500 leading-snug">
                      <span className="font-bold text-neutral-600">Tap opens: </span>
                      <code className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700 break-all">
                        {dataUrl.trim()}
                      </code>
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
