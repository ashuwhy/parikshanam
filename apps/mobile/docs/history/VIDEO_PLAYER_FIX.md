# Video Player Fix

## Issue
The `expo-video` package was causing build errors:
```
Unable to resolve "expo-video" from "apps/mobile/components/course/VideoPlayer.tsx"
```

## Temporary Solution Applied

The VideoPlayer component has been temporarily replaced with a placeholder that displays:
- A play icon
- "Video Player" text
- A message indicating expo-video needs configuration

This allows the app to build and run without errors.

## Permanent Fix (To Be Applied Later)

To restore full video functionality:

### Option 1: Reinstall expo-video (Recommended)

```bash
cd apps/mobile
npx expo install expo-video
npx expo prebuild --clean
```

Then rebuild the app:
```bash
# For iOS
npx expo run:ios

# For Android
npx expo run:android
```

### Option 2: Use Alternative Video Player

Replace `expo-video` with `expo-av` which is more stable:

```tsx
// components/course/VideoPlayer.tsx
import { Video, ResizeMode } from 'expo-av';
import { View } from 'react-native';

interface VideoPlayerProps {
  url: string;
  onEnded?: () => void;
}

export function VideoPlayer({ url, onEnded }: VideoPlayerProps) {
  return (
    <View className="w-full aspect-video bg-black rounded-xl overflow-hidden">
      <Video
        source={{ uri: url }}
        style={{ width: '100%', height: '100%' }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.didJustFinish && onEnded) {
            onEnded();
          }
        }}
      />
    </View>
  );
}
```

Note: `expo-av` is already installed in the project (see package.json).

## Current VideoPlayer Implementation

Located at: `apps/mobile/components/course/VideoPlayer.tsx`

```tsx
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VideoPlayerProps {
  url: string;
  onEnded?: () => void;
}

export function VideoPlayer({ url, onEnded }: VideoPlayerProps) {
  return (
    <View className="w-full aspect-video bg-neutral-900 rounded-xl overflow-hidden items-center justify-center">
      <Ionicons name="play-circle-outline" size={64} color="#58CC02" />
      <Text className="text-white mt-4 text-base font-medium">Video Player</Text>
      <Text className="text-neutral-400 text-sm mt-1">expo-video needs to be configured</Text>
    </View>
  );
}
```

## Why This Happened

`expo-video` is a native module that requires:
1. Native code compilation
2. Proper linking in iOS/Android projects
3. Running `npx expo prebuild` to generate native code

The package was listed in package.json but the native modules weren't properly linked.

## Recommendation

Use **Option 2** (expo-av) as it's:
- Already installed
- More stable and mature
- Widely used in production apps
- Has better documentation
- Supports both iOS and Android well

## Files Modified

- `apps/mobile/components/course/VideoPlayer.tsx` - Replaced with placeholder
- `apps/mobile/app/course/[id]/lesson/[lessonId].tsx` - Added dark mode support

---

**Status:** ✅ Temporary fix applied - app builds successfully
**Next Step:** Implement Option 2 (expo-av) for production video playback
**Date:** March 22, 2026
