import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { useAuth } from '@/hooks/useAuth';
import { href } from '@/lib/href';

function initials(name: string | null | undefined, phone: string | null | undefined) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? '';
    const b = parts[1]?.[0] ?? '';
    return (a + b).toUpperCase() || a.toUpperCase();
  }
  if (phone && phone.length >= 2) {
    return phone.slice(-2);
  }
  return '?';
}

/* ── Size System ───────────────────────────────────────────── */
const SIZES = {
  xs: { dim: 'h-7 w-7', text: 'text-xs', ring: 1.5, imgSize: 28 },
  sm: { dim: 'h-9 w-9', text: 'text-sm', ring: 2, imgSize: 36 },
  md: { dim: 'h-12 w-12', text: 'text-base', ring: 2, imgSize: 48 },
  lg: { dim: 'h-20 w-20', text: 'text-2xl', ring: 2.5, imgSize: 80 },
  xl: { dim: 'h-28 w-28', text: 'text-3xl', ring: 3, imgSize: 112 },
} as const;

type AvatarSize = keyof typeof SIZES;

/* ── Pressable Avatar for navigation (header / tab bar) ──── */
export function Avatar({ size = 'sm' }: { size?: AvatarSize }) {
  const router = useRouter();
  const { profile } = useAuth();
  const label = initials(profile?.full_name, profile?.phone);
  const avatarUrl = profile?.avatar_url;
  const s = SIZES[size];

  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        hitSlop={12}
        onPress={() => router.push(href('/profile'))}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        className="mr-3"
      >
        <View
          className={`${s.dim} items-center justify-center rounded-full border-2 border-brand-primary dark:border-brand-secondary overflow-hidden`}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: s.imgSize, height: s.imgSize, borderRadius: s.imgSize / 2 }}
              contentFit="cover"
            />
          ) : (
            <View className={`${s.dim} items-center justify-center rounded-full bg-brand-primary/15 dark:bg-brand-primary/20`}>
              <Text className={`font-black text-brand-dark dark:text-brand-secondary ${s.text}`}>
                {label}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

/* ── Static Avatar for profile screens ────────────────────── */
export function AvatarCircle({ size = 'lg' }: { size?: AvatarSize }) {
  const { profile } = useAuth();
  const label = initials(profile?.full_name, profile?.phone);
  const avatarUrl = profile?.avatar_url;
  const s = SIZES[size];

  return (
    <View
      className={`${s.dim} items-center justify-center rounded-full border-2 border-brand-primary dark:border-brand-secondary overflow-hidden`}
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: s.imgSize, height: s.imgSize, borderRadius: s.imgSize / 2 }}
          contentFit="cover"
        />
      ) : (
        <View className={`${s.dim} items-center justify-center rounded-full bg-brand-primary/15 dark:bg-brand-primary/20`}>
          <Text className={`font-black text-brand-dark dark:text-brand-secondary ${s.text}`}>
            {label}
          </Text>
        </View>
      )}
    </View>
  );
}
