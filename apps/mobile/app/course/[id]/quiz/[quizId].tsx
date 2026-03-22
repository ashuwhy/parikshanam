import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizRunner } from '@/components/quiz/QuizRunner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';

export default function QuizScreen() {
  const { id: courseId, quizId } = useLocalSearchParams<{ id: string, quizId: string }>();
  const router = useRouter();
  const { session } = useAuth();

  const handleComplete = async (score: number, passed: boolean) => {
    if (!session?.user || !quizId) return;

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: session.user.id,
        quiz_id: quizId,
        score,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,quiz_id' });

    if (error) {
      Toast.show({ type: 'error', text1: 'Failed to save quiz result' });
    } else {
      Toast.show({ 
        type: passed ? 'success' : 'info', 
        text1: passed ? 'Quiz Passed!' : 'Quiz Finished',
        text2: `Your score: ${score}%`
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <QuizRunner 
        quizId={quizId!} 
        onComplete={handleComplete} 
        onExit={() => router.back()} 
      />
    </SafeAreaView>
  );
}
