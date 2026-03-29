import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { supabaseSsrCookieOptions } from "@/lib/supabase/ssrCookie";

/**
 * Auth gate for the App Router (Next.js 16+ `proxy` replaces `middleware`).
 * Unauthenticated users hitting protected routes are sent to /login with ?next=…
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...supabaseSsrCookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public course landing: /course/<id> only (lessons/quizzes stay behind auth)
  const isCourseDetailOnly = /^\/course\/[^/]+\/?$/.test(pathname);

  if (user && pathname.startsWith("/login")) {
    const next = request.nextUrl.searchParams.get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      return NextResponse.redirect(new URL(next, request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/explore") ||
    pathname.startsWith("/my-courses") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/ysc") ||
    (pathname.startsWith("/course/") && !isCourseDetailOnly) ||
    pathname.startsWith("/onboarding");

  if (!user && isProtected) {
    const login = new URL("/login", request.url);
    const returnPath = `${pathname}${request.nextUrl.search}`;
    login.searchParams.set("next", returnPath);
    return NextResponse.redirect(login);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
