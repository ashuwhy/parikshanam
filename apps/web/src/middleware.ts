import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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

  // Always call getUser() - this refreshes the session if needed
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public course landing: /course/<id> only (lessons/quizzes stay behind auth)
  const isCourseDetailOnly = /^\/course\/[^/]+\/?$/.test(pathname);

  // Authenticated user trying to visit login → redirect to dashboard
  if (user && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated user trying to visit protected app or onboarding routes → login
  const isProtected = pathname.startsWith("/dashboard") ||
    pathname.startsWith("/explore") ||
    pathname.startsWith("/my-courses") ||
    pathname.startsWith("/profile") ||
    (pathname.startsWith("/course/") && !isCourseDetailOnly) ||
    pathname.startsWith("/onboarding");

  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
