import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BookOpen, ChevronDown, ChevronUp, HelpCircle, Lock, Play } from 'lucide-react-native';
import { useSyllabus } from '@/hooks/useCourses';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { iconColors } from '@/constants/Colors';

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

  if (error) {
    return (
      <View className="rounded-2xl bg-red-50 dark:bg-red-950 px-4 py-3">
        <Text className="text-sm font-sans-medium text-red-600 dark:text-red-400 text-center">
          Failed to load syllabus.
        </Text>
      </View>
    );
  }

  if (modules.length === 0) {
    return (
      <View className="items-center py-10 px-4">
        <BookOpen size={40} color={iconColors.empty} strokeWidth={1.5} />
        <Text className="mt-3 text-base font-display-black text-neutral-700 dark:text-neutral-300">
          Syllabus coming soon
        </Text>
        <Text className="mt-1 text-sm font-sans-medium text-neutral-400 text-center">
          Content is being prepared for this course
        </Text>
      </View>
    );
  }

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-1.5 mb-1">
        <BookOpen size={14} color={iconColors.structural} strokeWidth={2.5} />
        <Text className="text-base font-display uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
          Syllabus
        </Text>
      </View>

      {modules.map((module, mIndex) => {
        const isExpanded = expandedModules[module.id] ?? (mIndex === 0);

        return (
          <View key={module.id} className="overflow-hidden rounded-2xl border border-ui-border dark:border-neutral-700 bg-white dark:bg-neutral-800">
            <Pressable
              className="flex-row items-center justify-between px-4 py-3.5 bg-white dark:bg-neutral-800"
              onPress={() => toggleModule(module.id)}
            >
              <View className="flex-1 mr-3">
                <Text className="text-[10px] font-display uppercase tracking-widest text-neutral-300 dark:text-neutral-600">
                  Module {mIndex + 1}
                </Text>
                <Text className="text-sm font-display-extra text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {module.title}
                </Text>
              </View>
              {isExpanded
                ? <ChevronUp size={16} color={iconColors.muted} strokeWidth={2.5} />
                : <ChevronDown size={16} color={iconColors.muted} strokeWidth={2.5} />
              }
            </Pressable>

            {isExpanded && (
              <View className="border-t border-ui-border dark:border-neutral-700 px-2 py-1.5">
                {module.lessons.map((lesson: any, lIndex: number) => {
                  const canAccess = hasPurchased || lesson.is_preview;
                  return (
                    <Pressable
                      key={lesson.id}
                      className="flex-row items-center px-3 py-2.5 rounded-xl active:bg-ui-bg dark:active:bg-neutral-700"
                      onPress={() => canAccess ? onLessonPress(lesson.id) : undefined}
                    >
                      <View className="w-7 h-7 rounded-full bg-brand-primary/15 items-center justify-center mr-3">
                        <Play size={12} color={iconColors.primary} strokeWidth={2.5} />
                      </View>
                      <View className="flex-1">
                        <Text className={`text-sm font-sans-medium ${canAccess ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400'}`}>
                          {lIndex + 1}. {lesson.title}
                        </Text>
                        {lesson.duration_minutes > 0 && (
                          <Text className="text-xs font-sans-medium text-neutral-400 mt-0.5">
                            {lesson.duration_minutes} min
                          </Text>
                        )}
                      </View>
                      {!canAccess
                        ? <Lock size={14} color={iconColors.empty} strokeWidth={2} />
                        : !hasPurchased && lesson.is_preview
                          ? (
                            <View className="rounded-full bg-green-100 dark:bg-green-900/40 px-2 py-0.5">
                              <Text className="text-[10px] font-display uppercase tracking-wider text-green-700 dark:text-green-300">
                                Free
                              </Text>
                            </View>
                          )
                          : null
                      }
                    </Pressable>
                  );
                })}

                {module.quizzes.map((quiz: any) => (
                  <Pressable
                    key={quiz.id}
                    className="flex-row items-center px-3 py-2.5 rounded-xl active:bg-ui-bg dark:active:bg-neutral-700"
                    onPress={() => hasPurchased ? onQuizPress(quiz.id) : undefined}
                  >
                    <View className="w-7 h-7 rounded-full bg-status-warning/20 items-center justify-center mr-3">
                      <HelpCircle size={14} color={iconColors.onWarning} strokeWidth={2.5} />
                    </View>
                    <View className="flex-1">
                      <Text className={`text-sm font-sans-medium ${hasPurchased ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400'}`}>
                        Quiz: {quiz.title}
                      </Text>
                    </View>
                    {!hasPurchased && <Lock size={14} color={iconColors.empty} strokeWidth={2} />}
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
