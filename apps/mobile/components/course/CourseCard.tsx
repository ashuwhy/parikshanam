import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { olympiadLabel } from '@/types';
import type { Course } from '@/types';

function formatRupeePaise(paise: number) {
  return `₹${(paise / 100).toFixed(0)}`;
}

type Props = {
  course: Course;
  onPress?: () => void;
};

export function CourseCard({ course, onPress }: Props) {
  const olympiad = olympiadLabel(course);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="mb-4 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      {course.thumbnail_url ? (
        <Image source={{ uri: course.thumbnail_url }} className="h-36 w-full" contentFit="cover" />
      ) : (
        <View className="h-36 w-full bg-indigo-100 dark:bg-indigo-950" />
      )}
      <View className="p-4">
        {olympiad ? (
          <View className="mb-2 self-start rounded-full bg-amber-100 px-2 py-0.5 dark:bg-amber-950">
            <Text className="text-xs font-semibold text-amber-800 dark:text-amber-200">{olympiad}</Text>
          </View>
        ) : null}
        <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{course.title}</Text>
        {course.subtitle ? (
          <Text className="mt-1 text-sm text-neutral-600 dark:text-neutral-400" numberOfLines={2}>
            {course.subtitle}
          </Text>
        ) : null}
        <View className="mt-3 flex-row items-center gap-2">
          <Text className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{formatRupeePaise(course.price)}</Text>
          {course.mrp != null && course.mrp > course.price ? (
            <Text className="text-sm text-neutral-400 line-through">{formatRupeePaise(course.mrp)}</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
