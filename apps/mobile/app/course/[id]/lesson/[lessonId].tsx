import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, Clock, VideoOff } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { VideoPlayer } from '@/components/course/VideoPlayer';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { iconColors } from '@/constants/Colors';
import { useLessonById } from '@/hooks/useCourses';
import { useVideoUrl } from '@/hooks/useVideoUrl';
import { useAuth } from '@/hooks/useAuth';
import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';

export default function LessonScreen() {
  const { id: courseId, lessonId } = useLocalSearchParams<{ id: string; lessonId: string }>();
  const router = useRouter();
  const { session } = useAuth();
  const { lesson, loading, error } = useLessonById(lessonId);
  const { url: videoUrl, loading: urlLoading, error: urlError, refetch } = useVideoUrl(
    lesson?.video_storage_path ? lessonId : undefined,
  );
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  const markComplete = useCallback(async () => {
    if (!session?.user || !lessonId || completed || marking) return;
    setMarking(true);
    const { error: pgError } = await supabase
      .from('user_progress')
      .upsert(
        { user_id: session.user.id, lesson_id: lessonId, course_id: courseId, completed_at: new Date().toISOString() },
        { onConflict: 'user_id,lesson_id' },
      );
    setMarking(false);
    if (pgError) {
      Toast.show({ type: 'error', text1: 'Failed to save progress' });
    } else {
      setCompleted(true);
      // Invalidate progress cache so tabs update instantly
      void queryClient.invalidateQueries({ queryKey: ['progress', session.user.id] });
      Toast.show({ type: 'success', text1: 'Lesson completed!' });
    }
  }, [session?.user, lessonId, courseId, completed, marking]);

  // Auto-mark complete when video finishes
  const onVideoEnded = useCallback(() => {
    void markComplete();
  }, [markComplete]);

  if (loading) return <LoadingScreen />;

  if (error || !lesson) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ui-bg px-6">
        <Text className="text-center font-sans-medium text-neutral-500">Lesson not found</Text>
        <Button title="Go Back" onPress={() => router.back()} className="mt-4" variant="outline" />
      </SafeAreaView>
    );
  }

  const hasVideo = !!lesson.video_storage_path;

  return (
    <SafeAreaView className="flex-1 bg-neutral-950" edges={['top']}>

      {/* Video area — full width, dark background */}
      {hasVideo ? (
        <VideoPlayer
          url={urlLoading ? null : (videoUrl ?? null)}
          onEnded={onVideoEnded}
        />
      ) : lesson.thumbnail_url ? (
        <View className="w-full bg-neutral-950" style={{ aspectRatio: 16 / 9 }}>
          <Image
            source={{ uri: lesson.thumbnail_url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          <View className="absolute inset-0 items-center justify-center bg-black/30">
            <VideoOff size={32} color="rgba(255,255,255,0.7)" strokeWidth={1.5} />
          </View>
        </View>
      ) : (
        <View className="w-full items-center justify-center bg-neutral-900" style={{ aspectRatio: 16 / 9 }}>
          <VideoOff size={40} color={iconColors.muted} strokeWidth={1.5} />
          <Text className="mt-2 text-xs font-sans-medium text-neutral-500">No video for this lesson</Text>
        </View>
      )}

      {/* Content area — white sheet below video */}
      <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900" edges={['bottom']}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header row */}
          <View className="flex-row items-center gap-3 px-4 pt-4 pb-3 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <BackButton variant="light" />
            <Text className="flex-1 text-base font-display-extra text-neutral-900 dark:text-neutral-100" numberOfLines={1}>
              {lesson.title}
            </Text>
          </View>

          {/* Signed URL error banner */}
          {urlError && (
            <View className="mx-5 mt-4 rounded-2xl bg-red-50 dark:bg-red-950 px-4 py-3 flex-row items-center gap-3">
              <Text className="flex-1 text-sm font-sans-medium text-red-600 dark:text-red-400">
                Could not load video. Check your connection.
              </Text>
              <Text
                className="text-sm font-sans-bold text-red-600 dark:text-red-400"
                onPress={() => void refetch()}
              >
                Retry
              </Text>
            </View>
          )}

          {/* Lesson body */}
          <View className="px-5 pt-5">
            <Text className="text-xl font-display-black leading-tight text-neutral-900 dark:text-neutral-100">
              {lesson.title}
            </Text>
            {lesson.duration_minutes > 0 && (
              <View className="mt-2 flex-row items-center gap-1.5">
                <Clock size={12} color={iconColors.muted} strokeWidth={2.5} />
                <Text className="text-xs font-sans-medium text-neutral-400 dark:text-neutral-500">
                  {lesson.duration_minutes} min
                </Text>
              </View>
            )}

            {lesson.content_text ? (
              <Text className="mt-4 text-base font-sans-medium leading-relaxed text-neutral-700 dark:text-neutral-300">
                {lesson.content_text}
              </Text>
            ) : null}

            {/* Complete button */}
            <View className="mt-8">
              {completed ? (
                <View className="flex-row items-center justify-center gap-2 rounded-2xl bg-green-100 dark:bg-green-900/30 py-4">
                  <CheckCircle size={18} color="#22C55E" strokeWidth={2.5} />
                  <Text className="text-sm font-display-black text-green-700 dark:text-green-400">
                    Lesson completed
                  </Text>
                </View>
              ) : (
                <Button
                  title="Mark as Completed"
                  loading={marking}
                  onPress={() => void markComplete()}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaView>
  );
}
