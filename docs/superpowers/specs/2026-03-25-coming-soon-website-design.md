# Coming Soon Website — Design Spec

**Date:** 2026-03-25
**Status:** Approved

---

## Overview

Replace the boilerplate Next.js web app (`apps/web`) with a polished Coming Soon landing page for Parikshanam, using the mobile app's "Dimensional Joy" design system as the visual reference.

The page is **purely informational** — no email capture, no CTAs, no links. Just a strong brand impression.

---

## Design

### Layout

Single full-viewport centered layout (Option A — Centered Minimal):

```
[App Icon — 96×96px]
Parikshanam           ← Nunito 900 Black, #1B3A6E
● Coming Soon ●       ← Orange pill badge, dimensional shadow
Exam prep for Grades 6–10  ← Roboto Medium, muted #6B7280
```

Subtle dot-grid or radial gradient background decoration in brand colors for depth.

### Colors (from DESIGN.md)

| Token | Value | Usage |
|---|---|---|
| Background | `#F9F7F5` | Page background |
| Wordmark | `#1B3A6E` | Brand navy — "Parikshanam" text |
| Badge BG | `#E8720C` | "Coming Soon" pill |
| Badge Shadow | `#A04F08` | Dimensional border-bottom |
| Badge Text | `#FFFFFF` | Text on badge |
| Tagline | `#6B7280` | Muted body text |

### Typography

| Element | Font | Weight | Size |
|---|---|---|---|
| Wordmark | Nunito | 900 Black | `text-5xl` / `text-6xl` |
| Badge | Nunito | 700 Bold | `text-sm` uppercase tracking |
| Tagline | Roboto | 500 Medium | `text-lg` |

### Component: Coming Soon Badge

```
bg-[#E8720C] text-white rounded-full px-6 py-2
border-b-4 border-[#A04F08]
font-nunito font-bold uppercase tracking-widest text-sm
```

---

## Files to Change

| File | Action |
|---|---|
| `apps/web/src/app/page.tsx` | Full replacement — Coming Soon layout |
| `apps/web/src/app/layout.tsx` | Update metadata, swap fonts to Nunito + Roboto |
| `apps/web/src/app/globals.css` | Add brand CSS variables and `@theme` font utilities |
| `apps/web/src/app/icon.png` | Copy from `apps/mobile/assets/images/icon.png` — Next.js App Router serves this automatically as the favicon (no ICO conversion needed) |
| `apps/web/src/app/favicon.ico` | Delete — replaced by `icon.png` metadata route above |
| `apps/web/public/icon.png` | Copy from `apps/mobile/assets/images/icon.png` — used by `<Image>` in the page |

---

## Favicon

Next.js App Router natively handles `icon.png` placed in `src/app/` as a metadata image route — it generates `<link rel="icon">` automatically and serves it at `/favicon.ico`. No ICO conversion required. Delete the existing placeholder `src/app/favicon.ico` to avoid conflicts.

---

## Tailwind v4 Font Setup

The web app uses Tailwind v4 (config via `globals.css` `@theme`). The mobile app's font utility classes (`font-nunito`, `font-display-black`, etc.) are NativeWind-specific and do NOT exist here. Register fonts using Next.js `next/font/google` in `layout.tsx` and expose as CSS variables, then declare them in `globals.css`:

```css
@theme inline {
  --font-nunito: var(--font-nunito-var);
  --font-roboto: var(--font-roboto-var);
}
```

In components, use Tailwind's arbitrary font syntax or the theme variable:
- `font-[family-name:var(--font-nunito)]` or `font-nunito` once declared in `@theme`
- Inline `style={{ fontFamily: 'var(--font-nunito)' }}` for precise control

---

## Background Decoration

Use a CSS radial gradient centered at the top of the page for a subtle warm glow:

```css
background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,114,12,0.08) 0%, transparent 70%), #F9F7F5;
```

This gives a faint orange halo above the content without requiring any extra DOM elements or JS.

---

## Out of Scope

- Email capture / waitlist
- App Store / Play Store links
- Social media links
- Dark mode
- Animations (keep it static and fast)
