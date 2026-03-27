import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, useWindowDimensions, View } from 'react-native';
import { brand, colors } from '@/constants/Colors';

const LOGO_SIZE = 72;
const RING_SIZE = LOGO_SIZE + 32; // 8px gap on each side

export function LoadingScreen() {
  const { width, height } = useWindowDimensions();
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, width, height, zIndex: 9999, backgroundColor: colors.background.primary }}
      className="items-center justify-center dark:bg-neutral-900"
    >
      {/* Spinner ring + logo, stacked */}
      <View style={{ width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' }}>
        {/* Rotating arc */}
        <Animated.View
          style={{
            position: 'absolute',
            width: RING_SIZE,
            height: RING_SIZE,
            borderRadius: RING_SIZE / 2,
            borderWidth: 3,
            borderColor: 'transparent',
            borderTopColor: brand.primary,
            borderRightColor: brand.primary + '33',
            transform: [{ rotate: spin }],
          }}
        />
        {/* Logo */}
        <Image
          source={require('@/assets/images/splash-icon.png')}
          style={{ width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: LOGO_SIZE / 4 }}
          resizeMode="contain"
        />
      </View>
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
    <View className="mb-4 overflow-hidden rounded-2xl border border-ui-border dark:border-neutral-700 bg-white dark:bg-neutral-800">
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
