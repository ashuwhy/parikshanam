# Component Examples & Visual Reference

Quick reference for using the Dimensional Joy design system components.

## Buttons

### Primary Button (Green with 3D effect)
```tsx
<Button 
  title="Start Learning" 
  variant="primary" 
  onPress={() => console.log('pressed')} 
/>
```
**Visual:** Green background, white text, 4px bottom border, presses down on tap

### Outline Button (White/Dark with border)
```tsx
<Button 
  title="Cancel" 
  variant="outline" 
  onPress={() => console.log('pressed')} 
/>
```
**Visual:** White/dark background, bordered, 4px bottom border, presses down on tap

### Ghost Button (Transparent)
```tsx
<Button 
  title="Skip" 
  variant="ghost" 
  onPress={() => console.log('pressed')} 
/>
```
**Visual:** Transparent background, green text, subtle press effect

### Disabled Button
```tsx
<Button 
  title="Locked" 
  variant="primary" 
  disabled 
/>
```
**Visual:** Gray background, reduced opacity, no interaction

### Loading Button
```tsx
<Button 
  title="Loading..." 
  variant="primary" 
  loading 
/>
```
**Visual:** Shows spinner, disabled interaction

## Cards

### Default Card
```tsx
<Card>
  <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
    Card Title
  </Text>
  <Text className="text-base font-medium text-neutral-600 dark:text-neutral-400">
    Card description goes here
  </Text>
</Card>
```
**Visual:** White/dark background, rounded corners, subtle border

### Interactive Card (Quiz Options)
```tsx
<Card variant="interactive">
  <Text className="text-base font-bold text-neutral-900 dark:text-neutral-100">
    Option A: The correct answer
  </Text>
</Card>
```
**Visual:** Pressable, border changes on press, used for selections

### Selected Card (Correct Answer)
```tsx
<Card variant="selected">
  <Text className="text-base font-bold text-neutral-900 dark:text-neutral-100">
    ✓ Correct Answer
  </Text>
</Card>
```
**Visual:** Green border, indicates correct selection

### Error Card (Wrong Answer)
```tsx
<Card variant="error">
  <Text className="text-base font-bold text-neutral-900 dark:text-neutral-100">
    ✗ Wrong Answer
  </Text>
</Card>
```
**Visual:** Red border, indicates incorrect selection

## Status Badges

### Success Badge
```tsx
<StatusBadge label="Completed" variant="success" />
```
**Visual:** Green background, dark green text, pill shape

### Warning Badge
```tsx
<StatusBadge label="In Progress" variant="warning" />
```
**Visual:** Yellow background, dark yellow text, pill shape

### Error Badge
```tsx
<StatusBadge label="Failed" variant="error" />
```
**Visual:** Red background, dark red text, pill shape

### Locked Badge
```tsx
<StatusBadge label="Locked" variant="locked" />
```
**Visual:** Gray background, gray text, pill shape

### Info Badge
```tsx
<StatusBadge label="New" variant="info" />
```
**Visual:** Blue background, dark blue text, pill shape

## Progress Bars

### Success Progress (Green)
```tsx
<ProgressBar 
  progress={0.75} 
  label="Course Progress" 
  variant="success" 
/>
```
**Visual:** Green fill, shows 75%, smooth animation

### Warning Progress (Yellow)
```tsx
<ProgressBar 
  progress={0.5} 
  label="Streak at Risk" 
  variant="warning" 
/>
```
**Visual:** Yellow fill, shows 50%, smooth animation

### Accent Progress (Blue)
```tsx
<ProgressBar 
  progress={0.3} 
  label="Loading" 
  variant="accent" 
/>
```
**Visual:** Blue fill, shows 30%, smooth animation

## Typography

### Page Header
```tsx
<Text className="text-2xl font-black tracking-tight leading-tight text-neutral-900 dark:text-neutral-100">
  Welcome Back!
</Text>
```
**Visual:** 24px, extra bold, tight spacing

### Card Title
```tsx
<Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
  Section Title
</Text>
```
**Visual:** 18px, bold

### Body Text
```tsx
<Text className="text-base font-medium leading-relaxed text-neutral-600 dark:text-neutral-400">
  This is body text with comfortable line height for reading.
</Text>
```
**Visual:** 16px, medium weight, relaxed line height

### Caption/Label
```tsx
<Text className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
  Label Text
</Text>
```
**Visual:** 12px, bold, uppercase, wide tracking

## Screen Layouts

### Standard Screen
```tsx
<SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900" edges={['bottom']}>
  <ScrollView 
    className="flex-1 px-4 pt-2" 
    contentContainerStyle={{ paddingBottom: 32 }}
  >
    <Text className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
      Screen Title
    </Text>
    <Text className="mt-1 text-base font-medium text-neutral-600 dark:text-neutral-400">
      Screen subtitle or description
    </Text>
    
    {/* Content */}
  </ScrollView>
</SafeAreaView>
```

### Card Grid
```tsx
<View className="gap-4">
  <Card>
    <Text>Card 1</Text>
  </Card>
  <Card>
    <Text>Card 2</Text>
  </Card>
  <Card>
    <Text>Card 3</Text>
  </Card>
</View>
```

### Form Layout
```tsx
<View className="gap-4">
  <TextInput
    className="input-default"
    placeholder="Enter your name"
    placeholderTextColor="#afafaf"
  />
  <TextInput
    className="input-default"
    placeholder="Enter your email"
    placeholderTextColor="#afafaf"
  />
  <Button title="Submit" variant="primary" />
</View>
```

## Color Reference

### Light Mode
```tsx
// Backgrounds
bg-ui-bg          // #f8f6f6 - Screen background
bg-white          // #FFFFFF - Card background
bg-neutral-100    // Light gray

// Text
text-neutral-900  // #111827 - Primary text
text-neutral-600  // #4B5563 - Secondary text
text-neutral-500  // #6B7280 - Tertiary text

// Borders
border-ui-border  // #dddddc - Default border

// Brand
bg-brand-primary  // #58CC02 - Green
text-brand-dark   // #2a6900 - Dark green
```

### Dark Mode
```tsx
// Backgrounds
bg-neutral-900    // #111827 - Screen background
bg-neutral-800    // #1F2937 - Card background
bg-neutral-700    // #374151 - Elevated surface

// Text
text-neutral-100  // #F9FAFB - Primary text
text-neutral-400  // #9CA3AF - Secondary text
text-neutral-500  // #6B7280 - Tertiary text

// Borders
border-neutral-700 // #374151 - Default border
border-neutral-600 // #4B5563 - Strong border

// Brand (same as light)
bg-brand-primary   // #58CC02 - Green
text-brand-secondary // #84fb42 - Light green (better for dark)
```

## Common Patterns

### List Item with Action
```tsx
<Pressable className="card-interactive mb-4">
  <View className="flex-row items-center justify-between">
    <View className="flex-1">
      <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
        Item Title
      </Text>
      <Text className="text-base font-medium text-neutral-600 dark:text-neutral-400">
        Item description
      </Text>
    </View>
    <StatusBadge label="New" variant="info" />
  </View>
</Pressable>
```

### Header with Badge
```tsx
<View className="flex-row items-center gap-3">
  <Text className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
    Course Title
  </Text>
  <StatusBadge label="Premium" variant="warning" />
</View>
```

### Stats Display
```tsx
<View className="card-default">
  <Text className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
    Progress
  </Text>
  <Text className="text-3xl font-black text-brand-primary mt-2">
    75%
  </Text>
  <ProgressBar progress={0.75} variant="success" className="mt-4" />
</View>
```

### Action Sheet
```tsx
<View className="bg-white dark:bg-neutral-800 rounded-t-3xl p-6">
  <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
    Choose an option
  </Text>
  <Button title="Option 1" variant="primary" className="mb-3" />
  <Button title="Option 2" variant="outline" className="mb-3" />
  <Button title="Cancel" variant="ghost" />
</View>
```

## Spacing Scale

```tsx
gap-2   // 8px  - Tight spacing
gap-3   // 12px - Compact spacing
gap-4   // 16px - Standard spacing
gap-6   // 24px - Comfortable spacing
gap-8   // 32px - Loose spacing

p-4     // 16px - Standard padding
p-6     // 24px - Card padding
p-8     // 32px - Screen padding

mb-2    // 8px  - Tight margin
mb-4    // 16px - Standard margin
mb-6    // 24px - Section margin
mb-8    // 32px - Large margin
```

## Border Radius Scale

```tsx
rounded-2xl      // 16px - Buttons, inputs
rounded-3xl      // 24px - Standard cards
rounded-[2rem]   // 32px - Hero cards
rounded-full     // 9999px - Badges, avatars
```

## Quick Tips

1. **Always add dark mode variants:**
   ```tsx
   className="bg-white dark:bg-neutral-800"
   ```

2. **Use dimensional buttons for primary actions:**
   ```tsx
   <Button variant="primary" />
   ```

3. **Maintain 44×44px minimum tap targets:**
   ```tsx
   className="min-h-11 min-w-11"
   ```

4. **Use semantic color names:**
   ```tsx
   className="text-status-error"  // Not text-red-500
   ```

5. **Follow base-4 spacing:**
   ```tsx
   className="p-4 gap-4 mb-6"  // 16px, 16px, 24px
   ```

---

*For complete documentation, see [DESIGN.md](./DESIGN.md) and [DESIGN_IMPLEMENTATION.md](./DESIGN_IMPLEMENTATION.md)*
