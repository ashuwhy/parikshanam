import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { olympiadLabel } from '@/types';
import type { Course } from '@/types';

type Props = {
  course: Course;
};

export function CourseHero({ course }: Props) {
  const olympiad = olympiadLabel(course);
  return (
    <View className="w-full">
      {course.thumbnail_url ? (
        <Image source={{ uri: course.thumbnail_url }} className="h-56 w-full" contentFit="cover" />
      ) : (
        <View className="h-56 w-full bg-ui-accent opacity-50" />
      )}
      {olympiad ? (
        <View className="absolute left-4 top-4 rounded-full bg-status-warning px-3 py-1 shadow-sm">
          <Text className="text-xs font-bold uppercase tracking-wider text-brand-dark">{olympiad}</Text>
        </View>
      ) : null}
    </View>
  );
}
