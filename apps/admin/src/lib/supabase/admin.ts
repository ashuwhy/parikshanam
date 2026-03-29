import { createClient } from '@supabase/supabase-js'

import { getSupabasePublicConfig, getSupabaseServiceRoleKey } from '@/lib/env'

// Only import this in API routes (server-side). Never expose to client.
export function createAdminClient() {
  const { url } = getSupabasePublicConfig()
  return createClient(url, getSupabaseServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
