import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { VideoPlayer } from '@/components/course/VideoPlayer';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useLessonById } from '@/hooks/useCourses';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';

export default function LessonScreen() {
  const { id: courseId, lessonId } = useLocalSearchParams<{ id: string, lessonId: string }>();
  const router = useRouter();
  const { session } = useAuth();
  const { lesson, loading, error } = useLessonById(lessonId);

  const onMarkComplete = async () => {
    if (!session?.user || !lessonId) return;
    
    const { error: pgError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: session.user.id,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' });

    if (pgError) {
      Toast.show({ type: 'error', text1: 'Failed to save progress' });
    } else {
      Toast.show({ type: 'success', text1: 'Lesson completed!' });
      router.back();
    }
  };

  if (loading) return <LoadingScreen />;
  if (error || !lesson) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-neutral-500">Lesson not found</Text>
        <Button title="Go Back" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-ui-bg" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} color="#737373" />
        </Pressable>
        <Text className="flex-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100 ml-2" numberOfLines={1}>
          {lesson.title}
        </Text>
      </View>

      <ScrollView className="flex-1">
        {lesson.video_url ? (
          <VideoPlayer url={lesson.video_url} />
        ) : (
          <View className="aspect-video bg-neutral-100 dark:bg-neutral-900 items-center justify-center">
            <Ionicons name="videocam-off" size={48} color="#a3a3a3" />
            <Text className="text-neutral-500 mt-2">No video for this lesson</Text>
          </View>
        )}

        <View className="p-6">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {lesson.title}
          </Text>
          
          {lesson.content_text ? (
            <Text className="mt-4 text-base leading-6 text-neutral-700 dark:text-neutral-300">
              {lesson.content_text}
            </Text>
          ) : null}

          <Button 
            title="Mark as Completed" 
            className="mt-10" 
            onPress={() => void onMarkComplete()} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
