import { Image } from 'expo-image';
import { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { dimensionalShadows } from '@/constants/Colors';
import { olympiadLabel } from '@/types';
import type { Course } from '@/types';

function formatRupeePaise(paise: number) {
  return `₹${(paise / 100).toFixed(0)}`;
}

function discountPct(price: number, mrp: number) {
  return Math.round(((mrp - price) / mrp) * 100);
}

function classRange(course: Course): string | null {
  const min = course.min_class?.label;
  const max = course.max_class?.label;
  if (min && max && min !== max) return `${min}–${max}`;
  if (min) return min;
  if (max) return max;
  return null;
}

type Props = {
  course: Course;
  onPress?: () => void;
  purchased?: boolean;
};

export function CourseCard({ course, onPress, purchased }: Props) {
  const olympiad = olympiadLabel(course);
  const hasDiscount = course.mrp != null && course.mrp > course.price;
  const classLabel = classRange(course);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Animated press scale
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 6,
    }).start();
  };

  // Pick dimensional shadow based on color scheme
  const cardShadow = isDark ? dimensionalShadows.md.dark : dimensionalShadows.md.light;

  return (
    <Animated.View style={{ transform: [{ scale }], marginBottom: 16 }}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={({ pressed }) => ({
          ...cardShadow,
          shadowOffset: { width: 0, height: pressed ? 2 : cardShadow.shadowOffset.height },
          elevation: pressed ? 2 : cardShadow.elevation,
        })}
        className="overflow-hidden rounded-[2rem] bg-white dark:bg-neutral-800 border border-ui-border dark:border-neutral-700"
      >
        {/* Thumbnail */}
        <View className="relative">
          {course.thumbnail_url ? (
            <>
              <Image
                source={{ uri: course.thumbnail_url }}
                className="h-40 w-full"
                contentFit="cover"
              />
              {/* Bottom scrim for badge legibility */}
              <View className="absolute bottom-0 left-0 right-0 h-16 bg-black/20" />
            </>
          ) : (
            <View className="h-40 w-full items-center justify-center bg-brand-primary/10 dark:bg-brand-primary/5">
              <Text className="text-5xl">📖</Text>
              <Text className="mt-2 text-xs font-bold uppercase tracking-wider text-brand-primary/60">
                Course
              </Text>
            </View>
          )}

          {/* Overlaid badges */}
          <View className="absolute left-3 top-3 flex-row gap-2">
            {olympiad ? (
              <View
                className="rounded-full bg-status-warning px-3 py-1"
                style={dimensionalShadows.badge}
              >
                <Text className="text-xs font-black uppercase tracking-wider text-brand-dark">
                  {olympiad}
                </Text>
              </View>
            ) : null}
            {classLabel ? (
              <View className="rounded-full bg-white/90 dark:bg-neutral-800/90 px-3 py-1">
                <Text className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  {classLabel}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Purchased badge (top-right) */}
          {purchased && (
            <View
              className="absolute right-3 top-3 rounded-full bg-brand-primary px-3 py-1"
              style={dimensionalShadows.brand.sm}
            >
              <Text className="text-xs font-black uppercase tracking-wider text-white">
                ✓ Enrolled
              </Text>
            </View>
          )}

          {/* Discount badge (bottom-right, overlapping scrim) */}
          {hasDiscount && (
            <View className="absolute right-3 bottom-3 rounded-xl bg-red-500 px-2.5 py-1">
              <Text className="text-xs font-black text-white">
                -{discountPct(course.price, course.mrp!)}%
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View className="p-5">
          <Text
            className="text-base font-black leading-tight text-neutral-900 dark:text-neutral-100"
            numberOfLines={2}
          >
            {course.title}
          </Text>

          {course.subtitle ? (
            <Text
              className="mt-1 text-sm font-medium leading-relaxed text-neutral-500 dark:text-neutral-400"
              numberOfLines={2}
            >
              {course.subtitle}
            </Text>
          ) : null}

          {/* Price row */}
          <View className="mt-3 flex-row items-center gap-3">
            <Text className="text-lg font-black text-brand-primary">
              {formatRupeePaise(course.price)}
            </Text>
            {hasDiscount && (
              <Text className="text-sm font-medium text-neutral-400 line-through">
                {formatRupeePaise(course.mrp!)}
              </Text>
            )}
            {hasDiscount && (
              <View className="rounded-full bg-green-100 dark:bg-green-900 px-2 py-0.5">
                <Text className="text-xs font-black text-green-700 dark:text-green-200">
                  Save {formatRupeePaise(course.mrp! - course.price)}
                </Text>
              </View>
            )}
          </View>

          {/* CTA hint */}
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              {course.total_lessons ? `📖 ${course.total_lessons} lessons` : 'View course'}
            </Text>
            <Text className="text-xs font-black text-brand-primary dark:text-brand-secondary">
              View →
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
