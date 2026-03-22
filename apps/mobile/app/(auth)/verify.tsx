import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { OTPInput } from '@/components/auth/OTPInput';
import { Button } from '@/components/ui/Button';
import { href } from '@/lib/href';
import { supabase } from '@/lib/supabase';

function maskPhone(phone: string) {
  if (phone.length < 4) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(-2)}`;
}

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string | string[] }>();
  const phone = typeof params.phone === 'string' ? params.phone : params.phone?.[0];
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const onVerify = async () => {
    if (!phone || code.length !== 6) {
      Toast.show({ type: 'error', text1: 'Enter the 6-digit code' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    });
    setLoading(false);
    if (error) {
      Toast.show({ type: 'error', text1: error.message });
      return;
    }
    Toast.show({ type: 'success', text1: 'Signed in' });
  };

  const onResend = async () => {
    if (!phone || seconds > 0) return;
    setSeconds(60);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      Toast.show({ type: 'error', text1: error.message });
      return;
    }
    Toast.show({ type: 'info', text1: 'OTP sent again' });
  };

  if (!phone) {
    router.replace(href('/(auth)/phone'));
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 justify-center px-6">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Verify OTP</Text>
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">Code sent to {maskPhone(phone)}</Text>

        <View className="mt-10">
          <OTPInput value={code} onChange={setCode} />
        </View>

        <View className="mt-8">
          <Button title="Verify" loading={loading} onPress={() => void onVerify()} />
        </View>

        <Text
          accessibilityRole="button"
          onPress={() => void onResend()}
          className={`mt-6 text-center text-base ${seconds > 0 ? 'text-neutral-400' : 'text-indigo-600'}`}>
          {seconds > 0 ? `Resend OTP in ${seconds}s` : 'Resend OTP'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
