'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'

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
      scheduled_at: new Date(Date.now() + 3600000).toISOString().slice(0, 16), // 1 hour from now
    },
  })

  const audience = watch('audience')
  const title = watch('title')
  const body = watch('body')
  const sendNow = watch('send_now')

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
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div>
        <Link href="/notifications" className="inline-flex items-center text-sm font-bold text-text-muted hover:text-brand-navy mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to notifications
        </Link>
        <h1 className="text-2xl md:text-3xl font-black text-brand-navy lowercase tracking-tight">
          compose.
        </h1>
        <p className="text-sm text-text-muted mt-1 font-bold">
          Send a push notification to users' devices
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 md:p-8 rounded-3xl border border-ui-border shadow-sm">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-bold border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-text-muted font-black mb-1.5 ml-1">
                Notification Title
              </label>
              <input
                {...register('title')}
                placeholder="e.g. New Math Course Available!"
                className="w-full bg-surface-subtle border border-ui-border rounded-2xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-text-muted font-black mb-1.5 ml-1">
                Message Body
              </label>
              <textarea
                {...register('body')}
                placeholder="Unlock your potential with our new advanced math program..."
                rows={4}
                className="w-full bg-surface-subtle border border-ui-border rounded-2xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none"
              />
              {errors.body && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.body.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-text-muted font-black mb-1.5 ml-1">
                Target Audience
              </label>
              <select
                {...register('audience')}
                className="w-full bg-surface-subtle border border-ui-border rounded-xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer"
              >
                <option value="all">All Users</option>
                <option value="class">Specific Class Level</option>
                <option value="course">Purchasers of a Course</option>
                <option value="user">Specific User</option>
              </select>
            </div>

            {audience !== 'all' && (
              <div className="animate-fade-in">
                <label className="block text-[11px] uppercase tracking-widest text-text-muted font-black mb-1.5 ml-1">
                  Target ID (Class ID, Course ID, or User ID)
                </label>
                <input
                  {...register('audience_target_id')}
                  placeholder={`Enter ${audience} ID`}
                  className="w-full bg-surface-subtle border border-ui-border rounded-2xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-text-muted font-black mb-1.5 ml-1">
                Deep Link (Optional)
              </label>
              <input
                {...register('data_url')}
                placeholder="e.g. /course/123-abc"
                className="w-full bg-surface-subtle border border-ui-border rounded-2xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
              />
              <p className="text-[10px] text-text-muted ml-1 mt-1">Screen to open when user taps the notification.</p>
            </div>

            <div className="pt-4 border-t border-ui-border space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-subtle rounded-2xl border border-ui-border">
                <div>
                  <span className="block text-sm font-bold text-brand-navy">Send Immediately</span>
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Default behavior</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register('send_now')} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
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
                    className="w-full bg-surface-subtle border border-ui-border rounded-2xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-3.5 px-6 rounded-2xl font-black tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary/90 transition-colors shadow-sm"
          >
            {submitting ? (
              'Sending...'
            ) : (
              <>
                <Send size={18} strokeWidth={2.5} />
                Send Notification
              </>
            )}
          </button>
        </form>

        {/* Live Preview */}
        <div className="hidden md:block">
          <div className="sticky top-8 bg-[#f2f2f7] rounded-[40px] w-[320px] h-[650px] mx-auto border-[8px] border-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-6 bg-transparent z-10 flex justify-center">
              <div className="w-32 h-6 bg-white rounded-b-3xl"></div>
            </div>
            
            <div className="pt-16 px-4">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-white max-w-full">
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-4 bg-brand-primary rounded-sm flex items-center justify-center">
                    <span className="text-[8px] font-black text-white">P</span>
                  </div>
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-widest opacity-80">Parikshanam</span>
                  <span className="text-[10px] text-neutral-500 ml-auto">now</span>
                </div>
                <h4 className="font-bold text-sm text-neutral-900 leading-tight mb-0.5">
                  {title || 'Notification Title'}
                </h4>
                <p className="text-sm text-neutral-600 leading-snug">
                  {body || 'Your message body will appear here when you start typing...'}
                </p>
              </div>
            </div>

            {/* Fake lock screen gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
