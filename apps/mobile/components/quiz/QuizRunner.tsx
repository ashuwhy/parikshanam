import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

interface QuizRunnerProps {
  quizId: string;
  onComplete: (score: number, passed: boolean) => void;
  onExit: () => void;
}

export function QuizRunner({ quizId, onComplete, onExit }: QuizRunnerProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [quizInfo, setQuizInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: qInfo } = await supabase.from('quizzes').select('*').eq('id', quizId).single();
      const { data: qs } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quizId).order('order_index');
      setQuizInfo(qInfo);
      if (qs) setQuestions(qs);
      setLoading(false);
    }
    load();
  }, [quizId]);

  if (loading) return <LoadingScreen />;
  if (!questions.length) return <Text className="p-4 text-center">No questions in this quiz.</Text>;

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const currentAnswer = answers[currentQ.id];

  const handleSelect = (index: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: index }));
  };

  const handeNext = () => {
    if (isLast) {
      // Calculate score
      let correctCount = 0;
      questions.forEach(q => {
        if (answers[q.id] === q.correct_option_index) correctCount++;
      });
      const score = Math.round((correctCount / questions.length) * 100);
      const passed = score >= (quizInfo?.passing_score || 50);
      setSubmitted(true);
      onComplete(score, passed);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
        <Pressable onPress={onExit} className="p-2 -ml-2">
          <Ionicons name="close" size={24} color="#737373" />
        </Pressable>
        <Text className="font-semibold text-neutral-900 dark:text-neutral-100">
          Question {currentIndex + 1} of {questions.length}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }} className="flex-1 px-4 pt-6">
        <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
          {currentQ.question_text}
        </Text>

        <View className="gap-3">
          {currentQ.options.map((opt: string, idx: number) => {
            const isSelected = currentAnswer === idx;
            let bgColor = 'bg-white dark:bg-neutral-900';
            let borderColor = 'border-neutral-200 dark:border-neutral-700';
            const isCorrect = submitted && idx === currentQ.correct_option_index;
            const isWrong = submitted && isSelected && idx !== currentQ.correct_option_index;

            if (isSelected && !submitted) {
              bgColor = 'bg-brand-primaryLight dark:bg-brand-primaryDark/40';
              borderColor = 'border-brand-primary dark:border-brand-primary-light';
            } else if (isCorrect) {
              bgColor = 'bg-green-50 dark:bg-green-950/40';
              borderColor = 'border-green-600 dark:border-green-400';
            } else if (isWrong) {
              bgColor = 'bg-red-50 dark:bg-red-950/40';
              borderColor = 'border-red-600 dark:border-red-400';
            }

            return (
              <Pressable
                key={idx}
                onPress={() => handleSelect(idx)}
                className={`p-4 rounded-xl border-2 ${bgColor} ${borderColor} flex-row items-center justify-between`}
              >
                <Text className={`flex-1 text-base ${isSelected ? 'text-brand-primaryDark dark:text-brand-primary-light font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}>
                  {opt}
                </Text>
                {submitted && isCorrect && <Ionicons name="checkmark-circle" size={24} color="#16a34a" />}
                {submitted && isWrong && <Ionicons name="close-circle" size={24} color="#dc2626" />}
              </Pressable>
            );
          })}
        </View>

        {submitted && currentQ.explanation && (
          <View className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900">
            <Text className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">Explanation</Text>
            <Text className="text-sm text-blue-700 dark:text-blue-300">{currentQ.explanation}</Text>
          </View>
        )}
      </ScrollView>

      <View className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <Button 
          title={submitted ? (isLast ? "Finish" : "Next Question") : (isLast ? "Submit Quiz" : "Next")} 
          disabled={!submitted && currentAnswer === undefined}
          onPress={() => {
            if (submitted && isLast) {
              onExit();
            } else if (submitted && !isLast) {
              setSubmitted(false);
              setCurrentIndex(prev => prev + 1);
            } else {
              handeNext();
            }
          }} 
        />
      </View>
    </View>
  );
}
