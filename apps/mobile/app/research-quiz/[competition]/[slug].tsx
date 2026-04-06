import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { ResearchQuizRunner } from '@/components/quiz/ResearchQuizRunner';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { supabase } from '@/lib/supabase';
import { getQuizByCompetition, researchQuizData } from '@/lib/research-quizzes';
import type { CompetitionId } from '@/lib/research-quizzes';
import { iconColors } from '@/constants/Colors';

export default function ResearchQuizPlayerScreen() {
  const router = useRouter();
  const { competition, slug } = useLocalSearchParams<{ competition: string; slug: string }>();
  const [hasAttempted, setHasAttempted] = useState(false);
  const [checking, setChecking] = useState(true);

  const isValidCompetition = competition === 'ymrc' || competition === 'ysrc';
  const quiz = isValidCompetition
    ? getQuizByCompetition(competition as CompetitionId, slug)
    : undefined;

  useEffect(() => {
    if (!quiz || !isValidCompetition) {
      setChecking(false);
      return;
    }
    supabase
      .from('research_quiz_results')
      .select('id')
      .eq('competition', competition)
      .eq('quiz_slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        setHasAttempted(!!data);
        setChecking(false);
      });
  }, [competition, slug, quiz, isValidCompetition]);

  if (checking) return <LoadingScreen />;

  if (!quiz || !isValidCompetition) {
    return (
      <SafeAreaView className="flex-1 bg-ui-bg items-center justify-center px-6">
        <Text className="text-base font-sans-medium text-neutral-500 text-center">
          Quiz not found.
        </Text>
      </SafeAreaView>
    );
  }

  const competitionAbbr = researchQuizData[competition as CompetitionId].abbr;

  return (
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900" edges={['top']}>

      <ResearchQuizRunner
        quizSlug={slug}
        quizLabel={quiz.label}
        competition={competition as CompetitionId}
        competitionAbbr={competitionAbbr}
        questions={quiz.questions}
        hasAttempted={hasAttempted}
        onBack={() => router.back()}
      />
    </SafeAreaView>
  );
}
