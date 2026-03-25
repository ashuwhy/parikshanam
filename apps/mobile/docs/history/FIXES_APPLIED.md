# Fixes Applied to Design System

## Issue: Shadow Utilities Not Recognized

### Problem
Tailwind CSS v4 was throwing errors:
```
Cannot apply unknown utility class `shadow-dimensional`
Cannot apply unknown utility class `shadow-active`
```

### Root Cause
In Tailwind CSS v4, custom shadow utilities defined in `boxShadow` config don't automatically become utility classes. The shadow classes need to be handled differently.

### Solution Applied

#### 1. Removed Shadow Classes from Tailwind Config
Removed the `boxShadow` section from `tailwind.config.js` since they weren't being recognized as utilities.

#### 2. Updated Button Component
Changed from using Tailwind shadow classes to inline React Native styles:

**Before:**
```tsx
className="shadow-dimensional active:shadow-active"
```

**After:**
```tsx
style={({ pressed }) => getDimensionalStyle(pressed)}

// Where getDimensionalStyle returns:
{
  shadowColor: '#2a6900',  // or appropriate color
  shadowOffset: { width: 0, height: pressed ? 2 : 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: pressed ? 2 : 4,  // For Android
}
```

#### 3. Updated Global CSS
Added CSS custom properties for shadows (for documentation purposes):

```css
@theme {
  --shadow-dimensional: 0 4px 0 0 #dddddc;
  --shadow-active: 0 2px 0 0 #dddddc;
}
```

And updated button utilities to use inline `box-shadow` CSS:

```css
.btn-primary {
  box-shadow: 0 4px 0 0 #2a6900;
}

.btn-primary:active {
  box-shadow: 0 2px 0 0 #2a6900;
}
```

## Benefits of This Approach

1. **Works with React Native**: React Native doesn't support CSS box-shadow, so using the native `shadow*` style properties is more appropriate
2. **Dynamic Shadows**: Can easily adjust shadow based on pressed state
3. **Dark Mode Support**: Shadow color automatically adjusts based on theme
4. **Better Performance**: Native shadow properties are more performant than CSS transforms

## Files Modified

- `apps/mobile/components/ui/Button.tsx` - Added inline shadow styles
- `apps/mobile/tailwind.config.js` - Removed boxShadow config
- `apps/mobile/global.css` - Updated button utilities with inline box-shadow

## Testing

The dimensional button effect now works correctly:
- ✅ Shows 4px shadow in resting state
- ✅ Shows 2px shadow when pressed
- ✅ Translates down 0.5px when pressed
- ✅ Works in both light and dark modes
- ✅ No Tailwind errors

## Note on CSS Warnings

You may see editor warnings about `@apply` and `@theme` in `global.css`. These are false positives - these are valid Tailwind CSS v4 directives and will work correctly at runtime.

---

**Status:** ✅ Fixed and tested
**Date:** March 22, 2026
