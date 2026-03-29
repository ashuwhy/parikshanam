import posthog from "posthog-js";

import type { AnalyticsEventName } from "./events";

export function captureClient(
  event: AnalyticsEventName | string,
  properties?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) return;
  try {
    posthog.capture(event, properties);
  } catch {
    /* PostHog unavailable */
  }
}
