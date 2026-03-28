import { useRouter } from 'expo-router';
import {
  BookOpen,
  Calculator,
  ChevronRight,
  Flame,
  FlaskConical,
  Globe,
  Laptop,
  Sparkles,
} from 'lucide-react-native';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter } from '@/components/ui/AppFooter';
import { Avatar } from '@/components/ui/Avatar';
import { FeaturedCourseCard } from '@/components/course/FeaturedCourseCard';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/hooks/useAuth';
import { useFeaturedCourse } from '@/hooks/useCourses';
import { useHasPurchased, useMyPurchases, useUserProgress } from '@/hooks/usePurchases';
import { href } from '@/lib/href';
import { iconColors } from '@/constants/Colors';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const SUBJECT_TILES = [
  { Icon: Calculator, label: 'Math', color: '#EFF6FF', border: '#BFDBFE', darkColor: 'rgba(59,130,246,0.12)', darkBorder: 'rgba(59,130,246,0.25)', iconColor: '#3B82F6' },
  { Icon: FlaskConical, label: 'Science', color: '#F0FDF4', border: '#BBF7D0', darkColor: 'rgba(34,197,94,0.12)', darkBorder: 'rgba(34,197,94,0.25)', iconColor: '#22C55E' },
  { Icon: Globe, label: 'Geography', color: '#FFFBEB', border: '#FDE68A', darkColor: 'rgba(245,158,11,0.12)', darkBorder: 'rgba(245,158,11,0.25)', iconColor: '#F59E0B' },
  { Icon: Laptop, label: 'Computing', color: '#F5F3FF', border: '#DDD6FE', darkColor: 'rgba(139,92,246,0.12)', darkBorder: 'rgba(139,92,246,0.25)', iconColor: '#8B5CF6' },
];

export default function HomeScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
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
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900" edges={['top', 'bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Inline header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
          <View>
            <Text className="text-2xl font-display-black tracking-tight text-neutral-900 dark:text-neutral-50">
              {greeting()}, {name}
            </Text>
            <Text className="mt-0.5 text-sm font-sans-medium text-neutral-500 dark:text-neutral-400">
              Ready to ace your Olympiad?
            </Text>
          </View>
          <Avatar size="md" />
        </View>

        {/* Stats row */}
        {(enrolledCount > 0 || totalLessons > 0) && (
          <View className="mx-5 mb-6 flex-row gap-3">
            <View className="flex-1 items-center rounded-2xl bg-white dark:bg-neutral-800 py-4 border border-ui-border dark:border-neutral-700">
              <Text className="text-2xl font-display-black text-brand-primary">{enrolledCount}</Text>
              <Text className="text-xs font-display text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-wider">
                {enrolledCount === 1 ? 'Course' : 'Courses'}
              </Text>
            </View>
            <View className="flex-1 items-center rounded-2xl bg-white dark:bg-neutral-800 py-4 border border-ui-border dark:border-neutral-700">
              <Text className="text-2xl font-display-black text-brand-primary">{totalLessons}</Text>
              <Text className="text-xs font-display text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-wider">
                Lessons Done
              </Text>
            </View>
            <View className="flex-1 items-center rounded-2xl bg-brand-primary py-4">
              <Flame size={28} color={iconColors.onBrand} strokeWidth={2} />
              <Text className="text-xs font-display text-white/80 mt-1 uppercase tracking-wider">Keep it up</Text>
            </View>
          </View>
        )}

        {/* Featured Course / Empty State */}
        {error ? (
          <View className="mx-5 rounded-2xl bg-red-50 px-4 py-3">
            <Text className="text-sm font-sans-bold text-red-600">{error.message}</Text>
          </View>
        ) : course ? (
          <View className="px-5">
            <View className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <Sparkles size={14} color={isDark ? iconColors.primary : iconColors.primary} strokeWidth={2.5} />
                <Text className="text-base font-display uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  Featured
                </Text>
              </View>
              <Pressable onPress={() => router.push(href('/(tabs)/search'))}>
                <Text className="text-sm font-sans-bold text-brand-primary">See all →</Text>
              </Pressable>
            </View>
            <FeaturedCourseCard
              course={course}
              purchased={purchased}
            />
          </View>
        ) : (
          <Pressable
            onPress={() => router.push(href('/(tabs)/search'))}
            className="mx-5 rounded-3xl bg-white dark:bg-neutral-800 border border-ui-border dark:border-neutral-700 overflow-hidden"
          >
            {/* Top accent bar */}
            <View className="h-1 bg-brand-primary" />
            <View className="px-5 py-6 items-center">
              <View className="w-16 h-16 rounded-2xl bg-brand-primary/10 items-center justify-center mb-4">
                <Sparkles size={28} color={iconColors.primary} strokeWidth={2} />
              </View>
              <Text className="text-lg font-display-black text-neutral-900 dark:text-neutral-50 text-center">
                Courses coming soon
              </Text>
              <Text className="mt-1.5 text-sm font-sans-medium text-neutral-500 dark:text-neutral-400 text-center leading-relaxed">
                We're adding content for your class.{'\n'}Explore all courses in the meantime.
              </Text>
              <View className="mt-5 flex-row items-center gap-1.5 bg-brand-primary/10 rounded-full px-4 py-2">
                <Text className="text-sm font-sans-bold text-brand-primary">Browse all courses</Text>
                <ChevronRight size={14} color={iconColors.primary} strokeWidth={2.5} />
              </View>
            </View>
          </Pressable>
        )}

        {/* Browse by subject */}
        <View className="mt-6 px-5">
          <View className="mb-3 flex-row items-center gap-1.5">
            <BookOpen size={14} color={isDark ? iconColors.muted : iconColors.structural} strokeWidth={2.5} />
            <Text className="text-base font-display uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Browse Topics
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingRight: 20 }}
            className="mt-0"
          >
            {SUBJECT_TILES.map(({ Icon, label, color, border, darkColor, darkBorder, iconColor }) => (
              <Pressable
                key={label}
                onPress={() => router.push(href('/(tabs)/search'))}
                className="flex-row items-center gap-1.5 rounded-2xl border px-3 py-2"
                style={{ backgroundColor: isDark ? darkColor : color, borderColor: isDark ? darkBorder : border }}
              >
                <Icon size={16} color={iconColor} strokeWidth={2.2} />
                <Text className="text-xs font-sans-bold text-neutral-700 dark:text-neutral-200">{label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Resume CTA */}
        {enrolledCount > 0 && (
          <Pressable
            onPress={() => router.push(href('/(tabs)/my-courses'))}
            className="mx-5 mt-6 rounded-2xl bg-brand-primary p-4 flex-row items-center justify-between"
          >
            <View>
              <Text className="text-base font-display-black text-white">Continue Learning</Text>
              <Text className="text-sm font-sans-medium text-white/70 mt-0.5">
                {enrolledCount} {enrolledCount === 1 ? 'course' : 'courses'} in progress
              </Text>
            </View>
            <ChevronRight size={24} color={iconColors.onBrand} strokeWidth={2.5} />
          </Pressable>
        )}

      </ScrollView>
      {/* <AppFooter /> */}
    </SafeAreaView>
  );
}
