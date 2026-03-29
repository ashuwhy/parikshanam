import { PostHog } from "posthog-node";
import { createClient } from "@supabase/supabase-js";

function getHost(): string {
  return process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
}

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

  // 1. Log to Supabase (for Admin Activity Dashboard)
  try {
    const admin = createAdminClient();
    await admin.from("tracking_events").insert({
      event_name: event,
      user_id: distinctId.length === 36 ? distinctId : null, // Basic UUID check
      properties: properties ?? {},
      source: "web_server",
    });
  } catch (error) {
    console.error("[analytics] Supabase tracking failed:", error);
  }

  // 2. Log to PostHog
  if (posthogKey) {
    const client = new PostHog(posthogKey, { host: getHost() });
    try {
      client.capture({ distinctId, event, properties });
    } finally {
      await client.shutdown();
    }
  }
}
