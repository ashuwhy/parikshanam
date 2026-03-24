import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { isValidIndianPhone, PhoneInput } from '@/components/ui/PhoneInput';
import { useAuth } from '@/hooks/useAuth';
import { href } from '@/lib/href';
import { supabase } from '@/lib/supabase';
import { useProfileStore } from '@/lib/stores/useProfileStore';
import { useRouter } from 'expo-router';

export default function ClassSelectScreen() {
  const router = useRouter();
  const { session, profile, refreshProfile, signOut } = useAuth();
  const classLevels = useProfileStore((s) => s.classLevels);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState(profile?.full_name ?? session?.user?.user_metadata?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? session?.user?.phone ?? '');

  const onContinue = async () => {
    setSubmitted(true);
    if (!session?.user || !selected) {
      Toast.show({ type: 'error', text1: 'Select your class' });
      return;
    }
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter your full name' });
      return;
    }
    if (phone && !isValidIndianPhone(phone)) {
      Toast.show({ type: 'error', text1: 'Enter a valid 10-digit Indian mobile number' });
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

  const onBack = async () => {
    await signOut();
    router.replace(href('/(auth)/welcome'));
  };

  if (!session || classLevels.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-ui-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-5 pt-4 pb-2">
            <BackButton variant="light" onPress={() => void onBack()} />
          </View>

          {/* Title */}
          <View className="px-5 pt-4 pb-6">
            <Text className="text-3xl font-display-black tracking-tight text-neutral-900">
              Let's get you set up
            </Text>
            <Text className="mt-1.5 text-base font-sans-medium text-neutral-500">
              Tell us a little about yourself to personalise your learning.
            </Text>
          </View>

          {/* Form fields */}
          <View className="px-5 gap-4">
            <View>
              <Text className="mb-2 text-xs font-display uppercase tracking-wider text-neutral-500">
                Full Name *
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                className="h-14 rounded-2xl border-2 border-ui-border bg-white px-4 text-base font-sans-medium text-neutral-900"
              />
            </View>

            <View>
              <Text className="mb-2 text-xs font-display uppercase tracking-wider text-neutral-500">
                Phone Number
                <Text className="text-neutral-400"> (optional)</Text>
              </Text>
              <PhoneInput
                value={phone}
                onChangeText={setPhone}
                showValidation={submitted}
              />
            </View>
          </View>

          {/* Class selector */}
          <View className="px-5 mt-8">
            <Text className="mb-3 text-xs font-display uppercase tracking-wider text-neutral-500">
              Your Class *
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {classLevels.map((cl) => {
                const active = selected === cl.id;
                return (
                  <Pressable
                    key={cl.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => setSelected(cl.id)}
                    className={`h-14 min-w-[76px] items-center justify-center rounded-2xl border-2 px-5 ${
                      active
                        ? 'border-brand-primary bg-brand-primary/10'
                        : 'border-ui-border bg-white'
                    }`}
                  >
                    <Text
                      className={`text-base font-display-black ${
                        active ? 'text-brand-dark' : 'text-neutral-700'
                      }`}
                    >
                      {cl.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* CTA */}
          <View className="px-5 mt-auto pt-10">
            <Button
              title="Continue"
              loading={loading}
              disabled={!selected || !name.trim()}
              onPress={() => void onContinue()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
