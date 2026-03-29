/**
 * Distinct Supabase auth storage key so the student web app does not share session
 * cookies with the admin app on the same machine. Cookies are scoped to the host only
 * (no port), so http://localhost:3000 and http://localhost:3002 overwrite each other
 * unless storage keys differ.
 */
export const SUPABASE_AUTH_STORAGE_KEY = "sb-parikshanam-web-auth";

export const supabaseSsrCookieOptions = {
  cookieOptions: {
    name: SUPABASE_AUTH_STORAGE_KEY,
  },
} as const;
