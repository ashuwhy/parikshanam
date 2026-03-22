import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { CourseHero } from '@/components/course/CourseHero';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { useCourseById } from '@/hooks/useCourses';
import { useHasPurchased } from '@/hooks/usePurchases';
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
      router.back();
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

  const learnings = [
    'Structured lessons aligned with Olympiad syllabus',
    'Practice tests and problem-solving strategies',
    'Track progress and revisit tough topics',
  ];

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
            <Text className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatRupeePaise(course.price)}
            </Text>
            {course.mrp != null && course.mrp > course.price ? (
              <Text className="text-lg text-neutral-400 line-through">{formatRupeePaise(course.mrp)}</Text>
            ) : null}
          </View>

          {course.description ? (
            <Text className="mt-6 leading-6 text-neutral-700 dark:text-neutral-300">{course.description}</Text>
          ) : null}

          <Text className="mt-8 text-lg font-semibold text-neutral-900 dark:text-neutral-100">What you&apos;ll learn</Text>
          <View className="mt-3 gap-2">
            {learnings.map((line) => (
              <Text key={line} className="text-neutral-700 dark:text-neutral-300">
                • {line}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} className="absolute bottom-0 left-0 right-0 border-t border-neutral-100 bg-white px-4 pt-3 dark:border-neutral-800 dark:bg-neutral-950">
        <Button
          title={purchased ? 'Continue Learning' : `Buy Course — ${formatRupeePaise(course.price)}`}
          loading={!purchased && buying}
          onPress={() =>
            purchased ? router.push(href('/(tabs)/my-courses')) : void onBuy()
          }
        />
      </SafeAreaView>
    </View>
  );
}
