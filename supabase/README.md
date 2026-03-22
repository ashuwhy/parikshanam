# Supabase (Parikshanam)

This folder matches the Expo app: tables `profiles`, `courses`, `purchases`, auth trigger, and the `create-razorpay-order` Edge Function.

### Important: run the CLI from the monorepo root

Migrations live in **`parikshanam/supabase/migrations/`** (repo root), not under `apps/mobile/`.

If you run `supabase db push` from **`apps/mobile`**, the CLI may use an empty or wrong `supabase/` folder and report **“Remote database is up to date”** while **nothing new is applied** — the DB can stay blank or missing tables.

**Do this:**

```bash
cd /path/to/parikshanam    # repo root (where this README lives)
pnpm supabase:link         # once: supabase link --project-ref <YOUR_REF>
pnpm supabase:push         # supabase db push
```

Or: `cd` to repo root, then `supabase db push` (same as above).

There is a **`supabase/migrations` symlink** under `apps/mobile/supabase/migrations` so `db push` from the mobile app folder can still see the root migrations; prefer the root anyway.

## 1. Apply database SQL

### Option A — Supabase CLI (recommended)

From the **repository root** `parikshanam/` (with [Supabase CLI](https://supabase.com/docs/guides/cli) installed and logged in):

```bash
cd /path/to/parikshanam
supabase link --project-ref fpfadcfycypxudzmguax
supabase db push
```

That runs everything under `supabase/migrations/` in order.

### Option B — Dashboard SQL Editor

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**.
2. Run each file **in order** (copy/paste contents):

   1. `migrations/20250322000000_init_parikshanam.sql`
   2. `migrations/20250322000001_seed_course.sql`
   3. `migrations/20250322000002_polish.sql`
   4. `migrations/20250322000003_class_olympiad_catalog.sql` — `class_levels`, `olympiad_types`, profile `class_level_id`, course FKs (replaces legacy `class_level` / `olympiad_type` text columns).

If you already applied older migrations, run only the **new** files you are missing (for example `20250322000002_polish.sql` and/or `20250322000003_class_olympiad_catalog.sql`). Do **not** re-run `00001` seed if you already have data, or you may duplicate the sample course.

## 2. Authentication (Dashboard)

| Setting | Where | What to do |
|--------|--------|------------|
| **Phone OTP** | Authentication → Providers → Phone | Enable; configure SMS provider (Twilio / MessageBird / etc.) per [Supabase phone docs](https://supabase.com/docs/guides/auth/phone-login). |
| **Google** (if you use Google sign-in) | Authentication → Providers → Google | Enable; add Web client ID / secret from Google Cloud Console. |
| **Redirect URLs** | Authentication → URL Configuration | Add your app scheme, e.g. `parikshanam://**` (see `app.json` → `expo.scheme`) and Expo dev URLs if needed. |
| **Email** | (optional) | Enable if you use magic links / email. |

The app reads `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from `apps/mobile/.env` (see `apps/mobile/.env.example`).

## 3. Edge Function: `create-razorpay-order`

The mobile app calls `supabase.functions.invoke('create-razorpay-order', …)` for checkout.

1. **Secrets** (Dashboard → **Edge Functions** → **Secrets**, or CLI):

   - `RAZORPAY_KEY_ID` — Razorpay key id (test or live).
   - `RAZORPAY_KEY_SECRET` — Razorpay key secret.

   `SUPABASE_URL` and `SUPABASE_ANON_KEY` are usually injected by Supabase for Edge Functions; if not, add them to match your project.

2. **Deploy** (CLI from repo root):

   ```bash
   supabase functions deploy create-razorpay-order --project-ref fpfadcfycypxudzmguax
   ```

3. **Invoke permissions**: The function uses the caller’s `Authorization` header (anon key + user JWT from the client). No extra DB policy is required beyond existing RLS on `courses`.

## 4. Row Level Security

RLS is defined in the init migration:

- **profiles**: users read/update/insert own row; new users get a row via `handle_new_user` on `auth.users`.
- **courses**: anyone can **select** rows where `is_active = true`.
- **purchases**: users can **select/insert/update** only their own rows.

## 5. Razorpay (app + server)

- **Mobile**: set `EXPO_PUBLIC_RAZORPAY_KEY_ID` in `apps/mobile/.env` (publishable key for the checkout SDK).
- **Server**: Razorpay **secret** must **only** live in Edge Function secrets, never in the Expo app.

## 6. Troubleshooting

- **`supabase db push` says “Remote database is up to date” but the DB is empty / tables missing** — You were probably in **`apps/mobile`** without migration files. Real migrations are only at **`parikshanam/supabase/migrations/`**. `cd` to the **monorepo root**, run `ls supabase/migrations` (you should see four `.sql` files), then `supabase db push` or `pnpm supabase:push`. This repo adds `apps/mobile/supabase/migrations` as a **symlink** to the root migrations so pushes from the mobile folder can work; still prefer running from the root. Compare local vs remote with `supabase migration list` (run from the repo root after `supabase link`).
- **Profile row missing after sign-up**: Check **Database → Logs** for errors from trigger `on_auth_user_created`. Ensure migration `20250322000000` ran completely.
- **“permission denied for table”**: Confirm you’re using the **anon** key in the app and RLS policies exist (re-run init migration on a fresh DB if unsure).
- **Duplicate seed course**: Re-running `20250322000001` inserts another row; delete extras in **Table Editor** or adjust seed to be idempotent for your environment.

### `supabase link` → `Forbidden resource` (even after `supabase login`)

The CLI is logged in, but the account **does not have API access** to that project ref. Common causes:

1. **Wrong Supabase account** — The browser session you used for `supabase login` must be the same identity that can open `https://supabase.com/dashboard/project/fpfadcfycypxudzmguax` (or your project). If you use multiple Google/GitHub accounts, log out in the dashboard and run `supabase login` again after signing into the correct one.
2. **Wrong project ref** — In the dashboard: **Project Settings → General → Reference ID** must match `fpfadcfycypxudzmguax` exactly. If you created a **new** project after moving orgs, the ref is different.
3. **Org / team permissions** — You need a role that can manage the project (e.g. Owner or Developer). Ask an org owner to invite this account to the org/project.
4. **Confirm what the CLI sees** — Run:

   ```bash
   supabase projects list
   ```

   If `fpfadcfycypxudzmguax` does **not** appear, the linked account cannot access it.

**Workaround without CLI link:** Use **Option B** above (SQL Editor) to apply migrations, and deploy Edge Functions from the **Dashboard** (Edge Functions → deploy) or paste the function if your plan supports it. You can still develop the app with URL + anon key from **Project Settings → API**.

**CLI update:** If problems persist, upgrade the CLI (`v2.75` → current) per [Supabase CLI docs](https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli) and retry `supabase login` + `supabase link`.
