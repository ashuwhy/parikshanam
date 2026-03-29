import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { getSupabasePublicConfig } from '@/lib/env'
import { supabaseSsrCookieOptions } from '@/lib/supabase/ssrCookie'

export async function middleware(request: NextRequest) {
  let supabaseUrl: string
  let anonKey: string
  try {
    const cfg = getSupabasePublicConfig()
    supabaseUrl = cfg.url
    anonKey = cfg.anonKey
  } catch {
    return new NextResponse(
      'Admin misconfigured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your host (e.g. Vercel → Environment Variables) for Production and Preview, then redeploy.',
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } },
    )
  }
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseUrl,
    anonKey,
    {
      ...supabaseSsrCookieOptions,
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Allow auth routes through
  if (pathname.startsWith('/login') || pathname.startsWith('/api')) {
    return supabaseResponse
  }

  if (!user) {
    const redirectResponse = NextResponse.redirect(new URL('/login', request.url))

    supabaseResponse.headers.getSetCookie().forEach((cookieStr) => {
      redirectResponse.headers.append('Set-Cookie', cookieStr)
    })

    return redirectResponse
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    const redirectResponse = NextResponse.redirect(new URL('/login', request.url))

    supabaseResponse.headers.getSetCookie().forEach((cookieStr) => {
      redirectResponse.headers.append('Set-Cookie', cookieStr)
    })

    return redirectResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
