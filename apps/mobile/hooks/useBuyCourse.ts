import { useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

import { useAuth } from '@/hooks/useAuth';
import { href } from '@/lib/href';
import { queryClient } from '@/lib/queryClient';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { supabase } from '@/lib/supabase';
import type { Course } from '@/types';

export function useBuyCourse(course: Course | null | undefined) {
  const router = useRouter();
  const { session, profile } = useAuth();
  const [buying, setBuying] = useState(false);
  const keyId = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID ?? '';

  const buy = async () => {
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

      Toast.show({ type: 'success', text1: 'Enrolled successfully!' });
      await queryClient.invalidateQueries({ queryKey: ['purchases', session.user.id] });
      router.push(href(`/course/${course.id}`));
    } catch (e: unknown) {
      const err = e as { description?: string; code?: string };
      if (err?.code !== 'PAYMENT_CANCELLED') {
        Toast.show({ type: 'error', text1: err?.description ?? err?.code ?? 'Payment failed' });
      }
    }
  };

  return { buy, buying };
}
