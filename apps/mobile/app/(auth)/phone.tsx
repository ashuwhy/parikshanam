import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { PhoneInput } from '@/components/auth/PhoneInput';
import { Button } from '@/components/ui/Button';
import { href } from '@/lib/href';
import { supabase } from '@/lib/supabase';

const COUNTRY = '+91';

export default function PhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const fullPhone = `${COUNTRY}${phone}`;

  const onSend = async () => {
    if (phone.length < 10) {
      Toast.show({ type: 'error', text1: 'Enter a valid 10-digit number' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);
    if (error) {
      Toast.show({ type: 'error', text1: error.message });
      return;
    }
    router.push(href(`/(auth)/verify?phone=${encodeURIComponent(fullPhone)}`));
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 justify-center px-6">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Your phone</Text>
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">We will send a one-time code to verify it.</Text>

        <View className="mt-8">
          <PhoneInput countryCode={COUNTRY} value={phone} onChangeText={setPhone} />
        </View>

        <View className="mt-8">
          <Button title="Send OTP" loading={loading} onPress={() => void onSend()} />
        </View>
      </View>
    </SafeAreaView>
  );
}
