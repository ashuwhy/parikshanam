import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { CourseHero } from '@/components/course/CourseHero';
import { SyllabusView } from '@/components/course/SyllabusView';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { useCourseById, useSyllabus } from '@/hooks/useCourses';
import { useHasPurchased, useUserProgress } from '@/hooks/usePurchases';
import { href } from '@/lib/href';
import { queryClient } from '@/lib/queryClient';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { supabase } from '@/lib/supabase';

function formatRupeePaise(paise: number) {
  return `₹${(paise / 100).toFixed(0)}`;
}

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session, profile } = useAuth();
  const { course, loading, error } = useCourseById(id);
  const { purchased, loading: pLoading, refresh: refreshPurchase } = useHasPurchased(id);
  const { modules } = useSyllabus(id);
  const { progress } = useUserProgress(id);
  const [buying, setBuying] = useState(false);

  const keyId = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID ?? '';

  const onBuy = async () => {
    if (!session?.user || !course) {
      Toast.show({ type: 'error', text1: 'Sign in to purchase' });
      router.replace(href('/(auth)/welcome'));
      return;
    }
    if (!keyId) {
      Toast.show({ type: 'error', text1: 'Missing Razorpay key in app config' });
      return;
    }

    setBuying(true);
    const { data: fnData, error: fnError } = await supabase.functions.invoke<{
      order_id: string;
      amount: number;
      currency: string;
    }>('create-razorpay-order', {
      body: { course_id: course.id },
    });
    setBuying(false);

    if (fnError || !fnData?.order_id) {
      Toast.show({
        type: 'error',
        text1: fnError?.message ?? 'Could not start payment',
      });
      return;
    }

    try {
      const payment = await openRazorpayCheckout({
        orderId: fnData.order_id,
        keyId,
        amountPaise: fnData.amount,
        businessName: 'Parikshanam',
        description: course.title,
        prefillName: profile?.full_name ?? undefined,
        prefillContact: profile?.phone ?? session.user.phone ?? undefined,
        prefillEmail: session.user.email ?? undefined,
      });

      const { error: insError } = await supabase.from('purchases').insert({
        user_id: session.user.id,
        course_id: course.id,
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        razorpay_signature: payment.razorpay_signature,
        amount: course.price,
        status: 'completed',
      });

      if (insError) {
        Toast.show({ type: 'error', text1: insError.message });
        return;
      }

      Toast.show({ type: 'success', text1: 'Purchase successful' });
      await queryClient.invalidateQueries({ queryKey: ['purchases', session.user.id] });
      await refreshPurchase();
      
      // Auto redirect to first lesson after purchase if available
      if (modules.length > 0 && modules[0].lessons.length > 0) {
         router.push(href(`/course/${id}/lesson/${modules[0].lessons[0].id}`));
      }
    } catch (e: unknown) {
      const err = e as { description?: string; code?: string };
      Toast.show({
        type: 'error',
        text1: err?.description ?? err?.code ?? 'Payment failed',
      });
    }
  };

  if (loading || pLoading) {
    return <LoadingScreen />;
  }

  if (error || !course) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6 dark:bg-neutral-950">
        <Text className="text-center text-neutral-600">{error?.message ?? 'Course not found'}</Text>
        <Button title="Go back" className="mt-6" variant="outline" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-neutral-950">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <CourseHero course={course} />
        <View className="px-4 pt-4">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{course.title}</Text>
          {course.subtitle ? (
            <Text className="mt-2 text-base text-neutral-600 dark:text-neutral-400">{course.subtitle}</Text>
          ) : null}

          <View className="mt-4 flex-row items-baseline gap-3">
            <Text className="text-2xl font-bold text-brand-primary dark:text-brand-primary-light">
              {formatRupeePaise(course.price)}
            </Text>
            {course.mrp != null && course.mrp > course.price ? (
              <Text className="text-lg text-neutral-400 line-through">{formatRupeePaise(course.mrp)}</Text>
            ) : null}
          </View>

          {course.description ? (
            <Text className="mt-6 leading-6 text-neutral-700 dark:text-neutral-300">{course.description}</Text>
          ) : null}

          <View className="mt-4">
            <SyllabusView 
              courseId={course.id} 
              hasPurchased={purchased}
              onLessonPress={(lessonId) => router.push(href(`/course/${course.id}/lesson/${lessonId}`))}
              onQuizPress={(quizId) => router.push(href(`/course/${course.id}/quiz/${quizId}`))}
            />
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} className="absolute bottom-0 left-0 right-0 border-t border-neutral-100 bg-white px-4 pt-3 dark:border-neutral-800 dark:bg-neutral-950">
        <Button
          title={purchased ? 'Continue Learning' : `Buy Course — ${formatRupeePaise(course.price)}`}
          loading={!purchased && buying}
          onPress={() => {
            if (purchased) {
              // Find first uncompleted lesson or quiz
              let nextItem: { type: 'lesson' | 'quiz', id: string } | null = null;
              
              for (const mod of modules) {
                for (const lesson of mod.lessons) {
                  const isDone = progress.some(p => p.lesson_id === lesson.id);
                  if (!isDone) {
                    nextItem = { type: 'lesson', id: lesson.id };
                    break;
                  }
                }
                if (nextItem) break;
                
                for (const quiz of mod.quizzes) {
                  const isDone = progress.some(p => p.quiz_id === quiz.id);
                  if (!isDone) {
                    nextItem = { type: 'quiz', id: quiz.id };
                    break;
                  }
                }
                if (nextItem) break;
              }

              if (nextItem) {
                router.push(href(`/course/${course.id}/${nextItem.type}/${nextItem.id}`));
              } else if (modules.length > 0 && modules[0].lessons.length > 0) {
                 // All complete? Just go to the first one again or show finished
                 router.push(href(`/course/${course.id}/lesson/${modules[0].lessons[0].id}`));
              } else {
                 Toast.show({ type: 'info', text1: 'No content available yet.' });
              }
            } else {
              void onBuy();
            }
          }}
        />
      </SafeAreaView>
    </View>
  );
}
