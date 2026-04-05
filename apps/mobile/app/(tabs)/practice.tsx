import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Brain, ChevronRight, FlaskConical } from 'lucide-react-native';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { brand, iconColors } from '@/constants/Colors';
import { YMRC_QUIZZES, YSRC_QUIZZES, researchQuizData } from '@/lib/research-quizzes';
import type { ResearchQuizPaper } from '@/lib/research-quizzes';
import { href } from '@/lib/href';

function QuizItem({
  quiz,
  isCompleted,
  onPress,
}: {
  quiz: ResearchQuizPaper;
  isCompleted: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        'flex-row items-center justify-between gap-4 rounded-2xl border-2 p-4 mb-2',
        isCompleted
          ? 'border-status-success/30 bg-status-success/5'
          : 'border-ui-border bg-white dark:bg-neutral-800',
      ].join(' ')}
    >
      <View className="flex-1 min-w-0">
        <View className="flex-row items-center gap-2 flex-wrap">
          <Text className="text-base font-display-extra text-neutral-900 dark:text-neutral-100">
            {quiz.label}
          </Text>
          {isCompleted && (
            <View className="rounded-full bg-status-success/15 px-2 py-0.5">
              <Text className="text-[10px] font-display-black text-status-success uppercase tracking-wider">
                Done
              </Text>
            </View>
          )}
        </View>
        <Text className="text-xs font-sans-medium text-neutral-500 mt-0.5" numberOfLines={1}>
          {quiz.subtitle}
        </Text>
      </View>
      <ChevronRight
        size={20}
        color={isCompleted ? iconColors.success : iconColors.muted}
        strokeWidth={2}
      />
    </Pressable>
  );
}

function QuizSection({
  title,
  subjectLine,
  fullName,
  icon,
  iconBg,
  quizzes,
  completedSlugs,
  competition,
}: {
  title: string;
  subjectLine: string;
  fullName: string;
  icon: React.ReactNode;
  iconBg: string;
  quizzes: ResearchQuizPaper[];
  completedSlugs: string[];
  competition: 'ymrc' | 'ysrc';
}) {
  const router = useRouter();

  if (!quizzes.length) return null;

  return (
    <View className="mb-8">
      <View className="flex-row items-start gap-3 mb-4">
        <View className="w-11 h-11 rounded-xl items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
          {icon}
        </View>
        <View className="flex-1 pt-0.5">
          <Text className="text-lg font-display-black text-neutral-900 dark:text-neutral-100">
            {title}
          </Text>
          <Text className="text-xs font-sans-medium text-neutral-500">
            {subjectLine} · {fullName}
          </Text>
        </View>
      </View>

      {quizzes.map((q) => (
        <QuizItem
          key={q.slug}
          quiz={q}
          isCompleted={completedSlugs.includes(q.slug)}
          onPress={() => router.push(href(`/research-quiz/${competition}/${q.slug}`))}
        />
      ))}
    </View>
  );
}

export default function PracticeScreen() {
  const { profile } = useAuth();
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const userClass = profile?.class_level_id;

  const filterByClass = (quizzes: ResearchQuizPaper[]) => {
    if (!userClass) return quizzes;
    return quizzes.filter((q) => q.slug === `class-${userClass}`);
  };

  const filteredYmrc = filterByClass(YMRC_QUIZZES);
  const filteredYsrc = filterByClass(YSRC_QUIZZES);

  const fetchCompleted = useCallback(async () => {
    const { data } = await supabase
      .from('research_quiz_results')
      .select('quiz_slug');
    setCompletedSlugs((data ?? []).map((r: { quiz_slug: string }) => r.quiz_slug));
  }, []);

  useEffect(() => {
    void fetchCompleted();
  }, [fetchCompleted]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCompleted();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-950" edges={['top', 'bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />}
      >
        <Text className="text-2xl font-display-black tracking-tight text-neutral-900 dark:text-neutral-100 mb-1">
          Practice Quizzes
        </Text>
        <Text className="text-sm font-sans-medium text-neutral-500 mb-8">
          Free quizzes for your grade. Results are recorded for merit selection.
        </Text>

        <QuizSection
          competition="ymrc"
          title={researchQuizData.ymrc.abbr}
          subjectLine={researchQuizData.ymrc.subject}
          fullName={researchQuizData.ymrc.name}
          icon={<Brain size={22} color={brand.primary} strokeWidth={2.25} />}
          iconBg={brand.primary + '18'}
          quizzes={filteredYmrc}
          completedSlugs={completedSlugs}
        />

        <QuizSection
          competition="ysrc"
          title={researchQuizData.ysrc.abbr}
          subjectLine={researchQuizData.ysrc.subject}
          fullName={researchQuizData.ysrc.name}
          icon={<FlaskConical size={22} color={brand.science} strokeWidth={2.25} />}
          iconBg={brand.science + '18'}
          quizzes={filteredYsrc}
          completedSlugs={completedSlugs}
        />

        {filteredYmrc.length === 0 && filteredYsrc.length === 0 && (
          <View className="mt-16 items-center px-4">
            <Brain size={56} color={iconColors.empty} strokeWidth={1.5} />
            <Text className="mt-4 text-xl font-display-black text-neutral-900 dark:text-neutral-100">
              No quizzes for your class
            </Text>
            <Text className="mt-2 text-center text-sm font-sans-medium text-neutral-500">
              Quizzes are available for specific class levels. Check back soon.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
