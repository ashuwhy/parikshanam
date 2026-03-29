import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { getSupabasePublicConfig } from '@/lib/env'
import { supabaseSsrCookieOptions } from '@/lib/supabase/ssrCookie'

export async function createClient() {
  const { url, anonKey } = getSupabasePublicConfig()
  const cookieStore = await cookies()
  return createServerClient(
    url,
    anonKey,
    {
      ...supabaseSsrCookieOptions,
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {}
        },
      },
    },
  )
}
