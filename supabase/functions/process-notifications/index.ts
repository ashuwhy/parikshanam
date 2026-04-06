import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const EXPO_PUSH_API = 'https://exp.host/--/api/v2/push/send';

Deno.serve(async (req: Request) => {
  // 1. Setup Supabase Admin Client
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  console.log("Checking for pending notifications...");

  // 2. Find all pending notifications that are due
  const { data: pendingNotifications, error: fetchError } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_at', new Date().toISOString())
    .limit(50);

  if (fetchError) {
    console.error('Error fetching pending notifications:', fetchError);
    return new Response(JSON.stringify({ error: 'DB error' }), { status: 500 });
  }

  if (!pendingNotifications || pendingNotifications.length === 0) {
    console.log("No pending notifications due at this time.");
    return new Response(JSON.stringify({ success: true, processed: 0 }), { status: 200 });
  }

  let processedCount = 0;

  for (const notification of pendingNotifications) {
    console.log(`Processing notification: ${notification.id} - "${notification.title}"`);

    // Mark as processing to prevent double-sends (optimistic lock)
    const { error: updateError } = await supabaseAdmin
      .from('notifications')
      .update({ status: 'processing' })
      .eq('id', notification.id)
      .eq('status', 'pending');

    if (updateError) {
       console.log(`Skipping notification ${notification.id} as it was already picked up.`);
       continue;
    }

    // Fetch tokens based on audience
    let tokenQuery = supabaseAdmin.from('push_tokens').select('token');

    if (notification.audience === 'user') {
      tokenQuery = tokenQuery.eq('user_id', notification.audience_target_id);
    } else if (notification.audience === 'class') {
      const { data: usersInClass } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('class_level_id', notification.audience_target_id);
      const userIds = usersInClass?.map((u: { id: string }) => u.id) || [];
      tokenQuery = userIds.length > 0 
        ? tokenQuery.in('user_id', userIds) 
        : tokenQuery.eq('user_id', '__none__');
    } else if (notification.audience === 'course') {
      const { data: purchases } = await supabaseAdmin
        .from('purchases')
        .select('user_id')
        .eq('course_id', notification.audience_target_id);
      const userIds = purchases?.map((p: { user_id: string }) => p.user_id) || [];
      tokenQuery = userIds.length > 0 
        ? tokenQuery.in('user_id', userIds) 
        : tokenQuery.eq('user_id', '__none__');
    }

    const { data: tokensData } = await tokenQuery;
    const tokens = [...new Set((tokensData || []).map((t: { token: string }) => t.token))];

    if (tokens.length === 0) {
      console.log(`No tokens found for audience "${notification.audience}" - ${notification.audience_target_id}`);
      await supabaseAdmin.from('notifications').update({ status: 'sent', sent_count: 0 }).eq('id', notification.id);
      processedCount++;
      continue;
    }

    console.log(`Sending to ${tokens.length} tokens...`);

    // Build messages for Expo
    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
    }));

    // Chunk into batches of 100 for Expo Push API
    const CHUNK_SIZE = 100;
    let successCount = 0;
    let hasFailure = false;

    for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
      const chunk = messages.slice(i, i + CHUNK_SIZE);
      try {
        const res = await fetch(EXPO_PUSH_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(chunk),
        });
        
        if (!res.ok) {
          const errText = await res.text();
          console.error(`Expo push error for chunk in notification ${notification.id}:`, errText);
          hasFailure = true;
        } else {
          successCount += chunk.length;
        }
      } catch (err) {
        console.error(`Fetch failure for notification ${notification.id}:`, err);
        hasFailure = true;
      }
    }

    // Final status update
    await supabaseAdmin.from('notifications').update({
      status: hasFailure && successCount === 0 ? 'failed' : 'sent',
      sent_count: successCount,
    }).eq('id', notification.id);

    processedCount++;
  }

  return new Response(JSON.stringify({ success: true, processed: processedCount }), { 
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
});
