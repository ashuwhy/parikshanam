# Design System

## Dimensional Joy — Parikshanam Edition

> A high-energy, tactile design language for Grades 6–10. Inspired by the Parikshanam app icon, featuring a vibrant Orange and Navy palette.

---

## 1. Creative North Star

The visual identity is rooted in three principles:

**Icon-Native Identity** — The palette is pulled directly from the Parikshanam icon: Vivid Orange for action, Deep Navy for structure, and Teal/Gold for accents.

**Friendly & Tactile** — 3D "Dimensional" shadows (bottom borders) make every interactive element feel like a physical button.

**Visual Reward** — Success states use a clean green (#22C55E) that pop against the warm brand colors.

---

## 2. Color System

### Brand Palette (Icon Derived)

| Token | Value | Usage |
|---|---|---|
| `brand.primary` | `#E8720C` | Hero buttons, progress fills, primary actions |
| `brand.secondary`| `#F5A623` | Warm amber — active text in dark mode, hover glows |
| `brand.dark` | `#A04F08` | Burnt Orange — dimensional shadow base |
| `brand.navy` | `#1B3A6E` | Structural text, depth accents, book motifs |
| `brand.teal` | `#1B8A7A` | Secondary accents, informational highlights |

### UI Neutrals

| Token | Value | Usage |
|---|---|---|
| `ui.bg` | `#F9F7F5` | Warm off-white background (complements orange) |
| `ui.card` | `#FFFFFF` | Surface colors for cards and modals |
| `ui.border` | `#E5E0D8` | Warm beige borders and dividers |

---

## 3. Typography

### Font Pairing

| Role | Font | Weight | Tailwind Class | Usage |
|---|---|---|---|---|
| Display / Hero | **Nunito** | 900 Black | `font-display-black` | Wordmark, greeting, stat numbers, CTA buttons |
| Display / Heading | **Nunito** | 800 ExtraBold | `font-display-extra` | Card titles, screen section headings |
| Display / Label | **Nunito** | 700 Bold | `font-display` | Uppercase badges, filter chips, tab labels |
| Body / Bold | **Roboto** | 700 Bold | `font-sans-bold` | Emphasized body copy, subject labels |
| Body / Medium | **Roboto** | 500 Medium | `font-sans-medium` | Taglines, descriptions, input text |
| Body / Regular | **Roboto** | 400 Regular | `font-sans` | Default body text, fine print |

### Usage Rules

- **Headings and display text** always use Nunito (`font-display-*`)
- **Body and interface copy** always use Roboto (`font-sans-*`)
- **Never mix** a Nunito class with a `font-{weight}` utility — the weight is embedded in the font name and combining them causes rendering issues on Android
- Uppercase tracking labels (badges, stats) use `font-display` + `uppercase tracking-wider`

### Constants

```tsx
import { fonts } from '@/constants/Colors';
// fonts.displayBlack  → 'Nunito_900Black'
// fonts.displayExtra  → 'Nunito_800ExtraBold'
// fonts.display       → 'Nunito_700Bold'
// fonts.sansBold      → 'Roboto_700Bold'
// fonts.sansMedium    → 'Roboto_500Medium'
// fonts.sans          → 'Roboto_400Regular'
```

---

## 4. Icon Colors

All icon colors are centralized in `iconColors` — never hardcode hex values.

```tsx
import { iconColors } from '@/constants/Colors';
```

| Token | Value | Usage |
|---|---|---|
| `iconColors.primary` | `#E8720C` | Featured icons, active states, CTAs |
| `iconColors.secondary` | `#1B8A7A` | UI accent icons, avatars, highlights |
| `iconColors.structural` | `#1B3A6E` | Section header icons, nav icons |
| `iconColors.muted` | `#6B7280` | Placeholder, disabled icons |
| `iconColors.subtle` | `#9CA3AF` | Search, clear, decorative icons |
| `iconColors.empty` | `#D1D5DB` | Empty state illustrations |
| `iconColors.onBrand` | `#FFFFFF` | Icons placed on colored backgrounds |
| `iconColors.onWarning` | `#A04F08` | Icons on warning/gold backgrounds |

---

## 5. Component Architecture

### The Dimensional Button

Every tappable element MUST use the dimensional shadow pattern.

**Primary Variant**
```tsx
className="bg-brand-primary rounded-2xl border-b-4 border-brand-dark px-6 py-3"
style={dimensionalShadows.brand.md}
```

### Cards
**Standard Card**
```tsx
className="bg-white rounded-[2rem] p-6 border border-ui-border"
style={dimensionalShadows.md.light}
```

---

## 6. Centralized Styling Usage

Always import colors, fonts, and shadows from the centralized theme:

```tsx
import { colors, dimensionalShadows, fonts, iconColors } from '@/constants/Colors';

// Semantic icon colors
<BookOpen size={16} color={iconColors.structural} strokeWidth={2.5} />

// Font families (inline style)
<Text style={{ fontFamily: fonts.displayBlack }}>Heading</Text>

// Font families (Tailwind className — preferred)
<Text className="font-display-black">Heading</Text>
<Text className="font-sans-medium">Body text</Text>

// Shadows
<View style={dimensionalShadows.sm.light}>
```

---
*Parikshanam Design System · v2.0 · Roboto + Nunito typography · iconColors tokens*
