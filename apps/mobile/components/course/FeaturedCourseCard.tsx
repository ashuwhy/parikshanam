import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { BookOpen, ChevronRight, Clock, Volume2, VolumeX } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { Button } from '@/components/ui/Button';
import { iconColors } from '@/constants/Colors';
import { useBuyCourse } from '@/hooks/useBuyCourse';
import { useStorageUrl } from '@/hooks/useStorageUrl';
import { classRange, discountPercent, formatPrice } from '@/lib/courseUtils';
import { isYoutubeVideoId } from '@/lib/videoSource';
import { href } from '@/lib/href';
import { olympiadLabel } from '@/types';
import type { Course } from '@/types';

type Props = {
  course: Course;
  purchased?: boolean;
};

export function FeaturedCourseCard({ course, purchased }: Props) {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
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
  const [ytReady, setYtReady] = useState(false);

  const introIsYoutube = isYoutubeVideoId(course.intro_video_path);
  const { url: videoUrl } = useStorageUrl(introIsYoutube ? null : course.intro_video_path);

  const activeVideoUrl =
    !introIsYoutube && showVideo && videoUrl ? videoUrl : null;
  const showYoutubeIntro = introIsYoutube && showVideo;

  const player = useVideoPlayer(activeVideoUrl, (p) => {
    p.loop = true;
    p.muted = true;
  });

  // Replace source and play whenever the active URL becomes available.
  const prevVideoUrl = useRef<string | null>(null);
  useEffect(() => {
    if (activeVideoUrl && activeVideoUrl !== prevVideoUrl.current) {
      void player.replaceAsync(activeVideoUrl).then(() => {
        player.muted = muted;
        player.play();
      });
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
      if (!course.intro_video_path?.trim()) return;
      const timer = setTimeout(() => setShowVideo(true), 2000);
      return () => {
        clearTimeout(timer);
        setShowVideo(false);
        setMuted(true);
        setYtReady(false);
      };
    }, [course.intro_video_path]),
  );

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(href(`/course/${course.id}`))}
      className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 border border-ui-border dark:border-neutral-700"
    >
        {/* ── Media area ─────────────────────────────────────────── */}
        <View
          className="relative items-center justify-center bg-black"
          style={{ height: 192, overflow: 'hidden' }}
        >
          {/* YouTube player renders behind the curtain */}
          {showYoutubeIntro && course.intro_video_path && (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <YoutubePlayer
                height={192}
                width={windowWidth}
                videoId={course.intro_video_path.trim()}
                play
                mute={muted}
                forceAndroidAutoplay
                onChangeState={(state: string) => {
                  if (state === 'playing') setYtReady(true);
                }}
                initialPlayerParams={{
                  loop: true,
                  controls: false,
                  rel: false,
                  modestbranding: true,
                  iv_load_policy: 3,
                  fs: false,
                  cc_load_policy: 0,
                  disablekb: true,
                }}
                webViewProps={{
                  pointerEvents: 'none',
                  injectedJavaScript: `
                    (function() {
                      var style = document.createElement('style');
                      style.textContent = [
                        '.ytp-chrome-top',
                        '.ytp-chrome-bottom',
                        '.ytp-gradient-top',
                        '.ytp-gradient-bottom',
                        '.ytp-pause-overlay',
                        '.ytp-watermark',
                        '.ytp-share-button',
                        '.ytp-youtube-button',
                        '.ytp-branding',
                        '.ytp-endscreen-content',
                        '.ytp-ce-element',
                        '.iv-branding',
                        '.branding-img',
                        '.branding-img-preload',
                        '.ytp-embed',
                        '.ytp-show-cards-title',
                        '.ytp-title',
                        '.ytp-title-channel',
                        '.annotation',
                      ].join(',') + ' { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }';
                      document.head.appendChild(style);
                    })();
                    true;
                  `,
                  allowsInlineMediaPlayback: true,
                  mediaPlaybackRequiresUserAction: false,
                }}
              />
            </View>
          )}

          {/* Native video (non-YouTube) */}
          {activeVideoUrl && (
            <VideoView
              player={player}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              nativeControls={false}
            />
          )}

          {/* Curtain: thumbnail stays on top until YouTube is actually playing */}
          {(!showYoutubeIntro || !ytReady) && !activeVideoUrl && (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              {course.thumbnail_url ? (
                <Image
                  source={{ uri: course.thumbnail_url }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <BookOpen size={48} color={iconColors.primary} strokeWidth={1.2} />
                </View>
              )}
            </View>
          )}

          {(activeVideoUrl || showYoutubeIntro) && (
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
              title={`Enroll Now - ${formatPrice(course.price)}`}
              variant="primary"
              className="mt-4"
              loading={buying}
              onPress={() => void buy()}
            />
          )}
        </View>
    </Pressable>
  );
}
