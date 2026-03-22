# Design System

## Dimensional Joy — Expo + NativeWind Edition

> A high-energy, tactile design language for Grades 6–10. Inspired by gamified learning platforms, built for a slightly older, tech-savvy student audience.

---

## 1. Creative North Star

The visual identity is rooted in three non-negotiable principles. Every component, spacing decision, and color choice should map back to one of these.

**Friendly & Tactile** — Heavy bottom-border shadows and large rounded corners make every element feel like a physical object. If it's interactive, it should *look* interactive before the user touches it.

**Vibrant Hierarchy** — A single dominant brand color (`#58CC02`) does all the heavy lifting. The background stays intentionally quiet so the green always wins. Never compete with your own brand color.

**Engagement Through Feedback** — Every completed action deserves a visual reward. Progress bars fill up, badges unlock, colors shift. The UI should feel like it's cheering for the student.

---

## 2. Color System

### Brand Palette

| Token | Value | Usage |
|---|---|---|
| `brand.primary` | `#58CC02` | Primary buttons, active states, progress fills, success |
| `brand.secondary` | `#84fb42` | Hover glows, light accents, active indicator fills |
| `brand.dark` | `#2a6900` | Button bottom-border (3D shadow), dark text on green |

### UI Neutrals

| Token | Value | Usage |
|---|---|---|
| `ui.bg` | `#f8f6f6` | Page/screen background |
| `ui.card` | `#FFFFFF` | Card surfaces, modals, bottom sheets |
| `ui.border` | `#dddddc` | Card borders, dividers, shadow base |
| `ui.accent` | `#a3d8ff` | Secondary highlights, info states, focus rings |

### Status Colors

| Token | Value | Usage |
|---|---|---|
| `status.success` | `#58CC02` | Correct answers, completed lessons |
| `status.warning` | `#FFC800` | Streak at risk, partial progress |
| `status.error` | `#FF4B4B` | Wrong answers, missed days |
| `status.locked` | `#afafaf` | Locked content, disabled states |

### `tailwind.config.js`

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   '#58CC02',   // Duolingo Green
          secondary: '#84fb42',   // Light/Active Green
          dark:      '#2a6900',   // Dark Green for borders/shadows
        },
        ui: {
          bg:     '#f8f6f6',      // Off-white background
          card:   '#FFFFFF',
          border: '#dddddc',
          accent: '#a3d8ff',      // Soft blue for secondary highlights
        },
        status: {
          success: '#58CC02',
          warning: '#FFC800',
          error:   '#FF4B4B',
          locked:  '#afafaf',
        },
      },
      borderRadius: {
        '3xl':  '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'dimensional': '0 4px 0 0 #dddddc',
        'active':      '0 2px 0 0 #dddddc',
      },
    },
  },
}
```

---

## 3. Typography

**Primary Font:** Plus Jakarta Sans
Load weights: `400` (Medium), `700` (Bold), `800` (ExtraBold), `900` (Black)

### Type Scale

| Role | Class | Size | Weight | Notes |
|---|---|---|---|---|
| Page Header | `text-2xl font-black` | 24px | 900 | `tracking-tight`, `leading-tight` |
| Card Title | `text-lg font-bold` | 18px | 700 | Default line height |
| Body Text | `text-base font-medium` | 16px | 500 | `leading-relaxed` |
| Nav Label | `text-xs font-bold uppercase tracking-wider` | 12px | 700 | All caps, 0.1em tracking |

### Usage Rules

- Never set body text below `text-sm` (14px) — students are reading on phones.
- Use `font-black` sparingly. Reserve it for the single most important piece of text on a screen.
- Pair `font-black` headings with `font-medium` body to create maximum contrast without relying solely on size.

---

## 4. Component Architecture

### The Dimensional Button

The signature interaction pattern of this system. A bottom border creates a physical 3D depth effect. On press, the element shifts down and the shadow shrinks — simulating a real button being pushed.

**Normal State**

```tsx
className="
  bg-brand-primary
  rounded-2xl
  border-b-4 border-brand-dark
  px-6 py-3
  shadow-dimensional
  active:translate-y-0.5
  active:border-b-2
  active:shadow-active
"
```

**Secondary Variant**

```tsx
className="
  bg-white
  rounded-2xl
  border-2 border-ui-border border-b-4
  px-6 py-3
  shadow-dimensional
  active:translate-y-0.5
  active:border-b-2
  active:shadow-active
"
```

**Disabled / Locked Variant**

```tsx
className="
  bg-ui-border
  rounded-2xl
  border-b-4 border-status-locked
  px-6 py-3
  opacity-60
"
```

> **Rule:** Every tappable button must use the bottom-border pattern. Flat buttons break the tactile language.

---

### Cards & Containers

**Standard Card** — Used for lesson tiles, summaries, profile blocks.

```tsx
className="bg-white rounded-[2rem] p-6 shadow-sm border border-ui-border"
```

**Interactive Option Card** — Used for quiz answer choices, selection menus.

```tsx
className="
  bg-white
  rounded-2xl
  border-2 border-ui-border
  p-4
  active:border-ui-accent
"
```

**Selected Option State** (correct answer)

```tsx
className="
  bg-white
  rounded-2xl
  border-2 border-status-success
  p-4
"
```

**Incorrect Option State**

```tsx
className="
  bg-white
  rounded-2xl
  border-2 border-status-error
  p-4
"
```

---

### Progress Bar

```tsx
// Track
className="h-3.5 bg-ui-border rounded-full overflow-hidden border border-ui-border"

// Fill — swap color per context
className="h-full rounded-full bg-brand-primary transition-all duration-700"
// Warning fill: bg-status-warning
// Accent fill:  bg-ui-accent
```

---

### Status Badges

```tsx
// Success
className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-green-100 text-brand-dark"

// Warning
className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-yellow-100 text-yellow-800"

// Error
className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-red-100 text-red-800"

// Locked
className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-gray-100 text-status-locked"
```

---

## 5. Design Tokens

### Border Radius Reference

| Token | Value | Used For |
|---|---|---|
| `rounded-lg` | 8px | Small chips, tags, inner elements |
| `rounded-2xl` | 16px | Buttons, option cards, inputs |
| `rounded-3xl` | 24px | Standard cards, modals |
| `rounded-[2rem]` | 32px | Hero cards, featured tiles |
| `rounded-full` | 9999px | Badges, avatars, progress bars, pills |

> **Rule:** When in doubt, go rounder. Small radii feel clinical; large radii feel friendly.

### Elevation & Shadow

| Token | Value | Used For |
|---|---|---|
| `shadow-dimensional` | `0 4px 0 0 #dddddc` | Default button resting state |
| `shadow-active` | `0 2px 0 0 #dddddc` | Button pressed state |
| `shadow-sm` | Tailwind default | Standard cards (subtle lift) |

### Spacing

Follow a base-4 grid. Prefer multiples of 4px for all padding, margin, and gap values.

| Step | Value | Usage |
|---|---|---|
| `p-2` | 8px | Compact chips, icon buttons |
| `p-4` | 16px | Option cards, list items |
| `p-6` | 24px | Standard cards |
| `p-8` | 32px | Screen-level padding |
| `gap-3` | 12px | Tight component grids |
| `gap-4` | 16px | Standard list/grid gaps |

---

## 6. Interaction States

Every interactive element must define all four states. No exceptions.

| State | Visual Change |
|---|---|
| **Default** | Full shadow (`shadow-dimensional`), full border-bottom (`border-b-4`) |
| **Pressed / Active** | `translate-y-0.5`, reduced shadow (`shadow-active`), `border-b-2` |
| **Disabled / Locked** | `opacity-60`, `cursor-not-allowed`, neutral gray fill |
| **Selected / Correct** | `border-status-success` accent border |
| **Incorrect** | `border-status-error` accent border |

---

## 7. Screen-Level Guidelines

- **Background:** Always `bg-ui-bg` (`#f8f6f6`). Never pure white for full screens — it's too harsh.
- **Safe Area:** Respect device safe areas. No interactive elements within 16px of screen edges.
- **Scroll:** Use `ScrollView` with `contentContainerStyle={{ paddingBottom: 32 }}` to prevent content clipping.
- **Keyboard:** Wrap forms in `KeyboardAvoidingView` — students on phones will be typing.
- **Loading:** Skeleton screens over spinners. Match the skeleton shape to the real content layout.

---

## 8. Accessibility

- Minimum tap target: **44×44px** for all interactive elements.
- Color is never the *only* signal. Pair every status color with an icon or label.
- Text contrast ratio: minimum **4.5:1** for body text, **3:1** for large text (18px+ bold).
- `accessibilityLabel` is required on all icon-only buttons.
- `accessibilityRole="button"` must be set on all `Pressable` components used as buttons.

---

## 9. Anti-Patterns

Avoid these patterns — they break the design language.

| ❌ Don't | ✅ Do Instead |
|---|---|
| Flat buttons with no shadow | Always use `border-b-4` dimensional shadow |
| Sharp corners (`rounded-none`, `rounded-sm`) | Minimum `rounded-2xl` for interactive elements |
| Multiple competing brand colors on one screen | One action color per screen — always `brand.primary` |
| Text below 14px | Minimum `text-sm` (14px) for any readable text |
| Pure white (`#FFFFFF`) as a screen background | Use `ui.bg` (`#f8f6f6`) for screens |
| Status conveyed by color alone | Always pair color with an icon or text label |
| Disabled buttons that look identical to enabled | Apply `opacity-60` + neutral color for disabled states |

---

*Dimensional Joy Design System · v1.0 · Expo + NativeWind · Grades 6–10*
