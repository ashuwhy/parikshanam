import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSupabasePublicConfig, getSupabaseServiceRoleKey } from '@/lib/env'

const EXPO_PUSH_API = 'https://exp.host/--/api/v2/push/send'

// Called by Vercel Cron every minute — picks up any notifications
// with status='pending' whose scheduled_at <= now() and sends them.
export async function GET(request: Request) {
  // Protect this endpoint with CRON_SECRET env var
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseAdmin = createClient(getSupabasePublicConfig().url, getSupabaseServiceRoleKey())

  // 1. Find all pending notifications that are due
  const { data: pendingNotifications, error: fetchError } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_at', new Date().toISOString())
    .limit(50) // Process max 50 at a time per cron tick

  if (fetchError) {
    console.error('Error fetching pending notifications:', fetchError)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  if (!pendingNotifications || pendingNotifications.length === 0) {
    return NextResponse.json({ success: true, processed: 0 })
  }

  let processedCount = 0

  for (const notification of pendingNotifications) {
    // Mark as processing to prevent double-sends
    await supabaseAdmin
      .from('notifications')
      .update({ status: 'processing' })
      .eq('id', notification.id)
      .eq('status', 'pending') // Optimistic lock

    // Fetch tokens based on audience
    let tokenQuery = supabaseAdmin.from('push_tokens').select('token')

    if (notification.audience === 'user') {
      tokenQuery = tokenQuery.eq('user_id', notification.audience_target_id)
    } else if (notification.audience === 'class') {
      const { data: usersInClass } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('class_level_id', notification.audience_target_id)
      const userIds = usersInClass?.map((u: { id: string }) => u.id) || []
      tokenQuery = userIds.length > 0
        ? tokenQuery.in('user_id', userIds)
        : tokenQuery.eq('user_id', '__none__')
    } else if (notification.audience === 'course') {
      const { data: purchases } = await supabaseAdmin
        .from('purchases')
        .select('user_id')
        .eq('course_id', notification.audience_target_id)
      const userIds = purchases?.map((p: { user_id: string }) => p.user_id) || []
      tokenQuery = userIds.length > 0
        ? tokenQuery.in('user_id', userIds)
        : tokenQuery.eq('user_id', '__none__')
    }

    const { data: tokensData } = await tokenQuery
    const tokens = [...new Set((tokensData || []).map((t: { token: string }) => t.token))]

    if (tokens.length === 0) {
      await supabaseAdmin.from('notifications').update({ status: 'sent', sent_count: 0 }).eq('id', notification.id)
      processedCount++
      continue
    }

    // Build messages
    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
    }))

    // Chunk into batches of 100
    const CHUNK_SIZE = 100
    let successCount = 0
    let hasFailure = false

    for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
      const chunk = messages.slice(i, i + CHUNK_SIZE)
      try {
        const res = await fetch(EXPO_PUSH_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(chunk),
        })
        if (!res.ok) {
          console.error('Expo push error for notification', notification.id, await res.text())
          hasFailure = true
        } else {
          successCount += chunk.length
        }
      } catch (err) {
        console.error('Fetch error for notification', notification.id, err)
        hasFailure = true
      }
    }

    await supabaseAdmin.from('notifications').update({
      status: hasFailure && successCount === 0 ? 'failed' : 'sent',
      sent_count: successCount,
    }).eq('id', notification.id)

    processedCount++
  }

  return NextResponse.json({ success: true, processed: processedCount })
}
