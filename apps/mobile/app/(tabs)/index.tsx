import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, Brain, ChevronRight } from 'lucide-react-native';

import { CourseCard } from '@/components/course/CourseCard';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { useFeaturedCourse } from '@/hooks/useCourses';
import { useHasPurchased } from '@/hooks/usePurchases';
import { href } from '@/lib/href';
import { brand, iconColors } from '@/constants/Colors';

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
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-950" edges={['bottom']}>
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

        {/* Quick access */}
        <Text className="mt-10 mb-3 text-xs font-display-black uppercase tracking-wider text-neutral-500">
          Free tools
        </Text>
        <View className="gap-3">
          <Pressable
            onPress={() => router.push(href('/(tabs)/practice'))}
            className="flex-row items-center gap-4 rounded-2xl border-2 border-ui-border bg-white dark:bg-neutral-800 px-4 py-4"
          >
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: brand.primary + '18' }}
            >
              <Brain size={20} color={brand.primary} strokeWidth={2.25} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-display-extra text-neutral-900 dark:text-neutral-100">
                Practice Quizzes
              </Text>
              <Text className="text-xs font-sans-medium text-neutral-500 mt-0.5">
                YMRC & YSRC — free, results recorded
              </Text>
            </View>
            <ChevronRight size={18} color={iconColors.muted} strokeWidth={2} />
          </Pressable>

          <Pressable
            onPress={() => router.push(href('/ysc'))}
            className="flex-row items-center gap-4 rounded-2xl border-2 border-ui-border bg-white dark:bg-neutral-800 px-4 py-4"
          >
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: brand.primary + '18' }}
            >
              <Award size={20} color={brand.primary} strokeWidth={2.25} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-display-extra text-neutral-900 dark:text-neutral-100">
                YSC Certificate
              </Text>
              <Text className="text-xs font-sans-medium text-neutral-500 mt-0.5">
                Download your APS Kolkata certificate
              </Text>
            </View>
            <ChevronRight size={18} color={iconColors.muted} strokeWidth={2} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
