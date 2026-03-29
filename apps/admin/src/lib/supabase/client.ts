import { createBrowserClient } from '@supabase/ssr'

import { getSupabasePublicConfig } from '@/lib/env'
import { supabaseSsrCookieOptions } from '@/lib/supabase/ssrCookie'

export function createClient() {
  const { url, anonKey } = getSupabasePublicConfig()
  return createBrowserClient(url, anonKey, supabaseSsrCookieOptions)
}
