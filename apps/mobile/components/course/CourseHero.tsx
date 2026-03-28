import { Image } from 'expo-image';
import { BookOpen, Clock } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { CourseBadge } from '@/components/course/CourseBadge';
import { iconColors } from '@/constants/Colors';
import { classRange } from '@/lib/courseUtils';
import { olympiadLabel } from '@/types';
import type { Course } from '@/types';

type Props = {
  course: Course;
};

export function CourseHero({ course }: Props) {
  const olympiad = olympiadLabel(course);
  const cls = classRange(course);

  return (
    <View className="relative w-full" style={{ aspectRatio: 16 / 9 }}>
      {course.thumbnail_url ? (
        <Image
          source={{ uri: course.thumbnail_url }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
      ) : (
        <View className="flex-1 items-center justify-center bg-brand-primary">
          <BookOpen size={56} color="rgba(255,255,255,0.30)" strokeWidth={1.2} />
          <Text className="mt-2 text-xs font-display uppercase tracking-widest text-white/40">
            {olympiad ?? 'Course'}
          </Text>
        </View>
      )}

      {/* Bottom scrim for badge legibility */}
      <View className="absolute bottom-0 left-0 right-0 h-20 bg-black/25" />

      {/* Olympiad badge - bottom-left */}
      {olympiad ? (
        <View className="absolute bottom-3 left-4">
          <CourseBadge label={olympiad} variant="olympiad" />
        </View>
      ) : null}

      {/* Stats - bottom row */}
      <View className="absolute bottom-3 right-4 flex-row items-center gap-2">
        {course.total_lessons > 0 && (
          <View className="flex-row items-center gap-1 rounded-full bg-white/90 dark:bg-neutral-800/90 px-2.5 py-1">
            <BookOpen size={10} color={iconColors.structural} strokeWidth={2.5} />
            <Text className="text-[11px] font-display text-neutral-700 dark:text-neutral-300">
              {course.total_lessons} {course.total_lessons === 1 ? 'lesson' : 'lessons'}
            </Text>
          </View>
        )}
        {course.duration_hours > 0 && (
          <View className="flex-row items-center gap-1 rounded-full bg-white/90 dark:bg-neutral-800/90 px-2.5 py-1">
            <Clock size={10} color={iconColors.structural} strokeWidth={2.5} />
            <Text className="text-[11px] font-display text-neutral-700 dark:text-neutral-300">
              {course.duration_hours}h
            </Text>
          </View>
        )}
      </View>

      {/* Class badge - top-right (positioned by parent via insets) */}
      {cls ? (
        <View className="absolute top-3 right-4">
          <CourseBadge
            label={cls}
            variant="class"
            className="bg-white/90 dark:bg-neutral-800/90"
            textClassName="text-neutral-700 dark:text-neutral-200"
          />
        </View>
      ) : null}
    </View>
  );
}
