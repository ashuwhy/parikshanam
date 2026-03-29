import { PostHog } from "posthog-node";

function getHost(): string {
  return process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!key) return;

  const client = new PostHog(key, { host: getHost() });
  try {
    client.capture({ distinctId, event, properties });
  } finally {
    await client.shutdown();
  }
}
