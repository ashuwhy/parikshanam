import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { olympiadLabel } from '@/types';
import type { Course } from '@/types';
import { dimensionalShadows } from '@/constants/Colors';

type Props = {
  course: Course;
};

export function CourseHero({ course }: Props) {
  const olympiad = olympiadLabel(course);

  return (
    <View className="relative w-full">
      {/* Hero image */}
      {course.thumbnail_url ? (
        <Image
          source={{ uri: course.thumbnail_url }}
          className="h-64 w-full"
          contentFit="cover"
        />
      ) : (
        <View className="h-64 w-full items-center justify-center bg-brand-primary/15 dark:bg-brand-primary/10">
          <Text className="text-6xl">📚</Text>
          <Text className="mt-2 text-sm font-black uppercase tracking-wider text-brand-primary/40">
            {course.title}
          </Text>
        </View>
      )}

      {/* Bottom scrim for visual separation */}
      <View className="absolute bottom-0 left-0 right-0 h-20 bg-black/25" />

      {/* Olympiad badge */}
      {olympiad ? (
        <View
          className="absolute left-4 top-4 rounded-full bg-status-warning px-3 py-1.5"
          style={dimensionalShadows.badge}
        >
          <Text className="text-xs font-black uppercase tracking-wider text-brand-dark">
            {olympiad}
          </Text>
        </View>
      ) : null}

      {/* Featured badge */}
      {course.is_featured && (
        <View
          className="absolute right-4 top-4 rounded-full bg-brand-primary px-3 py-1.5"
          style={dimensionalShadows.brand.sm}
        >
          <Text className="text-xs font-black uppercase tracking-wider text-white">
            ⭐ Featured
          </Text>
        </View>
      )}

      {/* Stats row overlaid at bottom */}
      <View className="absolute bottom-3 left-4 right-4 flex-row items-center gap-3">
        {course.total_lessons > 0 && (
          <View className="flex-row items-center gap-1 rounded-full bg-white/90 dark:bg-neutral-800/90 px-3 py-1">
            <Text className="text-xs font-black text-neutral-700 dark:text-neutral-300">
              📖 {course.total_lessons} lessons
            </Text>
          </View>
        )}
        {course.duration_hours > 0 && (
          <View className="flex-row items-center gap-1 rounded-full bg-white/90 dark:bg-neutral-800/90 px-3 py-1">
            <Text className="text-xs font-black text-neutral-700 dark:text-neutral-300">
              ⏱ {course.duration_hours}h
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
