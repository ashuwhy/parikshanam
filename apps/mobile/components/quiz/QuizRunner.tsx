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
    <View className="flex-1 bg-ui-bg">
      <View className="flex-row items-center justify-between p-4 border-b border-ui-border bg-white">
        <Pressable onPress={onExit} className="p-2 -ml-2">
          <Ionicons name="close" size={24} color="#737373" />
        </Pressable>
        <Text className="font-bold text-neutral-900">
          Question {currentIndex + 1} of {questions.length}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }} className="flex-1">
        <Text className="text-xl font-bold text-neutral-900 mb-6">
          {currentQ.question_text}
        </Text>

        <View className="gap-3">
          {currentQ.options.map((opt: string, idx: number) => {
            const isSelected = currentAnswer === idx;
            let borderColor = 'border-ui-border';
            let extraClass = 'active:border-ui-accent';
            const isCorrect = submitted && idx === currentQ.correct_option_index;
            const isWrong = submitted && isSelected && idx !== currentQ.correct_option_index;

            if (isSelected && !submitted) {
              borderColor = 'border-ui-accent';
              extraClass = 'bg-ui-accent/10';
            } else if (isCorrect) {
              borderColor = 'border-status-success';
              extraClass = 'bg-status-success/10';
            } else if (isWrong) {
              borderColor = 'border-status-error';
              extraClass = 'bg-status-error/10';
            }

            return (
              <Pressable
                key={idx}
                onPress={() => handleSelect(idx)}
                className={`bg-white rounded-2xl border-2 p-4 flex-row items-center ${borderColor} ${extraClass}`}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${isSelected ? borderColor : 'border-ui-border'}`}>
                  {isSelected && <View className={`w-3 h-3 rounded-full ${isCorrect ? 'bg-status-success' : isWrong ? 'bg-status-error' : 'bg-ui-accent'}`} />}
                </View>
                <Text className="flex-1 text-base font-medium text-neutral-900">{opt}</Text>
              </Pressable>
            );
          })}
        </View>

        {submitted && currentQ.explanation && (
          <View className="mt-6 p-4 bg-ui-accent/20 rounded-2xl border-2 border-ui-accent">
            <Text className="text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">Explanation</Text>
            <Text className="text-base font-medium text-neutral-800">{currentQ.explanation}</Text>
          </View>
        )}
      </ScrollView>

      <View className="p-4 border-t border-ui-border bg-white">
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
