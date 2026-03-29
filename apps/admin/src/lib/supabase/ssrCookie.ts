/**
 * Distinct Supabase auth storage key so the admin app does not share session cookies
 * with the student web app on the same host (localhost cookies ignore port).
 */
export const SUPABASE_AUTH_STORAGE_KEY = "sb-parikshanam-admin-auth";

export const supabaseSsrCookieOptions = {
  cookieOptions: {
    name: SUPABASE_AUTH_STORAGE_KEY,
  },
} as const;
