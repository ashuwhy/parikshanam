# Google OAuth Setup (GCP + Supabase)

Parikshanam uses **Google Sign-In via Supabase OAuth**. Phone/OTP auth has been removed.

---

## 1. Google Cloud Console (GCP)

### 1a. Create or select a project

1. Open [console.cloud.google.com](https://console.cloud.google.com) → top-left project dropdown → **New Project**.
2. Name it `parikshanam` (or reuse an existing one).

### 1b. Enable the Google Identity API

1. **APIs & Services → Library** → search **"Google Identity Toolkit"** → **Enable**.

### 1c. Configure OAuth Consent Screen

1. **APIs & Services → OAuth consent screen**.
2. **User type:** External (for general public), or Internal if restricted to your org.
3. Fill in:
   - **App name:** Parikshanam
   - **User support email:** your email
   - **Developer contact email:** your email
4. **Scopes:** add `email` and `profile` (required for Supabase to receive user data).
5. **Test users:** add your own Google account while in Testing mode.
6. Save → **Publish** when ready for production.

### 1d. Create OAuth 2.0 Client IDs

You need **two** client IDs.

#### Web Client ID (used by Supabase / browser redirect)

1. **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. **Application type:** Web application.
3. **Name:** `parikshanam-web`
4. **Authorized redirect URIs** — add both:
   ```
   https://fpfadcfycypxudzmguax.supabase.co/auth/v1/callback
   ```
5. Click **Create**. Copy the **Client ID** and **Client Secret** — you need them in Supabase next.

#### iOS Client ID (native Google Sign-In, optional but needed for native `expo-auth-session`)

1. **Create Credentials → OAuth client ID**.
2. **Application type:** iOS.
3. **Bundle ID:** `com.parikshanam.app` (must match `app.json → expo.ios.bundleIdentifier`).
4. Click **Create**. Copy the **Client ID** (no secret for iOS).

---

## 2. Supabase Dashboard

1. Open [supabase.com/dashboard](https://supabase.com/dashboard) → your project `fpfadcfycypxudzmguax`.
2. Go to **Authentication → Providers → Google**.
3. Toggle **Enable Sign in with Google** to **ON**.
4. Paste values from step 1d:
   - **Client IDs (comma-separated):** paste the **Web Client ID** (and the iOS Client ID if you created one, separated by a comma)
   - **Client Secret:** paste the **Web Client Secret**
5. **Skip nonce checks:** turn this **ON** (required for iOS native flows where you don't control the nonce).
6. **Callback URL** shown is:
   ```
   https://fpfadcfycypxudzmguax.supabase.co/auth/v1/callback
   ```
   This is read-only — it's what you already added to GCP in step 1d.
7. Click **Save**.

---

## 3. Expo app `.env`

Make sure `apps/mobile/.env` has:

```env
EXPO_PUBLIC_SUPABASE_URL=https://fpfadcfycypxudzmguax.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXX
```

The app's Google sign-in (`GoogleSignInButton`) uses `supabase.auth.signInWithOAuth({ provider: 'google' })` — it reads only `SUPABASE_URL` and `SUPABASE_ANON_KEY`, so no Google Client ID is needed in `.env`.

---

## 4. Redirect URI in your app scheme

Your Expo app uses the scheme `parikshanam` (from `app.json`). The button creates a redirect like:

```
parikshanam://google-callback
```

In the Supabase dashboard under **Authentication → URL Configuration**, add this to **Redirect URLs**:

```
parikshanam://**
```

The wildcard catches all paths under the scheme.

---

## 5. Production checklist

| Item | Where |
|------|--------|
| Move consent screen from **Testing** to **Published** | GCP → OAuth consent screen |
| Add production domain to redirect URIs if you add a web app | GCP → Web Client → Authorized redirect URIs |
| Verify the bundle ID matches exactly | GCP iOS Client ↔ `app.json bundleIdentifier` |
| Add `parikshanam://**` to redirect allowlist | Supabase → Auth → URL Configuration |
| Rotate Supabase anon key before production | Supabase → Project Settings → API |

---

## Quick Test

1. Run `pnpm dev:mobile` → tap **Continue with Google** → browser sheet opens.
2. Sign in with a Google account on the **Test users** list.
3. Browser closes → app navigates to onboarding (if first time) or home.

If you see `Error 400: redirect_uri_mismatch`, the redirect URI in GCP doesn't match what Supabase sent — double-check step 1d.
