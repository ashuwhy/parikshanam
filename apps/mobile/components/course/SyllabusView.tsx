import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSyllabus } from '@/hooks/useCourses';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

interface SyllabusViewProps {
  courseId: string;
  hasPurchased: boolean;
  onLessonPress: (lessonId: string) => void;
  onQuizPress: (quizId: string) => void;
}

export function SyllabusView({ courseId, hasPurchased, onLessonPress, onQuizPress }: SyllabusViewProps) {
  const { modules, loading, error } = useSyllabus(courseId);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  if (loading) return <View className="py-8"><LoadingScreen /></View>;
  if (error) return <Text className="text-red-500 py-4 text-center">Failed to load syllabus.</Text>;
  if (modules.length === 0) return <Text className="py-6 text-center text-neutral-500">Syllabus coming soon.</Text>;

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View className="mt-4 gap-3">
      <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Course Syllabus</Text>
      
      {modules.map((module, mIndex) => {
        const isExpanded = expandedModules[module.id] ?? (mIndex === 0); // Open first module by default
        
        return (
          <View key={module.id} className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <Pressable 
              className="flex-row items-center justify-between p-4 bg-ui-bg dark:bg-neutral-800/50"
              onPress={() => toggleModule(module.id)}
            >
              <View className="flex-1 mr-4">
                <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Module {mIndex + 1}</Text>
                <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">{module.title}</Text>
              </View>
              <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#737373" />
            </Pressable>

            {isExpanded && (
              <View className="p-2">
                {module.lessons.map((lesson: any, lIndex: number) => {
                  const canAccess = hasPurchased || lesson.is_preview;
                  return (
                    <Pressable
                      key={lesson.id}
                      className="flex-row items-center px-3 py-3 rounded-lg active:bg-neutral-100 dark:active:bg-neutral-800"
                      onPress={() => canAccess ? onLessonPress(lesson.id) : null}
                    >
                      <View className="w-8 h-8 rounded-full bg-brand-primaryLight dark:bg-brand-primaryDark/50 items-center justify-center mr-3">
                        <Ionicons name="play" size={14} color="#4F46E5" className="ml-0.5" />
                      </View>
                      <View className="flex-1">
                        <Text className={`text-sm ${canAccess ? 'text-neutral-900 dark:text-neutral-100 font-medium' : 'text-neutral-500 dark:text-neutral-400'}`}>
                          {lIndex + 1}. {lesson.title}
                        </Text>
                        {lesson.duration_minutes > 0 && (
                          <Text className="text-xs text-neutral-500 mt-0.5">{lesson.duration_minutes} mins</Text>
                        )}
                      </View>
                      {!canAccess && (
                        <Ionicons name="lock-closed" size={16} color="#a3a3a3" />
                      )}
                      {canAccess && !hasPurchased && lesson.is_preview && (
                        <View className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40">
                          <Text className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase">Preview</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}

                {module.quizzes.map((quiz: any) => (
                  <Pressable
                    key={quiz.id}
                    className="flex-row items-center px-3 py-3 rounded-lg active:bg-neutral-100 dark:active:bg-neutral-800"
                    onPress={() => hasPurchased ? onQuizPress(quiz.id) : null}
                  >
                    <View className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/50 items-center justify-center mr-3">
                      <Ionicons name="help" size={18} color="#f97316" />
                    </View>
                    <View className="flex-1">
                      <Text className={`text-sm ${hasPurchased ? 'text-neutral-900 dark:text-neutral-100 font-medium' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        Quiz: {quiz.title}
                      </Text>
                    </View>
                    {!hasPurchased && (
                      <Ionicons name="lock-closed" size={16} color="#a3a3a3" />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
