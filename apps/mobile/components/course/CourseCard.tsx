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
      className="mb-4 overflow-hidden bg-white dark:bg-neutral-800 rounded-[2rem] shadow-sm border border-ui-border dark:border-neutral-700">
      {course.thumbnail_url ? (
        <Image source={{ uri: course.thumbnail_url }} className="h-36 w-full" contentFit="cover" />
      ) : (
        <View className="h-36 w-full bg-ui-accent dark:bg-neutral-700 opacity-50" />
      )}
      <View className="p-6">
        {olympiad ? (
          <View className="mb-3 self-start rounded-full bg-status-warning dark:bg-yellow-900 px-3 py-1 opacity-90">
            <Text className="text-xs font-bold uppercase tracking-wider text-brand-dark dark:text-yellow-200">{olympiad}</Text>
          </View>
        ) : null}
        <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{course.title}</Text>
        {course.subtitle ? (
          <Text className="mt-1 text-base font-medium text-neutral-600 dark:text-neutral-400" numberOfLines={2}>
            {course.subtitle}
          </Text>
        ) : null}
        <View className="mt-4 flex-row items-center gap-2">
          <Text className="text-lg font-bold text-brand-primary dark:text-brand-secondary">{formatRupeePaise(course.price)}</Text>
          {course.mrp != null && course.mrp > course.price ? (
            <Text className="text-base font-medium text-neutral-400 dark:text-neutral-500 line-through">{formatRupeePaise(course.mrp)}</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
