/**
 * Supabase public config (NEXT_PUBLIC_*). Inlined at build time for the browser bundle;
 * must be set in the host (e.g. Vercel → Environment Variables) for Production and Preview.
 */
export function getSupabasePublicConfig(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add both in your host (Vercel: Project → Settings → Environment Variables) for Production and Preview, then redeploy.",
    )
  }
  return { url, anonKey }
}

export function getSupabaseServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add it as a server-only secret in your host (never NEXT_PUBLIC_*).",
    )
  }
  return key
}
