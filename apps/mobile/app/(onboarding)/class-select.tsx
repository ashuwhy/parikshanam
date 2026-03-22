import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useProfileStore } from '@/lib/stores/useProfileStore';

export default function ClassSelectScreen() {
  const { session, profile, refreshProfile } = useAuth();
  const classLevels = useProfileStore((s) => s.classLevels);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(profile?.full_name ?? session?.user?.user_metadata?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? session?.user?.phone ?? '');

  const onContinue = async () => {
    if (!session?.user || !selected) {
      Toast.show({ type: 'error', text1: 'Select your class' });
      return;
    }
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter your full name' });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: name.trim(),
        phone: phone.trim() || null,
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-3xl font-black text-neutral-900 dark:text-neutral-100">Welcome!</Text>
          <Text className="mt-2 text-base text-neutral-600 dark:text-neutral-400">Please provide your details to get started.</Text>

          <View className="mt-8 gap-5">
            <View>
              <Text className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
                className="h-14 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-base text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Phone Number (Optional)</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="10-digit phone number"
                keyboardType="phone-pad"
                className="h-14 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-base text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </View>
          </View>

          <View className="mt-10">
            <Text className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Select Your Class</Text>
            <View className="flex-row flex-wrap justify-center gap-3">
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
                        ? 'border-brand-primary bg-brand-primaryLight dark:border-brand-primary-light dark:bg-brand-primaryDark'
                        : 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900'
                    }`}>
                    <Text
                      className={`text-lg font-semibold ${active ? 'text-brand-primaryDark dark:text-brand-primary-light' : 'text-neutral-800 dark:text-neutral-200'}`}>
                      {cl.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="mt-auto pt-12">
            <Button title="Continue" loading={loading} disabled={!selected || !name.trim()} onPress={() => void onContinue()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
