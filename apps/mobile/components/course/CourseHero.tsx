import { Image } from 'expo-image';
import { BookOpen, Clock, Star } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/BackButton';
import { iconColors } from '@/constants/Colors';
import { olympiadLabel } from '@/types';
import type { Course } from '@/types';

type Props = {
  course: Course;
};

export function CourseHero({ course }: Props) {
  const olympiad = olympiadLabel(course);
  const insets = useSafeAreaInsets();

  return (
    <View className="relative w-full">
      {/* Hero image or branded fallback */}
      {course.thumbnail_url ? (
        <>
          <Image
            source={{ uri: course.thumbnail_url }}
            style={{ height: 256, width: '100%' }}
            contentFit="cover"
          />
          {/* Scrim only over real photos */}
          <View className="absolute bottom-0 left-0 right-0 h-24 bg-black/30" />
        </>
      ) : (
        <View
          className="h-64 w-full items-center justify-center bg-brand-primary"
          style={{ paddingTop: insets.top }}
        >
          <BookOpen size={64} color="rgba(255,255,255,0.35)" strokeWidth={1.2} />
          <Text
            className="mt-3 text-xs font-display uppercase tracking-widest text-white/50"
            numberOfLines={1}
          >
            {olympiad ?? 'Course'}
          </Text>
        </View>
      )}

      {/* Back button */}
      <View style={{ top: insets.top + 10 }} className="absolute left-4">
        <BackButton variant="dark" />
      </View>

      {/* Olympiad badge */}
      {olympiad ? (
        <View
          style={{ top: insets.top + 10 }}
          className="absolute left-16 flex-row items-center rounded-full bg-status-warning px-3 py-1.5"
        >
          <Text className="text-xs font-display uppercase tracking-wider text-brand-dark">
            {olympiad}
          </Text>
        </View>
      ) : null}

      {/* Featured badge */}
      {course.is_featured && (
        <View
          style={{ top: insets.top + 10 }}
          className="absolute right-4 flex-row items-center gap-1 rounded-full bg-brand-primary px-3 py-1.5"
        >
          <Star size={10} color={iconColors.onBrand} strokeWidth={2.5} />
          <Text className="text-xs font-display uppercase tracking-wider text-white">
            Featured
          </Text>
        </View>
      )}

      {/* Stats row at bottom */}
      <View className="absolute bottom-3 left-4 right-4 flex-row items-center gap-2">
        {course.total_lessons > 0 && (
          <View className="flex-row items-center gap-1.5 rounded-full bg-white/90 dark:bg-neutral-800/90 px-3 py-1">
            <BookOpen size={11} color={iconColors.structural} strokeWidth={2.5} />
            <Text className="text-xs font-display text-neutral-700 dark:text-neutral-300">
              {course.total_lessons} lessons
            </Text>
          </View>
        )}
        {course.duration_hours > 0 && (
          <View className="flex-row items-center gap-1.5 rounded-full bg-white/90 dark:bg-neutral-800/90 px-3 py-1">
            <Clock size={11} color={iconColors.structural} strokeWidth={2.5} />
            <Text className="text-xs font-display text-neutral-700 dark:text-neutral-300">
              {course.duration_hours}h
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
