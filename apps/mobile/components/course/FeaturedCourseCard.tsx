import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { BookOpen, ChevronRight, Clock, Volume2, VolumeX } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { iconColors } from '@/constants/Colors';
import { useBuyCourse } from '@/hooks/useBuyCourse';
import { useStorageUrl } from '@/hooks/useStorageUrl';
import { classRange, discountPercent, formatPrice } from '@/lib/courseUtils';
import { href } from '@/lib/href';
import { olympiadLabel } from '@/types';
import type { Course } from '@/types';

type Props = {
  course: Course;
  purchased?: boolean;
};

export function FeaturedCourseCard({ course, purchased }: Props) {
  const router = useRouter();
  const { buy, buying } = useBuyCourse(course);
  const olympiad = olympiadLabel(course);
  const cls = classRange(course);
  const hasDiscount = course.mrp != null && course.mrp > course.price;
  const metaLine = [olympiad, cls].filter(Boolean).join(' • ');
  const hasDescription = !!(course.description || course.subtitle);

  // ── Description read-more ──────────────────────────────────────
  const [expanded, setExpanded] = useState(false);

  // ── Intro video auto-play ──────────────────────────────────────
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(true);

  // Fetch the signed URL in the background from mount so it is ready
  // when the 2-second timer fires.
  const { url: videoUrl } = useStorageUrl(course.intro_video_path);

  // Only hand the URL to the player once we actually want to play.
  const activeVideoUrl = showVideo && videoUrl ? videoUrl : null;

  const player = useVideoPlayer(activeVideoUrl, (p) => {
    p.loop = true;
    p.muted = true;
  });

  // Replace source and play whenever the active URL becomes available.
  const prevVideoUrl = useRef<string | null>(null);
  useEffect(() => {
    if (activeVideoUrl && activeVideoUrl !== prevVideoUrl.current) {
      player.replace(activeVideoUrl);
      player.muted = muted;
      player.play();
      prevVideoUrl.current = activeVideoUrl;
    } else if (!activeVideoUrl && prevVideoUrl.current) {
      player.pause();
      prevVideoUrl.current = null;
    }
  }, [activeVideoUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep player muted state in sync with the toggle.
  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);

  // Start the 2-second timer when the home screen is focused;
  // cancel and reset when it loses focus or unmounts.
  useFocusEffect(
    useCallback(() => {
      if (!course.intro_video_path) return;
      const timer = setTimeout(() => setShowVideo(true), 2000);
      return () => {
        clearTimeout(timer);
        setShowVideo(false);
        setMuted(true);
      };
    }, [course.intro_video_path]),
  );

  // ── Press animation ────────────────────────────────────────────
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 6 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(href(`/course/${course.id}`))}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 border border-ui-border dark:border-neutral-700"
      >
        {/* ── Media area ─────────────────────────────────────────── */}
        <View
          className="relative items-center justify-center bg-brand-primary/8 dark:bg-brand-primary/5"
          style={{ height: 192 }}
        >
          {/* Thumbnail — shown while video is not yet active */}
          {!activeVideoUrl && course.thumbnail_url && (
            <Image
              source={{ uri: course.thumbnail_url }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          )}

          {/* Fallback icon when there is neither thumbnail nor video */}
          {!activeVideoUrl && !course.thumbnail_url && (
            <BookOpen size={48} color={iconColors.primary} strokeWidth={1.2} />
          )}

          {/* Intro video */}
          {activeVideoUrl && (
            <VideoView
              player={player}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              nativeControls={false}
            />
          )}

          {/* Mute / unmute button — only while video is playing */}
          {activeVideoUrl && (
            <Pressable
              onPress={() => setMuted((m) => !m)}
              hitSlop={8}
              className="absolute top-2.5 right-2.5 rounded-full bg-black/50 p-2"
            >
              {muted
                ? <VolumeX size={14} color="white" strokeWidth={2.5} />
                : <Volume2 size={14} color="white" strokeWidth={2.5} />}
            </Pressable>
          )}
        </View>

        {/* ── Body ───────────────────────────────────────────────── */}
        <View className="px-5 pt-4 pb-5">
          {metaLine ? (
            <Text className="mb-2 text-xs font-display uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              {metaLine}
            </Text>
          ) : null}

          <Text
            className="text-xl font-display-black leading-snug text-neutral-900 dark:text-neutral-100"
            numberOfLines={2}
          >
            {course.title}
          </Text>

          {/* Description + read more */}
          {hasDescription && (
            <View className="mt-2">
              <Text
                className="text-sm font-sans-medium leading-relaxed text-neutral-500 dark:text-neutral-400"
                numberOfLines={expanded ? undefined : 3}
              >
                {course.description ?? course.subtitle}
              </Text>
              <Pressable onPress={() => setExpanded((e) => !e)} className="mt-1" hitSlop={4}>
                <Text className="text-xs font-sans-bold text-brand-primary">
                  {expanded ? 'Show less' : 'Read more'}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Stats */}
          {(course.total_lessons > 0 || course.duration_hours > 0) && (
            <View className="mt-3 flex-row items-center gap-4">
              {course.total_lessons > 0 && (
                <View className="flex-row items-center gap-1.5">
                  <BookOpen size={12} color={iconColors.muted} strokeWidth={2.5} />
                  <Text className="text-xs font-sans-medium text-neutral-400 dark:text-neutral-500">
                    {course.total_lessons} lessons
                  </Text>
                </View>
              )}
              {course.duration_hours > 0 && (
                <View className="flex-row items-center gap-1.5">
                  <Clock size={12} color={iconColors.muted} strokeWidth={2.5} />
                  <Text className="text-xs font-sans-medium text-neutral-400 dark:text-neutral-500">
                    {course.duration_hours}h
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Divider */}
          <View className="mt-4 border-t border-neutral-100 dark:border-neutral-700" />

          {/* Price */}
          <View className="mt-3 flex-row items-center gap-3">
            <Text className="text-2xl font-display-black text-brand-primary">
              {formatPrice(course.price)}
            </Text>
            {hasDiscount && (
              <>
                <Text className="text-sm font-sans-medium text-neutral-400 line-through">
                  {formatPrice(course.mrp!)}
                </Text>
                <View className="rounded-full bg-green-50 dark:bg-green-900/40 px-2.5 py-0.5 border border-green-200 dark:border-green-800">
                  <Text className="text-xs font-display-black text-green-700 dark:text-green-300">
                    {discountPercent(course.price, course.mrp!)}% off
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* CTA */}
          {purchased ? (
            <Button
              title="Continue Learning"
              variant="outline"
              className="mt-4"
              rightIcon={<ChevronRight size={16} color={iconColors.primary} strokeWidth={2.5} />}
              onPress={() => router.push(href(`/course/${course.id}`))}
            />
          ) : (
            <Button
              title={`Enroll Now — ${formatPrice(course.price)}`}
              variant="primary"
              className="mt-4"
              loading={buying}
              onPress={() => void buy()}
            />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}
