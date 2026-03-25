# Coming Soon Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the boilerplate Next.js web app with a polished Coming Soon landing page using the Parikshanam "Dimensional Joy" design system.

**Architecture:** Single-page Next.js App Router app. No client components, no data fetching — pure static HTML/CSS. App icon from mobile assets serves double duty as the page favicon (via Next.js metadata image route) and the visible logo in the page.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, `next/font/google` (Nunito + Roboto), no additional dependencies.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `apps/web/src/app/icon.png` | Create (copy) | Favicon — Next.js App Router metadata image route |
| `apps/web/src/app/favicon.ico` | Delete | Replaced by `icon.png` above |
| `apps/web/public/icon.png` | Create (copy) | App logo image used by `<Image>` component in the page |
| `apps/web/src/app/globals.css` | Modify | Brand CSS variables + `@theme` font registration |
| `apps/web/src/app/layout.tsx` | Modify | Metadata (title, description), load Nunito + Roboto fonts |
| `apps/web/src/app/page.tsx` | Modify (full rewrite) | Coming Soon layout — icon, wordmark, badge, tagline |

---

## Task 1: Copy App Icon Assets

**Files:**
- Create: `apps/web/src/app/icon.png`
- Create: `apps/web/public/icon.png`
- Delete: `apps/web/src/app/favicon.ico`

- [ ] **Step 1: Copy icon to App Router metadata route location**

```bash
cp apps/mobile/assets/images/icon.png apps/web/src/app/icon.png
```

Next.js App Router automatically serves any file named `icon.png` placed in the `app/` directory as the site favicon — no ICO conversion needed. This replaces the existing `favicon.ico`.

- [ ] **Step 2: Copy icon to public folder for use by the Image component**

```bash
cp apps/mobile/assets/images/icon.png apps/web/public/icon.png
```

- [ ] **Step 3: Delete the old favicon placeholder**

```bash
rm apps/web/src/app/favicon.ico
```

- [ ] **Step 4: Verify the files exist**

```bash
ls apps/web/src/app/icon.png apps/web/public/icon.png
```

Expected: both paths printed with no errors. `apps/web/src/app/favicon.ico` should no longer exist.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/icon.png apps/web/public/icon.png
git rm apps/web/src/app/favicon.ico
git commit -m "feat(web): add app icon assets for favicon and logo"
```

---

## Task 2: Set Up Fonts and Brand CSS

**Files:**
- Modify: `apps/web/src/app/globals.css`
- Modify: `apps/web/src/app/layout.tsx`

- [ ] **Step 1: Update `globals.css` with brand colors and font theme**

Replace the full contents of `apps/web/src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --background: #F9F7F5;
  --foreground: #1B3A6E;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-brand-primary: #E8720C;
  --color-brand-dark: #A04F08;
  --color-brand-navy: #1B3A6E;
  --color-brand-teal: #1B8A7A;
  --color-ui-border: #E5E0D8;
  --font-nunito: var(--font-nunito-var);
  --font-roboto: var(--font-roboto-var);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-roboto-var), Arial, sans-serif;
}
```

**Why these tokens:** Colors are taken verbatim from `apps/mobile/DESIGN.md`. The `--font-nunito-var` and `--font-roboto-var` CSS variables are injected by `next/font/google` in the next step. Declaring them in `@theme inline` makes them available as `font-nunito` and `font-roboto` Tailwind utility classes.

- [ ] **Step 2: Update `layout.tsx` to load Nunito + Roboto and set metadata**

Replace the full contents of `apps/web/src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Nunito, Roboto } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito-var",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

const roboto = Roboto({
  variable: "--font-roboto-var",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Parikshanam — Coming Soon",
  description: "Exam prep for Grades 6–10. Coming soon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

**Why these weights:** Nunito 900 is needed for the wordmark, 700 for the badge. Roboto 500 for the tagline. Loading 400 as well for any fallback body text.

- [ ] **Step 3: Verify the build still compiles**

```bash
cd apps/web && pnpm build
```

Expected: build succeeds with no TypeScript or Tailwind errors. (The page still shows the old content — that's fine, we replace it in Task 3.)

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/globals.css apps/web/src/app/layout.tsx
git commit -m "feat(web): set up Nunito+Roboto fonts and Dimensional Joy brand CSS"
```

---

## Task 3: Build the Coming Soon Page

**Files:**
- Modify: `apps/web/src/app/page.tsx` (full rewrite)

- [ ] **Step 1: Replace `page.tsx` with the Coming Soon layout**

Replace the full contents of `apps/web/src/app/page.tsx` with:

```tsx
import Image from "next/image";

export default function Home() {
  return (
    <main
      className="flex flex-1 min-h-screen flex-col items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,114,12,0.08) 0%, transparent 70%), #F9F7F5",
      }}
    >
      {/* App Icon */}
      <div className="mb-6">
        <Image
          src="/icon.png"
          alt="Parikshanam"
          width={96}
          height={96}
          priority
          className="rounded-2xl"
        />
      </div>

      {/* Wordmark */}
      <h1
        className="text-5xl sm:text-6xl text-[#1B3A6E] tracking-tight mb-4"
        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
      >
        Parikshanam
      </h1>

      {/* Coming Soon Badge */}
      <div
        className="mb-5 px-6 py-2 rounded-full bg-[#E8720C] border-b-4 border-[#A04F08] text-white uppercase tracking-widest text-sm select-none"
        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
      >
        Coming Soon
      </div>

      {/* Tagline */}
      <p
        className="text-lg text-[#6B7280] text-center max-w-xs"
        style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
      >
        Exam prep for Grades 6–10
      </p>
    </main>
  );
}
```

**Notes:**
- `src="/icon.png"` resolves from `public/icon.png` (Task 1)
- `var(--font-nunito-var)` resolves to the Nunito Google Font loaded in `layout.tsx`
- The radial gradient is applied inline because Tailwind v4 doesn't support arbitrary gradient positions in a single utility class
- `border-b-4 border-[#A04F08]` is the Dimensional Joy shadow pattern from DESIGN.md

- [ ] **Step 2: Run the dev server and visually verify**

```bash
cd apps/web && pnpm dev
```

Open `http://localhost:3000` and confirm:
- [ ] App icon renders at top center
- [ ] "Parikshanam" wordmark in dark navy, large and bold
- [ ] Orange pill badge with "COMING SOON" and a darker bottom border (dimensional shadow)
- [ ] Muted grey tagline below
- [ ] Faint warm orange glow in the upper background
- [ ] Browser tab shows the app icon as favicon and "Parikshanam — Coming Soon" as title

- [ ] **Step 3: Verify production build**

```bash
cd apps/web && pnpm build
```

Expected: build completes with no errors. All pages should be statically generated.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/page.tsx
git commit -m "feat(web): implement Coming Soon landing page with Dimensional Joy design"
```
