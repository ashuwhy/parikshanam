import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { brand, dimensionalShadows } from '@/constants/Colors';

/**
 * Full-screen branded loading screen with pulsing animation.
 * Uses StyleSheet.absoluteFill so it always covers the entire screen
 * regardless of parent flex context.
 */
export function LoadingScreen() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <View style={StyleSheet.absoluteFill} className="items-center justify-center bg-ui-bg dark:bg-neutral-900">
      <Animated.View
        style={{ opacity }}
        className="items-center"
      >
        <View
          className="h-16 w-16 items-center justify-center rounded-[1.25rem] bg-brand-primary"
          style={dimensionalShadows.brand.md}
        >
          <Text className="text-2xl font-black text-white">P</Text>
        </View>
      </Animated.View>

      <Animated.Text
        style={{ opacity }}
        className="mt-4 text-sm font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
      >
        Loading…
      </Animated.Text>
    </View>
  );
}

/**
 * Skeleton placeholder card — use for screen-level skeleton layouts.
 * Matches the shape of a CourseCard for visual consistency.
 */
export function SkeletonCard() {
  const shimmer = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 0.7,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0.3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmer]);

  return (
    <View className="mb-4 overflow-hidden rounded-[2rem] border border-ui-border dark:border-neutral-700 bg-white dark:bg-neutral-800">
      {/* Thumbnail skeleton */}
      <Animated.View
        style={{ opacity: shimmer }}
        className="h-40 w-full bg-neutral-200 dark:bg-neutral-700"
      />
      {/* Content skeleton */}
      <View className="p-5 gap-3">
        <Animated.View
          style={{ opacity: shimmer }}
          className="h-4 w-3/4 rounded-full bg-neutral-200 dark:bg-neutral-700"
        />
        <Animated.View
          style={{ opacity: shimmer }}
          className="h-3 w-1/2 rounded-full bg-neutral-200 dark:bg-neutral-700"
        />
        <View className="flex-row gap-3 mt-1">
          <Animated.View
            style={{ opacity: shimmer }}
            className="h-5 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700"
          />
          <Animated.View
            style={{ opacity: shimmer }}
            className="h-5 w-12 rounded-full bg-neutral-200 dark:bg-neutral-700"
          />
        </View>
      </View>
    </View>
  );
}
