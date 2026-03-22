# Quick Start Guide - Dimensional Joy Design System

Get up and running with the design system in 5 minutes.

## 1. Import Components

```tsx
// UI Components
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';

// Theme
import { useTheme } from '@/components/providers/ThemeProvider';
```

## 2. Basic Screen Template

```tsx
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';

export default function MyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900" edges={['bottom']}>
      <ScrollView 
        className="flex-1 px-4 pt-2" 
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <Text className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
          Screen Title
        </Text>
        <Text className="mt-1 text-base font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Screen description
        </Text>

        {/* Content */}
        <View className="mt-8">
          {/* Your content here */}
        </View>

        {/* Action */}
        <Button 
          title="Continue" 
          variant="primary" 
          onPress={() => console.log('pressed')} 
        />
      </ScrollView>
    </SafeAreaView>
  );
}
```

## 3. Common Components

### Button
```tsx
// Primary action
<Button title="Continue" variant="primary" onPress={handlePress} />

// Secondary action
<Button title="Cancel" variant="outline" onPress={handlePress} />

// Tertiary action
<Button title="Skip" variant="ghost" onPress={handlePress} />
```

### Card
```tsx
// Display card
<Card>
  <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
    Title
  </Text>
</Card>

// Interactive card (quiz, selections)
<Card variant="interactive">
  <Text>Option A</Text>
</Card>
```

### Status Badge
```tsx
<StatusBadge label="Completed" variant="success" />
<StatusBadge label="In Progress" variant="warning" />
<StatusBadge label="Failed" variant="error" />
```

### Progress Bar
```tsx
<ProgressBar progress={0.75} label="Progress" variant="success" />
```

## 4. Dark Mode Support

### Always include dark variants:
```tsx
// Background
className="bg-white dark:bg-neutral-800"

// Text
className="text-neutral-900 dark:text-neutral-100"

// Border
className="border-ui-border dark:border-neutral-700"
```

### Use theme hook:
```tsx
const { isDark, setThemePreference } = useTheme();

// Check if dark mode
if (isDark) {
  // Dark mode specific logic
}

// Change theme
setThemePreference('dark');   // Force dark
setThemePreference('light');  // Force light
setThemePreference('system'); // Follow device
```

## 5. Typography Classes

```tsx
// Headers
className="text-2xl font-black tracking-tight leading-tight"  // Page header
className="text-lg font-bold"                                  // Section header

// Body
className="text-base font-medium leading-relaxed"              // Body text
className="text-sm font-medium"                                // Small text

// Labels
className="text-xs font-bold uppercase tracking-wider"         // Labels/captions
```

## 6. Color Classes

```tsx
// Brand colors
className="bg-brand-primary"    // #58CC02 - Green
className="text-brand-primary"  // Green text
className="border-brand-dark"   // Dark green border

// Status colors
className="text-status-success" // Green
className="text-status-warning" // Yellow
className="text-status-error"   // Red
className="text-status-locked"  // Gray

// Neutral colors (light mode)
className="bg-white"            // White background
className="text-neutral-900"    // Dark text
className="text-neutral-600"    // Medium text
className="border-ui-border"    // Light border

// Neutral colors (dark mode)
className="dark:bg-neutral-800"   // Dark background
className="dark:text-neutral-100" // Light text
className="dark:text-neutral-400" // Medium text
className="dark:border-neutral-700" // Dark border
```

## 7. Spacing

Use base-4 grid (multiples of 4px):

```tsx
// Padding
className="p-4"   // 16px
className="p-6"   // 24px
className="p-8"   // 32px

// Margin
className="mb-4"  // 16px
className="mb-6"  // 24px
className="mb-8"  // 32px

// Gap
className="gap-4" // 16px between items
```

## 8. Border Radius

```tsx
className="rounded-2xl"      // 16px - Buttons, inputs
className="rounded-3xl"      // 24px - Cards
className="rounded-[2rem]"   // 32px - Hero cards
className="rounded-full"     // 9999px - Badges, avatars
```

## 9. Common Patterns

### List Item
```tsx
<Pressable className="card-interactive mb-4">
  <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
    Item Title
  </Text>
  <Text className="text-base font-medium text-neutral-600 dark:text-neutral-400">
    Description
  </Text>
</Pressable>
```

### Form Input
```tsx
<TextInput
  className="input-default"
  placeholder="Enter text"
  placeholderTextColor="#afafaf"
/>
```

### Section Header
```tsx
<View className="flex-row items-center justify-between mb-4">
  <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
    Section Title
  </Text>
  <StatusBadge label="New" variant="info" />
</View>
```

## 10. Testing Checklist

Before committing:

- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] All text is readable (4.5:1 contrast)
- [ ] All interactive elements are 44×44px minimum
- [ ] Buttons use dimensional style
- [ ] Border radius is rounded-2xl or larger
- [ ] Spacing follows base-4 grid
- [ ] No hardcoded colors (use design tokens)

## Resources

- **Full Spec:** [DESIGN.md](./DESIGN.md)
- **Implementation Guide:** [DESIGN_IMPLEMENTATION.md](./DESIGN_IMPLEMENTATION.md)
- **Component Examples:** [COMPONENT_EXAMPLES.md](./COMPONENT_EXAMPLES.md)
- **Upgrade Summary:** [UPGRADE_SUMMARY.md](./UPGRADE_SUMMARY.md)

## Need Help?

1. Check component examples in `components/ui/`
2. Review existing screens in `app/`
3. Test in both light and dark modes
4. Ensure accessibility requirements are met

---

**Happy coding! 🚀**
