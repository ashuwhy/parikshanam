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
    <SafeAreaView className="flex-1 bg-ui-bg">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-2xl font-black text-neutral-900">Welcome!</Text>
          <Text className="mt-2 text-base font-medium text-neutral-600">Please provide your details to get started.</Text>

          <View className="mt-8 gap-5">
            <View>
              <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
                className="input-default"
              />
            </View>
            <View>
              <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Phone Number (Optional)</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="10-digit phone number"
                keyboardType="phone-pad"
                className="input-default"
              />
            </View>
          </View>

          <View className="mt-10">
            <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Select Your Class</Text>
            <View className="flex-row flex-wrap justify-center gap-3">
              {classLevels.map((cl) => {
                const active = selected === cl.id;
                return (
                  <Pressable
                    key={cl.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => setSelected(cl.id)}
                    className={`h-14 min-w-[80px] items-center justify-center rounded-2xl border-2 px-6 ${
                      active ? 'border-brand-primary bg-brand-primary/10' : 'border-ui-border bg-white active:border-ui-accent'
                    }`}>
                    <Text
                      className={`text-base font-bold ${active ? 'text-brand-dark' : 'text-neutral-800'}`}>
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
