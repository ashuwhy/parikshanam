import { useRouter } from 'expo-router';
import { ScrollView, Text, View, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useMyPurchases, useUserProgress } from '@/hooks/usePurchases';
import { href } from '@/lib/href';
import { Image } from 'expo-image';
import { olympiadLabel } from '@/types';
import { dimensionalShadows } from '@/constants/Colors';

function formatRupeePaise(paise: number) {
  return `₹${(paise / 100).toFixed(0)}`;
}

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
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => void onRefresh()} />
        }
      >

        {/* Stats bar */}
        {purchases.length > 0 && (
          <View className="mx-5 mt-5 flex-row gap-3">
            <View
              className="flex-1 items-center rounded-2xl bg-white dark:bg-neutral-800 py-4 border border-ui-border dark:border-neutral-700"
              style={dimensionalShadows.sm.light}
            >
              <Text className="text-2xl font-black text-brand-primary">{purchases.length}</Text>
              <Text className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500">Enrolled</Text>
            </View>
            <View
              className="flex-1 items-center rounded-2xl bg-white dark:bg-neutral-800 py-4 border border-ui-border dark:border-neutral-700"
              style={dimensionalShadows.sm.light}
            >
              <Text className="text-2xl font-black text-brand-primary">{totalLessons}</Text>
              <Text className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500">Completed</Text>
            </View>
          </View>
        )}

        {error ? (
          <View className="mx-5 mt-4 rounded-2xl bg-red-50 px-4 py-3">
            <Text className="text-sm font-bold text-red-600">{error.message}</Text>
          </View>
        ) : null}

        {/* Course list */}
        <View className="mt-5 px-5">
          {purchases.length === 0 ? (
            <View className="mt-16 items-center px-4">
              <Text className="text-5xl">📚</Text>
              <Text className="mt-4 text-xl font-black text-neutral-900 dark:text-neutral-100">
                No courses yet
              </Text>
              <Text className="mt-2 text-center text-sm font-medium text-neutral-500">
                Explore our catalog and enroll in your first Olympiad course
              </Text>
              <Pressable
                onPress={() => router.push(href('/(tabs)/search'))}
                className="mt-6 rounded-2xl bg-brand-primary px-8 py-3"
                style={dimensionalShadows.brand.md}
              >
                <Text className="text-base font-black text-white">Browse Courses</Text>
              </Pressable>
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
                  className="mb-4 overflow-hidden rounded-[2rem] bg-white dark:bg-neutral-800 border border-ui-border dark:border-neutral-700"
                  style={dimensionalShadows.md.light}
                >
                  {/* Thumbnail */}
                  {course.thumbnail_url ? (
                    <Image
                      source={{ uri: course.thumbnail_url }}
                      className="h-32 w-full"
                      contentFit="cover"
                    />
                  ) : (
                    <View className="h-32 w-full items-center justify-center bg-brand-primary/10">
                      <Text className="text-4xl">📖</Text>
                    </View>
                  )}

                  <View className="p-4">
                    {/* Badge + title */}
                    {olympiad ? (
                      <View className="mb-2 self-start rounded-full bg-status-warning/20 px-3 py-1">
                        <Text className="text-xs font-black uppercase tracking-wider text-brand-dark">{olympiad}</Text>
                      </View>
                    ) : null}
                    <Text className="text-base font-black text-neutral-900 dark:text-neutral-100" numberOfLines={2}>
                      {course.title}
                    </Text>

                    {/* Progress section */}
                    <View className="mt-3">
                      <View className="mb-1.5 flex-row items-center justify-between">
                        <Text className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Progress</Text>
                        <Text className="text-xs font-black text-brand-primary">{pct}%</Text>
                      </View>
                      <ProgressBar progress={ratio} />
                    </View>

                    {/* Resume button */}
                    <Pressable
                      onPress={() => router.push(href(`/course/${p.course_id}`))}
                      className="mt-3 items-center rounded-xl bg-brand-primary/10 py-2.5"
                    >
                      <Text className="text-sm font-black text-brand-dark">
                        {pct >= 100 ? '🎉 Review Course' : '▶ Resume'}
                      </Text>
                    </Pressable>
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
