import { useRouter } from 'expo-router';
import { BookOpen, CheckCircle, Play } from 'lucide-react-native';
import { ScrollView, Text, View, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useMyPurchases, useUserProgress } from '@/hooks/usePurchases';
import { href } from '@/lib/href';
import { Image } from 'expo-image';
import { olympiadLabel } from '@/types';
import { iconColors } from '@/constants/Colors';

export default function MyCoursesScreen() {
  const router = useRouter();
  const { purchases, loading, error, refresh: refreshPurchases } = useMyPurchases();
  const { progress, loading: progressLoading, refresh: refreshProgress } = useUserProgress();

  const onRefresh = async () => {
    await Promise.all([refreshPurchases(), refreshProgress()]);
  };

  if (loading || progressLoading) return <LoadingScreen />;

  const totalLessons = progress.filter((p) => p.lesson_id).length;

  return (
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900" edges={['top', 'bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => void onRefresh()} />
        }
      >

        {/* Inline header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
          <Text className="text-2xl font-display-black tracking-tight text-neutral-900 dark:text-neutral-100">
            My Learning
          </Text>
          <Avatar size="md" />
        </View>

        {/* Stats bar */}
        {purchases.length > 0 && (
          <View className="mx-5 mb-2 flex-row gap-3">
            <View className="flex-1 items-center rounded-2xl bg-white dark:bg-neutral-800 py-4 border border-ui-border dark:border-neutral-700">
              <Text className="text-2xl font-display-black text-brand-primary">{purchases.length}</Text>
              <Text className="mt-1 text-xs font-display uppercase tracking-wider text-neutral-500">Enrolled</Text>
            </View>
            <View className="flex-1 items-center rounded-2xl bg-white dark:bg-neutral-800 py-4 border border-ui-border dark:border-neutral-700">
              <Text className="text-2xl font-display-black text-brand-primary">{totalLessons}</Text>
              <Text className="mt-1 text-xs font-display uppercase tracking-wider text-neutral-500">Completed</Text>
            </View>
          </View>
        )}

        {error ? (
          <View className="mx-5 mt-4 rounded-2xl bg-red-50 px-4 py-3">
            <Text className="text-sm font-sans-bold text-red-600">{error.message}</Text>
          </View>
        ) : null}

        {/* Course list */}
        <View className="mt-4 px-5">
          {purchases.length === 0 ? (
            <View className="mt-16 items-center px-4">
              <BookOpen size={56} color={iconColors.empty} strokeWidth={1.5} />
              <Text className="mt-4 text-xl font-display-black text-neutral-900 dark:text-neutral-100">
                No courses yet
              </Text>
              <Text className="mt-2 text-center text-sm font-sans-medium text-neutral-500">
                Explore our catalog and enroll in your first Olympiad course
              </Text>
              <Button
                title="Browse Courses"
                variant="primary"
                className="mt-6 px-8 py-3"
                onPress={() => router.push(href('/(tabs)/search'))}
              />
            </View>
          ) : (
            purchases.map((p) => {
              if (!p.course) return null;
              const course = p.course;
              const total = course.total_lessons || 10;
              const completed = progress.filter((pr) => pr.lesson_id).length;
              const ratio = Math.min(total > 0 ? completed / total : 0, 1);
              const pct = Math.round(ratio * 100);
              const olympiad = olympiadLabel(course);

              return (
                <Pressable
                  key={p.id}
                  onPress={() => router.push(href(`/course/${p.course_id}`))}
                  className="mb-4 overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 border border-ui-border dark:border-neutral-700"
                >
                  {course.thumbnail_url ? (
                    <Image
                      source={{ uri: course.thumbnail_url }}
                      style={{ height: 128, width: '100%' }}
                      contentFit="cover"
                    />
                  ) : (
                    <View className="h-32 w-full items-center justify-center bg-brand-primary/10">
                      <BookOpen size={40} color={iconColors.primary} strokeWidth={1.5} />
                    </View>
                  )}

                  <View className="p-4">
                    {olympiad ? (
                      <View className="mb-2 self-start rounded-full bg-status-warning/20 px-3 py-1">
                        <Text className="text-xs font-display uppercase tracking-wider text-brand-dark">{olympiad}</Text>
                      </View>
                    ) : null}
                    <Text className="text-base font-display-extra text-neutral-900 dark:text-neutral-100" numberOfLines={2}>
                      {course.title}
                    </Text>

                    <View className="mt-3">
                      <View className="mb-1.5 flex-row items-center justify-between">
                        <Text className="text-xs font-display text-neutral-500 uppercase tracking-wider">Progress</Text>
                        <Text className="text-xs font-display-black text-brand-primary">{pct}%</Text>
                      </View>
                      <ProgressBar progress={ratio} />
                    </View>

                    <Button
                      title={pct >= 100 ? 'Review Course' : 'Resume'}
                      variant="ghost"
                      className="mt-3 rounded-xl bg-brand-primary/10 px-4 py-2.5"
                      textClassName="text-brand-dark"
                      leftIcon={
                        pct >= 100 ? (
                          <CheckCircle size={14} color={iconColors.onWarning} strokeWidth={2.5} />
                        ) : (
                          <Play size={14} color={iconColors.onWarning} strokeWidth={2.5} />
                        )
                      }
                      onPress={() => router.push(href(`/course/${p.course_id}`))}
                    />
                  </View>
                </Pressable>
              );
            })
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
