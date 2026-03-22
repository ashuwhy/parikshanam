import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCard } from '@/components/course/CourseCard';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useMyPurchases } from '@/hooks/usePurchases';
import { href } from '@/lib/href';

export default function MyCoursesScreen() {
  const router = useRouter();
  const { purchases, loading, error } = useMyPurchases();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 32 }}>
        {error ? <Text className="text-red-600">{error.message}</Text> : null}

        {purchases.length === 0 ? (
          <View className="mt-12 items-center px-4">
            <Text className="text-center text-lg text-neutral-600 dark:text-neutral-400">
              You haven&apos;t purchased any courses yet
            </Text>
            <Button title="Browse Courses" className="mt-6 w-full max-w-sm" onPress={() => router.push(href('/(tabs)/search'))} />
          </View>
        ) : (
          purchases.map((p) =>
            p.course ? (
              <View key={p.id}>
                <CourseCard course={p.course} onPress={() => router.push(href(`/course/${p.course_id}`))} />
                <Button
                  title="Continue Learning"
                  className="mb-6"
                  variant="outline"
                  onPress={() => router.push(href(`/course/${p.course_id}`))}
                />
              </View>
            ) : null,
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
