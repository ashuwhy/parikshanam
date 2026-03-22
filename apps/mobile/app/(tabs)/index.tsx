import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCard } from '@/components/course/CourseCard';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { useFeaturedCourse } from '@/hooks/useCourses';
import { useHasPurchased } from '@/hooks/usePurchases';
import { href } from '@/lib/href';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const { course, loading, error } = useFeaturedCourse();
  const { purchased, loading: purchaseLoading } = useHasPurchased(course?.id);

  if (loading || purchaseLoading) {
    return <LoadingScreen />;
  }

  const name = profile?.full_name?.trim() || 'there';

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {greeting()}, {name} 👋
        </Text>
        <Text className="mt-1 text-neutral-600 dark:text-neutral-400">Ready to ace your Olympiad?</Text>

        {error ? (
          <Text className="mt-8 text-error">{error.message}</Text>
        ) : null}

        {course ? (
          <View className="mt-8">
            <CourseCard course={course} onPress={() => router.push(href(`/course/${course.id}`))} />
            <Button
              title={purchased ? 'Continue Learning' : 'View Course'}
              className="mt-2"
              onPress={() => router.push(href(`/course/${course.id}`))}
            />
          </View>
        ) : (
          <Text className="mt-8 text-neutral-500">No featured course yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
