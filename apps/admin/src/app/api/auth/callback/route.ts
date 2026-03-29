import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

import { getSupabasePublicConfig } from '@/lib/env'
import { supabaseSsrCookieOptions } from '@/lib/supabase/ssrCookie'

/**
 * OAuth PKCE callback. Session cookies must be set on the returned NextResponse.
 * createClient() from server.ts uses cookies() which often cannot set cookies in Route Handlers
 * (errors are swallowed), so the session never persisted and users loop back to /login.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  let next = url.searchParams.get('next') ?? '/dashboard'
  if (!next.startsWith('/') || next.startsWith('//')) {
    next = '/dashboard'
  }

  const redirect = (pathname: string) =>
    NextResponse.redirect(new URL(pathname, url.origin))

  if (!code) {
    return redirect('/login?error=auth')
  }

  const pendingCookies: { name: string; value: string; options: CookieOptions }[] = []
  const { url: supabaseUrl, anonKey } = getSupabasePublicConfig()

  const supabase = createServerClient(
    supabaseUrl,
    anonKey,
    {
      ...supabaseSsrCookieOptions,
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          pendingCookies.push(...cookiesToSet)
        },
      },
    },
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return redirect('/login?error=auth')
  }

  const response = redirect(next)
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })

  return response
}
