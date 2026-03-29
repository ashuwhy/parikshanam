import { createBrowserClient } from "@supabase/ssr";

import { supabaseSsrCookieOptions } from "@/lib/supabase/ssrCookie";

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (supabaseClient) return supabaseClient;

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    supabaseSsrCookieOptions,
  );

  return supabaseClient;
}

