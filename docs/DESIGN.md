# Parikshanam — Universal design system

Cross-app visual and UX rules for Parikshanam (web, admin, teacher, mobile). **Implementation details for the Expo app** also live in [`apps/mobile/docs/DESIGN.md`](../apps/mobile/docs/DESIGN.md).

---

## Non-negotiable: no emoji in the product UI

- **Do not use emoji** in user-facing copy, buttons, labels, empty states, toasts, marketing sections, navigation, or errors.
- **Always use icons** instead: on web use **Lucide React** (`lucide-react`) with consistent stroke weight and sizing; on mobile use the same family via **Lucide-compatible** or **@expo/vector-icons** only where the set matches the intended metaphor—prefer Lucide exports when available.
- Decorative “flair” belongs in **illustrations, doodles, or SVG**—not Unicode emoji.

This keeps rendering predictable across OS fonts, improves accessibility, and matches a premium ed-tech brand.

---

## Brand north star

- **Structure & trust:** Deep navy (`#1B3A6E`) for headings and primary text on light surfaces.
- **Action & energy:** Orange (`#E8720C`) for primary CTAs, key highlights, progress; darker orange (`#A04F08`) for 3D button lips and pressed depth.
- **Accent:** Teal (`#1B8A7A`) for secondary highlights (e.g. certificates, “learn anywhere”).
- **Warmth:** Page background warm off-white (`#F9F7F5`); borders warm gray-beige (`#E5E0D8`).
- **Surfaces:** White / `#FFFBF7` cream panels on marketing; elevated cards with subtle inset highlight + soft outer shadow (no harsh flat gray slabs).

Typography on **web**: **Nunito** (headings, heavy marketing type), **Roboto** (body). Load via `next/font` and CSS variables `--font-nunito-var`, `--font-roboto-var`.

---

## Web tokens (source of truth)

Authoritative values for the Next.js app live in **`apps/web/src/app/globals.css`** (`:root` and `@theme inline`).

Use **semantic CSS variables** for radius so surfaces stay aligned:

| Variable | Role |
|----------|------|
| `--radius-card` | Large panels, section cards, course tiles |
| `--radius-button` | Primary / outline / secondary buttons (match card family) |
| `--radius-nested` | Icon wells inside cards, medium logos |
| `--radius-control-sm` | Inputs, compact chips, small controls |
| `--radius-icon-tile` | App mark in nav, footer, download CTA |

In JSX/Tailwind prefer `rounded-[var(--radius-card)]` (etc.) over mixing arbitrary `rounded-[2rem]` / `rounded-2xl` values.

**Color tokens** in theme include `--color-brand-primary`, `--color-brand-navy`, `--color-brand-teal`, `--color-ui-border`, plus surface/text vars in `:root`.

---

## Components & motion (web)

- **Primary buttons:** Orange fill + **extruded bottom lip** (darker shadow block) + slight `translateY` on press; motion lives in `.btn-press-motion` in `globals.css`—avoid layout-shifting hover (no jumping borders).
- **Outline / secondary:** White (or near-white) fill, `#E5E0D8` border, matching **lip** shadow language so pairs read as one system (e.g. hero + download CTAs).
- **Focus:** Visible focus ring (orange); do not override `border-radius` on `:focus-visible` in a way that fights Tailwind `rounded-*` on inputs.
- **Background doodles:** A **single** full-page doodle layer (root layout); section washes only—**no second doodle stack** inside sections (avoids double moiré).
- **Marketing sections:** Eyebrow label (small caps, tracked, orange), then Nunito headline, then Roboto body; generous spacing; grid breakpoints consistent (`sm` / `md` / `lg`).

---

## Icons (concrete rules)

1. Import named icons from `lucide-react` on web.
2. Default to **stroke-based** icons; align `strokeWidth` (~2–2.5) with neighboring UI.
3. Pair icon + label with `gap-2` / `gap-2.5`; use `shrink-0` on the icon.
4. Set `aria-hidden` on decorative icons; if the icon **is** the control, give the control an `aria-label`.
5. **Never** substitute emoji for an icon to “save time.”

---

## Content & tone

- Clear, encouraging, age-appropriate (grades 6–10); avoid jargon in marketing.
- **No emoji** (see above). Use short labels + icons + color for emphasis.

---

## When you change the system

1. Update **`apps/web/src/app/globals.css`** (and mobile theme if needed).
2. Prefer **tokens** over new one-off radii/colors in components.
3. Keep **admin / teacher** visually aligned where shared packages exist; document intentional divergence here if required.

---

## Quick reference — hex

| Role | Hex |
|------|-----|
| Navy (headings) | `#1B3A6E` |
| Orange (primary) | `#E8720C` |
| Orange dark (depth) | `#A04F08` |
| Teal (accent) | `#1B8A7A` |
| Page background | `#F9F7F5` |
| Border / divider | `#E5E0D8` |
| Body text | `#4B5563` / `#6B7280` muted |

---

*Last aligned with repo patterns: March 2026.*
