# Design System Implementation Guide

This guide explains how the Dimensional Joy design system has been implemented in the Parikshanam mobile app with full dark/light mode support.

## Overview

The design system is built on:

- **NativeWind 5** (Tailwind CSS for React Native)
- **Expo Router** for navigation
- **Custom ThemeProvider** for theme management
- **Dimensional buttons** with 3D shadow effects
- **Full dark mode support** with automatic device detection

## File Structure

```
apps/mobile/
├── DESIGN.md                          # Design system specification
├── DESIGN_IMPLEMENTATION.md           # This file
├── tailwind.config.js                 # Tailwind configuration
├── global.css                         # Global styles & utilities
├── constants/
│   ├── Colors.ts                      # Color exports
│   └── theme.ts                       # Theme tokens & utilities
├── components/
│   ├── providers/
│   │   ├── ThemeProvider.tsx          # Theme management
│   │   └── QueryProvider.tsx          # React Query provider
│   └── ui/
│       ├── Button.tsx                 # Dimensional button component
│       ├── Card.tsx                   # Card component with variants
│       ├── StatusBadge.tsx            # Status badge component
│       └── ProgressBar.tsx            # Progress bar with variants
└── app/
    └── _layout.tsx                    # Root layout with providers

```

## Theme Configuration

### 1. Tailwind Config (`tailwind.config.js`)

```js
export default {
  darkMode: 'class',  // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        brand: { primary: '#58CC02', secondary: '#84fb42', dark: '#2a6900' },
        ui: { bg: '#f8f6f6', card: '#FFFFFF', border: '#dddddc', accent: '#a3d8ff' },
        status: { success: '#58CC02', warning: '#FFC800', error: '#FF4B4B', locked: '#afafaf' }
      },
      boxShadow: {
        'dimensional': '0 4px 0 0 #dddddc',
        'active': '0 2px 0 0 #dddddc',
      }
    }
  }
}
```

### 2. Theme Provider (`components/providers/ThemeProvider.tsx`)

Manages theme state and persistence:

```tsx
import { ThemeProvider, useTheme } from '@/components/providers/ThemeProvider';

// In your component
const { colorScheme, isDark, themePreference, setThemePreference } = useTheme();
```

**Features:**

- Persists theme preference using `expo-secure-store`
- Supports 'light', 'dark', and 'system' modes
- Automatically detects device theme
- Provides `isDark` boolean for conditional logic

### 3. Global Styles (`global.css`)

Includes utility classes for common patterns:

```css
.btn-primary      /* Primary dimensional button */
.btn-outline      /* Outline dimensional button */
.btn-ghost        /* Ghost button */
.card-default     /* Standard card */
.card-interactive /* Interactive option card */
.input-default    /* Standard input field */
```

## Component Usage

### Button Component

```tsx
import { Button } from '@/components/ui/Button';

// Primary button (green with 3D effect)
<Button title="Start Learning" variant="primary" onPress={handlePress} />

// Outline button (white/dark with border)
<Button title="Cancel" variant="outline" onPress={handlePress} />

// Ghost button (transparent)
<Button title="Skip" variant="ghost" onPress={handlePress} />

// Disabled state
<Button title="Locked" disabled />

// Loading state
<Button title="Loading..." loading />
```

### Card Component

```tsx
import { Card } from '@/components/ui/Card';

// Standard card
<Card>
  <Text>Content</Text>
</Card>

// Interactive card (for quiz options)
<Card variant="interactive">
  <Text>Option A</Text>
</Card>

// Selected/correct state
<Card variant="selected">
  <Text>Correct Answer</Text>
</Card>

// Error/incorrect state
<Card variant="error">
  <Text>Wrong Answer</Text>
</Card>
```

### Status Badge

```tsx
import { StatusBadge } from '@/components/ui/StatusBadge';

<StatusBadge label="Completed" variant="success" />
<StatusBadge label="In Progress" variant="warning" />
<StatusBadge label="Failed" variant="error" />
<StatusBadge label="Locked" variant="locked" />
<StatusBadge label="New" variant="info" />
```

### Progress Bar

```tsx
import { ProgressBar } from '@/components/ui/ProgressBar';

<ProgressBar progress={0.75} label="Course Progress" variant="success" />
<ProgressBar progress={0.5} label="Streak" variant="warning" />
<ProgressBar progress={0.3} label="Loading" variant="accent" />
```

## Dark Mode Implementation

### Using Tailwind Classes

Always include both light and dark variants:

```tsx
// Background colors
className="bg-white dark:bg-neutral-800"

// Text colors
className="text-neutral-900 dark:text-neutral-100"

// Borders
className="border-ui-border dark:border-neutral-700"

// Complex example
className="bg-white dark:bg-neutral-800 border border-ui-border dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
```

### Screen Backgrounds

```tsx
<SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900">
  {/* Content */}
</SafeAreaView>
```

### Conditional Rendering

```tsx
import { useTheme } from '@/components/providers/ThemeProvider';

function MyComponent() {
  const { isDark } = useTheme();
  
  return (
    <View>
      {isDark ? <MoonIcon /> : <SunIcon />}
    </View>
  );
}
```

## Design Tokens

### Colors

**Brand Colors:**

- `brand-primary`: #58CC02 (Duolingo Green)
- `brand-secondary`: #84fb42 (Light Green)
- `brand-dark`: #2a6900 (Dark Green)

**UI Colors (Light):**

- `ui-bg`: #f8f6f6 (Off-white background)
- `ui-card`: #FFFFFF (White cards)
- `ui-border`: #dddddc (Light gray borders)
- `ui-accent`: #a3d8ff (Soft blue)

**UI Colors (Dark):**

- Background: #111827
- Cards: #1F2937
- Borders: #374151

**Status Colors:**

- `status-success`: #58CC02
- `status-warning`: #FFC800
- `status-error`: #FF4B4B
- `status-locked`: #afafaf

### Typography

```tsx
// Page header
className="text-2xl font-black tracking-tight leading-tight"

// Card title
className="text-lg font-bold"

// Body text
className="text-base font-medium leading-relaxed"

// Caption/label
className="text-xs font-bold uppercase tracking-wider"
```

### Spacing

Use base-4 grid (multiples of 4px):

- `p-2` = 8px
- `p-4` = 16px
- `p-6` = 24px
- `p-8` = 32px

### Border Radius

- `rounded-2xl` = 16px (buttons, inputs)
- `rounded-3xl` = 24px (standard cards)
- `rounded-[2rem]` = 32px (hero cards)
- `rounded-full` = 9999px (badges, avatars)

## Best Practices

### 1. Always Support Dark Mode

```tsx
// ✅ Good
<View className="bg-white dark:bg-neutral-800">

// ❌ Bad
<View className="bg-white">
```

### 2. Use Dimensional Buttons

```tsx
// ✅ Good - Uses 3D shadow effect
<Button title="Continue" variant="primary" />

// ❌ Bad - Flat button breaks design language
<Pressable className="bg-brand-primary px-4 py-2">
```

### 3. Maintain Minimum Tap Targets

All interactive elements should be at least 44×44px:

```tsx
// ✅ Good
<Button title="Tap Me" className="min-h-11" />

// ❌ Bad - Too small
<Pressable className="p-1">
```

### 4. Use Semantic Color Names

```tsx
// ✅ Good
className="text-status-error"

// ❌ Bad
className="text-red-500"
```

### 5. Respect Safe Areas

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView className="flex-1" edges={['bottom']}>
  {/* Content */}
</SafeAreaView>
```

## Testing Dark Mode

1. **Device Settings:**
   - iOS: Settings → Display & Brightness → Dark
   - Android: Settings → Display → Dark theme

2. **Expo Dev Tools:**
   - Press `Shift + D` in terminal to toggle dark mode

3. **Programmatically:**

   ```tsx
   const { setThemePreference } = useTheme();
   setThemePreference('dark');
   ```

## Migration Checklist

When updating existing components:

- [ ] Add `dark:` variants to all background colors
- [ ] Add `dark:` variants to all text colors
- [ ] Add `dark:` variants to all border colors
- [ ] Update buttons to use dimensional style
- [ ] Use rounded-2xl or larger for interactive elements
- [ ] Ensure minimum 44×44px tap targets
- [ ] Test in both light and dark modes
- [ ] Verify color contrast ratios (4.5:1 minimum)

## Common Patterns

### Screen Layout

```tsx
<SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900" edges={['bottom']}>
  <ScrollView 
    className="flex-1 px-4 pt-2" 
    contentContainerStyle={{ paddingBottom: 32 }}
  >
    <Text className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
      Title
    </Text>
    {/* Content */}
  </ScrollView>
</SafeAreaView>
```

### Form Input

```tsx
<TextInput
  className="input-default"
  placeholder="Enter text"
  placeholderTextColor="#afafaf"
/>
```

### List Item

```tsx
<Pressable className="card-interactive mb-4">
  <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
    Item Title
  </Text>
  <Text className="text-base font-medium text-neutral-600 dark:text-neutral-400">
    Item Description
  </Text>
</Pressable>
```

## Resources

- [DESIGN.md](./DESIGN.md) - Full design system specification
- [NativeWind Docs](https://www.nativewind.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)

## Support

For questions or issues with the design system:

1. Check [DESIGN.md](./DESIGN.md) for specifications
2. Review component examples in `components/ui/`
3. Test in both light and dark modes
4. Ensure accessibility requirements are met

---

*Last updated: March 2026*
