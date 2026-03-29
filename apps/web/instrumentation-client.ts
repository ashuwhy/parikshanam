import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (typeof window !== "undefined" && key) {
  posthog.init(key, {
    api_host: host,
    defaults: "2026-01-30",
    capture_pageview: false,
    capture_pageleave: true,
  });
}
