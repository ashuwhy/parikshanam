import { useRouter } from 'expo-router';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCard } from '@/components/course/CourseCard';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { useFeaturedCourse } from '@/hooks/useCourses';
import { useHasPurchased, useMyPurchases, useUserProgress } from '@/hooks/usePurchases';
import { href } from '@/lib/href';
import { dimensionalShadows } from '@/constants/Colors';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const SUBJECT_TILES = [
  { emoji: '🔢', label: 'Math', color: '#EFF6FF', border: '#BFDBFE' },
  { emoji: '⚗️', label: 'Science', color: '#F0FDF4', border: '#BBF7D0' },
  { emoji: '🌍', label: 'Geography', color: '#FFFBEB', border: '#FDE68A' },
  { emoji: '💻', label: 'Computing', color: '#F5F3FF', border: '#DDD6FE' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const { course, loading, error } = useFeaturedCourse();
  const { purchased } = useHasPurchased(course?.id);
  const { purchases } = useMyPurchases();
  const { progress } = useUserProgress();

  if (loading) return <LoadingScreen />;

  const name = profile?.full_name?.split(' ')[0]?.trim() || 'there';
  const totalLessons = progress.length;
  const enrolledCount = purchases.length;

  return (
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Greeting header */}
        <View className="px-5 pt-5 pb-4">
          <Text className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            {greeting()}, {name} 👋
          </Text>
          <Text className="mt-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Ready to ace your Olympiad?
          </Text>
        </View>

        {/* Stats row */}
        {(enrolledCount > 0 || totalLessons > 0) && (
          <View className="mx-5 mb-6 flex-row gap-3">
            <View
              className="flex-1 items-center rounded-2xl bg-white dark:bg-neutral-800 py-4 border border-ui-border dark:border-neutral-700"
              style={dimensionalShadows.sm.light}
            >
              <Text className="text-2xl font-black text-brand-primary">{enrolledCount}</Text>
              <Text className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-wider">
                {enrolledCount === 1 ? 'Course' : 'Courses'}
              </Text>
            </View>
            <View
              className="flex-1 items-center rounded-2xl bg-white dark:bg-neutral-800 py-4 border border-ui-border dark:border-neutral-700"
              style={dimensionalShadows.sm.light}
            >
              <Text className="text-2xl font-black text-brand-primary">{totalLessons}</Text>
              <Text className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-wider">
                Lessons Done
              </Text>
            </View>
            <View
              className="flex-1 items-center rounded-2xl bg-brand-primary py-4"
              style={dimensionalShadows.brand.sm}
            >
              <Text className="text-2xl font-black text-white">🔥</Text>
              <Text className="text-xs font-bold text-white/80 mt-1 uppercase tracking-wider">Keep it up</Text>
            </View>
          </View>
        )}

        {/* Featured Course */}
        {error ? (
          <View className="mx-5 rounded-2xl bg-red-50 px-4 py-3">
            <Text className="text-sm font-bold text-red-600">{error.message}</Text>
          </View>
        ) : course ? (
          <View className="px-5">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-base font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                ✨ Featured
              </Text>
              <Pressable onPress={() => router.push(href('/(tabs)/search'))}>
                <Text className="text-sm font-bold text-brand-primary">See all →</Text>
              </Pressable>
            </View>
            <CourseCard
              course={course}
              onPress={() => router.push(href(`/course/${course.id}`))}
              purchased={purchased}
            />
          </View>
        ) : null}

        {/* Browse by subject */}
        <View className="mt-6 px-5">
          <Text className="mb-3 text-base font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            📚 Browse Topics
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {SUBJECT_TILES.map((s) => (
              <Pressable
                key={s.label}
                onPress={() => router.push(href('/(tabs)/search'))}
                className="flex-row items-center gap-2 rounded-2xl border px-4 py-3"
                style={{ backgroundColor: s.color, borderColor: s.border }}
              >
                <Text className="text-lg">{s.emoji}</Text>
                <Text className="text-sm font-bold text-neutral-700">{s.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Resume CTA if enrolled */}
        {enrolledCount > 0 && (
          <Pressable
            onPress={() => router.push(href('/(tabs)/my-courses'))}
            className="mx-5 mt-6 rounded-2xl bg-brand-primary p-4 flex-row items-center justify-between"
            style={dimensionalShadows.brand.md}
          >
            <View>
              <Text className="text-base font-black text-white">Continue Learning</Text>
              <Text className="text-sm font-medium text-white/70 mt-0.5">
                {enrolledCount} {enrolledCount === 1 ? 'course' : 'courses'} in progress
              </Text>
            </View>
            <Text className="text-2xl">▶</Text>
          </Pressable>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
