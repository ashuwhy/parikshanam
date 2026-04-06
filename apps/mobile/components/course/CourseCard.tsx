import { Image } from 'expo-image';
import { BookOpen, CheckCircle } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { CourseBadge } from '@/components/course/CourseBadge';
import { Button } from '@/components/ui/Button';
import { brand, iconColors } from '@/constants/Colors';
import { useBuyCourse } from '@/hooks/useBuyCourse';
import { prefetchStorageUrl } from '@/hooks/useStorageUrl';
import { isYoutubeVideoId } from '@/lib/videoSource';
import { classRange, discountPercent, formatPrice } from '@/lib/courseUtils';
import { olympiadLabel } from '@/types';
import type { Course } from '@/types';

type Props = {
  course: Course;
  onPress?: () => void;
  purchased?: boolean;
};

export function CourseCard({ course, onPress, purchased }: Props) {
  const { buy, buying } = useBuyCourse(course);
  const olympiad = olympiadLabel(course);
  const cls = classRange(course);
  const hasDiscount = course.mrp != null && course.mrp > course.price;
  const metaLine = [olympiad, cls].filter(Boolean).join(' • ');

  return (
    <View style={{ marginBottom: 16 }}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={() => {
          if (!isYoutubeVideoId(course.intro_video_path)) {
            prefetchStorageUrl(course.intro_video_path);
          }
        }}
        className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 border border-ui-border dark:border-neutral-700"
      >
        {/* Thumbnail */}
        <View className="relative">
          {course.thumbnail_url ? (
            <>
              <Image
                source={{ uri: course.thumbnail_url }}
                style={{ height: 156, width: '100%' }}
                contentFit="cover"
              />
            </>
          ) : (
            <View className="h-36 w-full items-center justify-center bg-brand-primary/8 dark:bg-brand-primary/5">
              <BookOpen size={36} color={iconColors.primary} strokeWidth={1.5} />
            </View>
          )}

          {/* Single olympiad badge - top-left */}
          {olympiad ? (
            <View className="absolute left-3 top-3">
              <CourseBadge label={olympiad} variant="olympiad" />
            </View>
          ) : null}

          {/* Enrolled - top-right */}
          {purchased ? (
            <View className="absolute right-3 top-3">
              <CourseBadge
                label="Enrolled"
                variant="enrolled"
                className="bg-white/90 dark:bg-neutral-800/90"
                textClassName="text-green-700 dark:text-green-300"
                icon={<CheckCircle size={10} color={brand.success} strokeWidth={2.5} />}
              />
            </View>
          ) : null}
        </View>

        {/* Content */}
        <View className="px-4 pt-3 pb-4">
          {/* Meta line */}
          {metaLine ? (
            <Text className="mb-1.5 text-xs font-display uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              {metaLine}
            </Text>
          ) : null}

          <Text
            className="text-base font-display-extra leading-snug text-neutral-900 dark:text-neutral-100"
            numberOfLines={2}
          >
            {course.title}
          </Text>

          {/* Price */}
          <View className="mt-2.5 flex-row items-center gap-2">
            <Text className="text-lg font-display-black text-brand-primary">
              {formatPrice(course.price)}
            </Text>
            {hasDiscount && (
              <>
                <Text className="text-sm font-sans-medium text-neutral-400 line-through">
                  {formatPrice(course.mrp!)}
                </Text>
                <Text className="text-xs font-display-black text-green-600 dark:text-green-400">
                  -{discountPercent(course.price, course.mrp!)}%
                </Text>
              </>
            )}
          </View>

          {/* CTA */}
          {purchased ? (
            <View className="mt-3 flex-row items-center gap-1.5">
              <CheckCircle size={13} color={brand.success} strokeWidth={2.5} />
              <Text className="text-xs font-display-black text-green-600 dark:text-green-400">
                Enrolled - tap to continue
              </Text>
            </View>
          ) : (
            <Button
              title={`Enroll - ${formatPrice(course.price)}`}
              variant="primary"
              className="mt-3 py-3"
              loading={buying}
              onPress={() => void buy()}
            />
          )}
        </View>
      </Pressable>
    </View>
  );
}
