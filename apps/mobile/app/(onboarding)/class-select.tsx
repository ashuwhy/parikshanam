import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useProfileStore } from '@/lib/stores/useProfileStore';

export default function ClassSelectScreen() {
  const { session, refreshProfile } = useAuth();
  const classLevels = useProfileStore((s) => s.classLevels);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onContinue = async () => {
    if (!session?.user || !selected) {
      Toast.show({ type: 'error', text1: 'Select your class' });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        class_level_id: selected,
        onboarding_completed: true,
      })
      .eq('id', session.user.id);
    setLoading(false);
    if (error) {
      Toast.show({ type: 'error', text1: error.message });
      return;
    }
    await refreshProfile();
  };

  if (!session) {
    return <LoadingScreen />;
  }

  if (classLevels.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 px-6 pt-8">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">What class are you in?</Text>
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">We will show Olympiad courses that match your grade.</Text>

        <View className="mt-10 flex-row flex-wrap justify-center gap-3">
          {classLevels.map((cl) => {
            const active = selected === cl.id;
            return (
              <Pressable
                key={cl.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setSelected(cl.id)}
                className={`h-16 min-w-[28%] items-center justify-center rounded-xl border-2 px-4 ${
                  active
                    ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950'
                    : 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900'
                }`}>
                <Text
                  className={`text-lg font-semibold ${active ? 'text-indigo-700 dark:text-indigo-200' : 'text-neutral-800 dark:text-neutral-200'}`}>
                  {cl.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-auto pb-8">
          <Button title="Continue" loading={loading} disabled={!selected} onPress={() => void onContinue()} />
        </View>
      </View>
    </SafeAreaView>
  );
}
