# Design System

## Flat & Vibrant - Parikshanam Edition

> A high-energy, high-performance design language for Grades 6–10. Focuses on premium flat aesthetics, vivid brand colors, and cinematic interface overlays.

---

## 1. Creative North Star

The visual identity is rooted in three principles:

**Icon-Native Identity** - The palette is pulled directly from the Parikshanam icon: Vivid Orange for action, Deep Navy for structure, and Teal/Gold for accents.

**Premium Flat Interactivity** - Interface elements use flat surfaces with high-contrast borders and subtle interaction feedback (`active:opacity-80`) instead of complex 3D layers. This ensures maximum stability and performance on all mobile devices.

**Visual Reward** - Success states use a clean green (#22C55E) and vibrant highlights that stand out against the clean, warm background.

---

## 2. Color System

### Brand Palette (Icon Derived)

| Token | Value | Usage |
|---|---|---|
| `brand.primary` | `#E8720C` | Hero buttons, progress fills, primary actions |
| `brand.secondary`| `#F5A623` | Warm amber - active text in dark mode, hover glows |
| `brand.dark` | `#A04F08` | Burnt Orange - emphasis borders |
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
- **Never mix** a Nunito class with a `font-{weight}` utility - the weight is embedded in the font name and combining them causes rendering issues on Android.

---

## 4. Component Architecture

### The Flat Button

Every primary / outline tappable button MUST use `<Button>` from `@/components/ui/Button`.

**Usage**

```tsx
import { Button } from '@/components/ui/Button';

// Primary Button
<Button title="Continue" variant="primary" loading={isPending} onPress={submit} />

// Outline Button
<Button title="Cancel" variant="outline" onPress={cancel} />
```

### Cards

**Standard Card**

```tsx
className="bg-white rounded-[2rem] p-6 border border-ui-border"
```

---

## 5. Centralized Styling Usage

Always import colors, fonts, and shadows from the centralized theme:

```tsx
import { colors, fonts, iconColors } from '@/constants/theme';

// Semantic icon colors
<BookOpen size={16} color={iconColors.structural} strokeWidth={2.5} />

// Font families (Tailwind className - preferred)
<Text className="font-display-black">Heading</Text>
<Text className="font-sans-medium">Body text</Text>

// Soft elevation (where needed)
<View className="shadow-sm">
```

---
*Parikshanam Design System · v3.0 · Pure Flat & Vibrant*
