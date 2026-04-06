import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseServiceRoleKey } from '@/lib/env'

const payloadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  body: z.string().min(1, 'Body is required').max(500),
  audience: z.enum(['all', 'class', 'course', 'user']),
  audience_target_id: z.string().optional(),
  data: z.record(z.any()).optional().default({}),
  send_now: z.boolean().default(true),
  scheduled_at: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Verify admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Parse payload
    const bodyText = await request.text()
    const parsed = payloadSchema.safeParse(JSON.parse(bodyText))
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.issues }, { status: 400 })
    }

    const payload = parsed.data
    const scheduledAt = payload.send_now ? new Date().toISOString() : (payload.scheduled_at ?? new Date().toISOString())
    const status = payload.send_now ? 'processing' : 'pending'

    // 3. Insert notification stub into DB
    const { createClient: createDirectClient } = await import('@supabase/supabase-js')
    const { getSupabasePublicConfig } = await import('@/lib/env')
    const supabaseAdmin = createDirectClient(getSupabasePublicConfig().url, getSupabaseServiceRoleKey())

    const { data: notification, error: insertError } = await supabaseAdmin
      .from('notifications')
      .insert({
        title: payload.title,
        body: payload.body,
        data: payload.data,
        audience: payload.audience,
        audience_target_id: payload.audience_target_id ?? null,
        status: status,
        scheduled_at: scheduledAt,
        sent_by: user.id,
      })
      .select()
      .single()

    if (insertError || !notification) {
      throw insertError || new Error('Failed to create notification')
    }

    if (!payload.send_now) {
      // If scheduled, cron will pick it up later
      return NextResponse.json({ success: true, message: 'Notification scheduled', id: notification.id })
    }

    // 4. Send now: Fetch tokens logic
    let tokenQuery = supabaseAdmin.from('push_tokens').select('token, user_id')

    if (payload.audience === 'user') {
      tokenQuery = tokenQuery.eq('user_id', payload.audience_target_id)
    } else if (payload.audience === 'class') {
      // Find all users in this class
      const { data: usersInClass } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('class_level_id', payload.audience_target_id)
      const userIds = usersInClass?.map(u => u.id) || []
      if (userIds.length > 0) {
        tokenQuery = tokenQuery.in('user_id', userIds)
      } else {
        tokenQuery = tokenQuery.eq('user_id', 'invalid_id') // no tokens
      }
    } else if (payload.audience === 'course') {
      // Find all users who purchased this course
      const { data: purchases } = await supabaseAdmin
        .from('purchases')
        .select('user_id')
        .eq('course_id', payload.audience_target_id)
      const userIds = purchases?.map(p => p.user_id) || []
      if (userIds.length > 0) {
        tokenQuery = tokenQuery.in('user_id', userIds)
      } else {
        tokenQuery = tokenQuery.eq('user_id', 'invalid_id')
      }
    }

    const { data: tokensData } = await tokenQuery
    const rawTokens = tokensData?.map(t => t.token) || []
    
    // Deduplicate tokens
    const tokens = [...new Set(rawTokens)]

    if (tokens.length === 0) {
      // No tokens found
      await supabaseAdmin.from('notifications').update({ status: 'sent', sent_count: 0 }).eq('id', notification.id)
      return NextResponse.json({ success: true, message: 'No devices found for audience', sentCount: 0 })
    }

    // 5. Send to Expo Push API
    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title: payload.title,
      body: payload.body,
      data: payload.data,
    }))

    // Expo Push API accepts max 100 messages at a time
    const CHUNK_SIZE = 100
    const chunks = []
    for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
      chunks.push(messages.slice(i, i + CHUNK_SIZE))
    }

    let successCount = 0
    let hasFailure = false

    for (const chunk of chunks) {
      try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chunk),
        })

        if (!response.ok) {
          console.error('Expo Push API error:', await response.text())
          hasFailure = true
        } else {
          successCount += chunk.length
        }
      } catch (err) {
        console.error('Fetch error calling Expo API:', err)
        hasFailure = true
      }
    }

    // 6. Update notification status
    await supabaseAdmin
      .from('notifications')
      .update({
        status: hasFailure && successCount === 0 ? 'failed' : 'sent',
        sent_count: successCount,
      })
      .eq('id', notification.id)

    return NextResponse.json({
      success: true,
      sentCount: successCount,
      message: hasFailure ? 'Sent with some errors' : 'Successfully sent API request'
    })
  } catch (error: any) {
    console.error('Error sending push notification:', error)
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 })
  }
}
