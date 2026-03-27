import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, CheckCircle, Clock, Star } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { CourseBadge } from '@/components/course/CourseBadge';
import { CourseHero } from '@/components/course/CourseHero';
import { SyllabusView } from '@/components/course/SyllabusView';
import { VideoPlayer } from '@/components/course/VideoPlayer';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { brand, iconColors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useCourseById, useSyllabus } from '@/hooks/useCourses';
import { useHasPurchased, useUserProgress } from '@/hooks/usePurchases';
import { useStorageUrl } from '@/hooks/useStorageUrl';
import { href } from '@/lib/href';
import { classRange, discountPercent, formatPrice } from '@/lib/courseUtils';
import { queryClient } from '@/lib/queryClient';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { supabase } from '@/lib/supabase';
import { olympiadLabel } from '@/types';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session, profile } = useAuth();
  const { course, loading, error } = useCourseById(id);
  const { purchased, loading: pLoading, refresh: refreshPurchase } = useHasPurchased(id);
  const { modules } = useSyllabus(id);
  const { progress } = useUserProgress(id);
  const { url: introVideoUrl, loading: introUrlLoading } = useStorageUrl(course?.intro_video_path);
  const insets = useSafeAreaInsets();
  const [buying, setBuying] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const keyId = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID ?? '';

  const onBuy = async () => {
    if (!session?.user || !course) {
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
    }>('create-razorpay-order', { body: { course_id: course.id } });
    setBuying(false);

    if (fnError || !fnData?.order_id) {
      Toast.show({ type: 'error', text1: fnError?.message ?? 'Could not start payment' });
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

      if (modules.length > 0 && modules[0].lessons.length > 0) {
        router.push(href(`/course/${id}/lesson/${modules[0].lessons[0].id}`));
      }
    } catch (e: unknown) {
      const err = e as { description?: string; code?: string };
      if (err?.code !== 'PAYMENT_CANCELLED') {
        Toast.show({ type: 'error', text1: err?.description ?? err?.code ?? 'Payment failed' });
      }
    }
  };

  if (loading || pLoading) return <LoadingScreen />;

  if (error || !course) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6 dark:bg-neutral-950">
        <Text className="text-center text-neutral-600">{error?.message ?? 'Course not found'}</Text>
        <Button title="Go back" className="mt-6" variant="outline" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const hasDiscount = course.mrp != null && course.mrp > course.price;
  const olympiad = olympiadLabel(course);
  const cls = classRange(course);
  const metaLine = [olympiad, cls].filter(Boolean).join(' • ');
  const n = course.total_lessons;

  return (
    <View className="flex-1 bg-ui-bg dark:bg-neutral-900">

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: 16:9 video or thumbnail, edge-to-edge */}
        {course.intro_video_path ? (
          <VideoPlayer url={introUrlLoading ? null : introVideoUrl} />
        ) : (
          <CourseHero course={course} />
        )}

        {/* Content sheet */}
        <View className="rounded-t-3xl bg-ui-bg dark:bg-neutral-900 px-5 pt-6">

          {/* Meta + status badge */}
          <View className="flex-row items-center justify-between">
            {metaLine ? (
              <Text className="text-xs font-display uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                {metaLine}
              </Text>
            ) : (
              <View />
            )}
            {purchased ? (
              <CourseBadge
                label="Enrolled"
                variant="enrolled"
                icon={<CheckCircle size={10} color={brand.success} strokeWidth={2.5} />}
              />
            ) : course.is_featured ? (
              <CourseBadge
                label="Featured"
                variant="featured"
                icon={<Star size={9} color={iconColors.onBrand} strokeWidth={2.5} />}
              />
            ) : null}
          </View>

          {/* Title */}
          <Text className="mt-2 text-2xl font-display-black leading-tight text-neutral-900 dark:text-neutral-100">
            {course.title}
          </Text>

          {/* Stats row */}
          {(n > 0 || course.duration_hours > 0) && (
            <View className="mt-3 flex-row items-center gap-4">
              {n > 0 && (
                <View className="flex-row items-center gap-1.5">
                  <BookOpen size={12} color={iconColors.muted} strokeWidth={2.5} />
                  <Text className="text-xs font-sans-medium text-neutral-400 dark:text-neutral-500">
                    {n} {n === 1 ? 'lesson' : 'lessons'}
                  </Text>
                </View>
              )}
              {course.duration_hours > 0 && (
                <View className="flex-row items-center gap-1.5">
                  <Clock size={12} color={iconColors.muted} strokeWidth={2.5} />
                  <Text className="text-xs font-sans-medium text-neutral-400 dark:text-neutral-500">
                    {course.duration_hours}h
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Price */}
          <View className="mt-5 flex-row items-center gap-3">
            <Text className="text-3xl font-display-black text-brand-primary">
              {formatPrice(course.price)}
            </Text>
            {hasDiscount && (
              <>
                <Text className="text-base font-sans-medium text-neutral-400 line-through">
                  {formatPrice(course.mrp!)}
                </Text>
                <View className="rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 dark:border-green-800 dark:bg-green-900/40">
                  <Text className="text-xs font-display-black text-green-700 dark:text-green-300">
                    {discountPercent(course.price, course.mrp!)}% off
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Description */}
          {course.description ? (
            <View className="mt-4 rounded-2xl border border-ui-border bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <Text
                className="text-sm font-sans-medium leading-relaxed text-neutral-700 dark:text-neutral-300"
                numberOfLines={descExpanded ? undefined : 3}
              >
                {course.description}
              </Text>
              <Pressable
                onPress={() => setDescExpanded((v) => !v)}
                style={{ alignSelf: 'flex-start', marginTop: 8 }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text className="text-xs font-display-black text-brand-primary">
                  {descExpanded ? 'Show less ↑' : 'Read more ↓'}
                </Text>
              </Pressable>
            </View>
          ) : null}

          {/* Syllabus — SyllabusView has its own "Syllabus" header */}
          <View className="mt-6">
            <SyllabusView
              courseId={course.id}
              hasPurchased={purchased}
              onLessonPress={(lessonId) => router.push(href(`/course/${course.id}/lesson/${lessonId}`))}
              onQuizPress={(quizId) => router.push(href(`/course/${course.id}/quiz/${quizId}`))}
            />
          </View>

        </View>
      </ScrollView>

      {/* Floating back button — overlays the hero */}
      <View
        className="absolute left-4 z-10"
        style={{ top: insets.top + 10 }}
        pointerEvents="box-none"
      >
        <BackButton variant="dark" />
      </View>

      {/* Sticky bottom CTA with top shadow */}
      <SafeAreaView
        edges={['bottom']}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-neutral-950 px-4 pt-3"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.07,
          shadowRadius: 10,
          elevation: 16,
        }}
      >
        <Button
          title={purchased ? 'Continue Learning' : `Buy Course — ${formatPrice(course.price)}`}
          loading={!purchased && buying}
          onPress={() => {
            if (purchased) {
              let nextItem: { type: 'lesson' | 'quiz'; id: string } | null = null;
              for (const mod of modules) {
                for (const lesson of mod.lessons) {
                  if (!progress.some((p) => p.lesson_id === lesson.id)) {
                    nextItem = { type: 'lesson', id: lesson.id };
                    break;
                  }
                }
                if (nextItem) break;
                for (const quiz of mod.quizzes) {
                  if (!progress.some((p) => p.quiz_id === quiz.id)) {
                    nextItem = { type: 'quiz', id: quiz.id };
                    break;
                  }
                }
                if (nextItem) break;
              }

              if (nextItem) {
                router.push(href(`/course/${course.id}/${nextItem.type}/${nextItem.id}`));
              } else if (modules.length > 0 && modules[0].lessons.length > 0) {
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
