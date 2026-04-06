import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { CheckCircle } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { brand, iconColors } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import type { CompetitionId, ResearchQuestion } from '@/lib/research-quizzes';
import { mixIntroQuestions } from '@/lib/research-quizzes';

const LABELS = ['A', 'B', 'C', 'D'] as const;

type Props = {
  quizSlug: string;
  quizLabel: string;
  competition: CompetitionId;
  competitionAbbr: string;
  questions: ResearchQuestion[];
  hasAttempted: boolean;
  onBack: () => void;
};

export function ResearchQuizRunner({
  quizSlug,
  quizLabel,
  competition,
  competitionAbbr,
  questions: rawQuestions,
  hasAttempted,
  onBack,
}: Props) {
  const questions = useMemo(() => mixIntroQuestions(rawQuestions), [rawQuestions]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<'taking' | 'results'>(hasAttempted ? 'results' : 'taking');
  const savedRef = useRef(false);

  const current = questions[index]!;
  const isLast = index === questions.length - 1;
  const picked = answers[current.id];

  // Save results once when entering results phase
  useEffect(() => {
    if (phase !== 'results' || savedRef.current || hasAttempted) return;
    savedRef.current = true;

    let correct = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const scorePct = Math.round((correct / questions.length) * 100);

    const detailed = questions.map((q) => ({
      question_id: q.id,
      picked: answers[q.id],
      correct: q.correctIndex,
    }));

    supabase
      .from('research_quiz_results')
      .insert({
        competition,
        quiz_slug: quizSlug,
        score_pct: scorePct,
        answers,
        detailed_results: detailed,
      })
      .then(({ error }) => {
        if (error) console.warn('Failed to save research quiz result:', error.message);
      });
  }, [phase, competition, quizSlug, questions, answers, hasAttempted]);

  if (phase === 'results') {
    return (
      <ScrollView className="flex-1 bg-ui-bg dark:bg-neutral-950" contentContainerStyle={{ padding: 20, paddingBottom: 48 }}>
        <View className="mt-10 rounded-3xl border-2 border-neutral-700 bg-neutral-800 p-8 items-center">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: brand.primary + '18' }}
          >
            <CheckCircle size={40} color={brand.primary} strokeWidth={2} />
          </View>
          <Text className="text-2xl font-display-black text-neutral-900 dark:text-neutral-100 text-center mb-3">
            {hasAttempted ? 'Already completed!' : 'Thank You!'}
          </Text>
          <Text className="text-base font-sans-medium text-neutral-600 dark:text-neutral-400 text-center mb-2">
            Your responses for{' '}
            <Text className="font-bold text-brand-primary">{quizLabel}</Text> have been recorded.
          </Text>
          <View className="mt-4 px-5 py-4 rounded-2xl bg-brand-primary/8 border border-brand-primary/20 w-full">
            <Text className="text-sm font-display-extra text-brand-primary text-center">
              If you reach the merit list, we will email you.
            </Text>
          </View>
        </View>

        <Button title="Back to Practice Quizzes" variant="primary" className="mt-6" onPress={onBack} />
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 bg-ui-bg dark:bg-neutral-950">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-4">
        <BackButton variant="light" onPress={onBack} />
        
        <View className="flex-1 px-3">
          <Text className="text-[10px] font-display-black uppercase tracking-widest text-brand-primary mb-0.5" numberOfLines={1}>
            {competitionAbbr}
          </Text>
          <Text className="text-base font-display-extra text-neutral-900 dark:text-neutral-100" numberOfLines={1}>
            {quizLabel}
          </Text>
        </View>

        <View className="bg-white dark:bg-neutral-800 border border-ui-border dark:border-neutral-700 px-3 py-1.5 rounded-xl shadow-sm">
          <Text className="text-sm font-display-extra text-neutral-600 dark:text-neutral-300 tabular-nums">
            {index + 1} <Text className="text-neutral-400 dark:text-neutral-500 font-sans-medium">/ {questions.length}</Text>
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <Text className="text-xl font-display-black text-neutral-900 dark:text-neutral-100 mb-5 leading-snug">
          Question {index + 1}
        </Text>

        <View className="rounded-2xl border-2 border-neutral-700 bg-neutral-800 p-5 mb-6">
          <Text className="text-base font-sans-medium text-neutral-800 dark:text-neutral-200 leading-relaxed mb-5">
            {current.prompt}
          </Text>

          <View className="gap-2">
            {current.options.map((opt, i) => {
              const selected = picked === i;
              return (
                <Pressable
                  key={LABELS[i]}
                  onPress={() => setAnswers((prev) => ({ ...prev, [current.id]: i }))}
                  className={[
                    'rounded-xl border-2 px-4 py-3 flex-row items-center',
                    selected
                      ? 'border-brand-primary bg-brand-primary/8'
                      : 'border-neutral-600 bg-neutral-700',
                  ].join(' ')}
                >
                  <Text
                    className="font-display-black mr-2"
                    style={{ color: selected ? brand.primary : iconColors.muted }}
                  >
                    {LABELS[i]}.
                  </Text>
                  <Text className="flex-1 text-base font-sans-medium text-neutral-900 dark:text-neutral-100">
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="px-5 pb-8 pt-3 border-t border-neutral-800 bg-neutral-900">
        <Button
          title={isLast ? 'See results' : 'Next question'}
          variant="primary"
          disabled={picked === undefined}
          onPress={() => {
            if (isLast) {
              setPhase('results');
            } else {
              setIndex((i) => i + 1);
            }
          }}
        />
      </View>
    </View>
  );
}
