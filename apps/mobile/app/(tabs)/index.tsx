import { useRouter } from 'expo-router';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BookOpen,
  Brain,
  Calculator,
  ChevronRight,
  FlaskConical,
  Globe,
  Laptop,
  Trophy,
  TrendingUp,
  Video,
} from 'lucide-react-native';

import { CourseCard } from '@/components/course/CourseCard';
import { FeaturedCourseCard } from '@/components/course/FeaturedCourseCard';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { SubjectCard } from '@/components/ui/SubjectCard';
import { useAuth } from '@/hooks/useAuth';
import { useFeaturedCourse } from '@/hooks/useCourses';
import { useHasPurchased } from '@/hooks/usePurchases';
import { useCoursesStore } from '@/lib/stores/useCoursesStore';
import { href } from '@/lib/href';
import { brand } from '@/constants/Colors';

// ── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { highlight: '40%', lines: ['IITIANS / AIIMS', 'are dropper'] },
  { highlight: '< 600', lines: ['ranker give govt.', 'olympiad!'] },
  { highlight: 'ISRO / TIFR', lines: ['camp by', 'Govt. of India'] },
] as const;

const SUBJECTS = [
  { Icon: Calculator, label: 'Mathematics', olympiad: 'IMO · NSO · NIMO', color: '#3B82F6', bg: '#EFF6FF' },
  { Icon: FlaskConical, label: 'Science', olympiad: 'NSO · NSTSE', color: '#22C55E', bg: '#F0FDF4' },
  { Icon: Globe, label: 'Geography', olympiad: 'iGeo · NGO', color: '#F59E0B', bg: '#FFFBEB' },
  { Icon: Laptop, label: 'Computing', olympiad: 'UCO · IEO', color: '#8B5CF6', bg: '#F5F3FF' },
] as const;

const FEATURES = [
  { Icon: Video, iconBg: '#FFF7ED', iconColor: '#E8720C', title: 'Expert Video Lessons', description: 'Structured video content from subject experts — watch, rewind, revisit.', tag: 'Core Learning', tagColor: '#E8720C' },
  { Icon: Brain, iconBg: '#F0FDF4', iconColor: '#22C55E', title: 'Smart Quizzes', description: 'Instant feedback, explanations, and detailed score breakdowns.', tag: 'Practice & Test', tagColor: '#22C55E' },
  { Icon: TrendingUp, iconBg: '#EFF6FF', iconColor: '#3B82F6', title: 'Progress Tracking', description: 'Lessons complete, quiz scores, and streaks in one beautiful dashboard.', tag: 'Stay on Track', tagColor: '#3B82F6' },
  { Icon: Trophy, iconBg: '#FFFBEB', iconColor: '#F59E0B', title: 'Olympiad Ready', description: 'Courses built for national Olympiads — syllabus-aligned content.', tag: 'Compete & Win', tagColor: '#F59E0B' },
] as const;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Screen ──────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const { course: featuredCourse, loading, error } = useFeaturedCourse();
  const { purchased } = useHasPurchased(featuredCourse?.id);
  const allCourses = useCoursesStore((s) => s.allCourses);
  const setFilters = useCoursesStore((s) => s.actions.setFilters);

  if (loading) return <LoadingScreen />;

  const name = profile?.full_name?.trim() || 'there';
  const otherCourses = allCourses.filter((c) => c.id !== featuredCourse?.id);

  return (
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900" edges={['top']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* ── 1. Hero Banner ──────────────────────────────────────── */}
        <View>
          <View
            className="mx-4 mt-2 rounded-3xl overflow-hidden px-5 py-6"
            style={{
              backgroundColor: brand.navy,
            }}
          >
            <Text className="text-sm font-sans-medium text-white/70 mb-1">
              {greeting()}, {name} 👋
            </Text>
            <Text
              className="text-2xl leading-tight mb-1"
              style={{ fontFamily: 'Nunito_900Black', color: '#FFFFFF' }}
            >
              Dropper or Topper.
            </Text>
            <Text
              className="text-xs uppercase tracking-widest mb-0.5"
              style={{ fontFamily: 'Nunito_800ExtraBold', color: brand.primary }}
            >
              To be decided by
            </Text>
            <Text
              className="text-2xl leading-tight"
              style={{ fontFamily: 'Nunito_900Black', color: brand.primary }}
            >
              You today!
            </Text>
            <Text
              className="mt-3 text-xs leading-relaxed text-white/60"
              style={{ fontFamily: 'Nunito_800ExtraBold' }}
            >
              Fortune favours the{' '}
              <Text style={{ color: brand.primary }}>EARLY</Text> prepared
            </Text>
          </View>
        </View>

        {/* ── 2. Stat Cards ───────────────────────────────────────── */}
        <View className="px-4 mt-5">
          <View className="flex-row gap-2.5">
            {STATS.map((s) => (
              <StatCard key={s.highlight} highlight={s.highlight} lines={[...s.lines]} />
            ))}
          </View>
        </View>

        {/* ── 3. Featured Course ──────────────────────────────────── */}
        {error ? (
          <Text className="mt-4 px-4 text-error">{error.message}</Text>
        ) : null}

        {featuredCourse ? (
          <View className="px-4 mt-4">
            <SectionHeader title="Featured" />
            <FeaturedCourseCard course={featuredCourse} purchased={purchased} />
          </View>
        ) : null}

        {/* ── 4. Course Showcase (horizontal) ─────────────────────── */}
        {otherCourses.length > 0 ? (
          <View className="mt-4">
            <View className="px-4">
              <SectionHeader
                title="Courses"
                actionLabel="See all"
                onAction={() => router.push(href('/(tabs)/search'))}
              />
            </View>
            <FlatList
              data={otherCourses}
              keyExtractor={(c) => c.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              renderItem={({ item }) => (
                <View style={{ width: 280 }}>
                  <CourseCard course={item} onPress={() => router.push(href(`/course/${item.id}`))} />
                </View>
              )}
            />
          </View>
        ) : null}

        {/* ── 5. Subjects ─────────────────────────────────────────── */}
        <View className="px-4 mt-3">
          <SectionHeader title="Subjects" />
          <View className="flex-row gap-3 mb-3">
            {SUBJECTS.slice(0, 2).map((s) => (
              <SubjectCard
                key={s.label}
                {...s}
                onPress={() => {
                  router.push(href('/(tabs)/search'));
                }}
              />
            ))}
          </View>
          <View className="flex-row gap-3">
            {SUBJECTS.slice(2, 4).map((s) => (
              <SubjectCard
                key={s.label}
                {...s}
                onPress={() => {
                  router.push(href('/(tabs)/search'));
                }}
              />
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
