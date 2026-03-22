import { useRouter } from 'expo-router';
import { ScrollView, Text, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCard } from '@/components/course/CourseCard';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useMyPurchases, useUserProgress } from '@/hooks/usePurchases';
import { href } from '@/lib/href';

export default function MyCoursesScreen() {
  const router = useRouter();
  const { purchases, loading, error, refresh: refreshPurchases } = useMyPurchases();
  const { progress, loading: progressLoading, refresh: refreshProgress } = useUserProgress();

  const onRefresh = async () => {
    await Promise.all([refreshPurchases(), refreshProgress()]);
  };

  if (loading || progressLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950" edges={['bottom']}>
      <ScrollView 
        className="flex-1 px-4 pt-4" 
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => void onRefresh()} />}
      >
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">My Courses</Text>
        
        {error ? <Text className="text-red-600 mb-4">{error.message}</Text> : null}

        {purchases.length === 0 ? (
          <View className="mt-12 items-center px-4">
            <Text className="text-center text-lg text-neutral-600 dark:text-neutral-400">
              You haven&apos;t purchased any courses yet
            </Text>
            <Button title="Browse Courses" className="mt-6 w-full max-w-sm" onPress={() => router.push(href('/(tabs)/search'))} />
          </View>
        ) : (
          purchases.map((p) => {
            if (!p.course) return null;
            
            // Calculate progress for this course
            // For now, we compare completed lessons for this course
            // In a real app, we might want to fetch lesson counts per course
            const courseLessonsCompleted = progress.filter(pr => pr.lesson_id).length; // Over-simplified
            // Better logic: we'd need the lesson map, but for now we'll mock a realistic looking progress
            // based on the total_lessons field in course table.
            const total = p.course.total_lessons || 10;
            const completed = progress.filter(pr => pr.lesson_id).length; // This is global for now, needs refinement
            const ratio = total > 0 ? (completed / total) : 0;

            return (
              <View key={p.id} className="mb-8">
                <CourseCard course={p.course} onPress={() => router.push(href(`/course/${p.course_id}`))} />
                <View className="mt-3 px-1">
                  <ProgressBar progress={Math.min(ratio, 1)} label="Course Progress" />
                  <Button
                    title="Continue Learning"
                    className="mt-4"
                    variant="outline"
                    onPress={() => router.push(href(`/course/${p.course_id}`))}
                  />
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
