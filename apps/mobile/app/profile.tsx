import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { AvatarCircle } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { href } from '@/lib/href';
import { supabase } from '@/lib/supabase';
import { useProfileStore } from '@/lib/stores/useProfileStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { session, profile, signOut, refreshProfile } = useAuth();
  const classLevels = useProfileStore((s) => s.classLevels);
  const classLabel =
    profile?.class_level_id != null
      ? classLevels.find((c) => c.id === profile.class_level_id)?.label
      : null;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.full_name ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(profile?.full_name ?? '');
  }, [profile?.full_name]);

  const email = session?.user?.email ?? null;
  const phone = profile?.phone ?? session?.user?.phone ?? null;

  const onSaveName = async () => {
    if (!session?.user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name.trim() || null })
      .eq('id', session.user.id);
    setSaving(false);
    if (error) {
      Toast.show({ type: 'error', text1: error.message });
      return;
    }
    await refreshProfile();
    setEditing(false);
    Toast.show({ type: 'success', text1: 'Profile updated' });
  };

  const onSignOut = async () => {
    await signOut();
    router.replace(href('/(auth)/welcome'));
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <View className="flex-row items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <Pressable accessibilityRole="button" accessibilityLabel="Close profile" onPress={() => router.back()}>
          <Text className="text-base text-indigo-600">Close</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Profile</Text>
        <View className="w-12" />
      </View>

      <View className="items-center px-6 pt-8">
        <AvatarCircle size="lg" />
        <View className="mt-6 w-full">
          {editing ? (
            <View>
              <TextInput
                accessibilityLabel="Full name"
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
              <View className="mt-3 flex-row gap-3">
                <Button title="Save" loading={saving} className="flex-1" onPress={() => void onSaveName()} />
                <Button title="Cancel" variant="outline" className="flex-1" onPress={() => setEditing(false)} />
              </View>
            </View>
          ) : (
            <View className="items-center">
              <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                {profile?.full_name?.trim() || 'Add your name'}
              </Text>
              <Button title="Edit name" variant="outline" className="mt-3" onPress={() => setEditing(true)} />
            </View>
          )}
        </View>

        <View className="mt-10 w-full rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <Text className="text-xs font-medium uppercase text-neutral-500">Phone</Text>
          <Text className="mt-1 text-base text-neutral-900 dark:text-neutral-100">{phone ?? '—'}</Text>
          <Text className="mt-4 text-xs font-medium uppercase text-neutral-500">Email</Text>
          <Text className="mt-1 text-base text-neutral-900 dark:text-neutral-100">{email ?? '—'}</Text>
          {classLabel ? (
            <>
              <Text className="mt-4 text-xs font-medium uppercase text-neutral-500">Class</Text>
              <Text className="mt-1 text-base text-neutral-900 dark:text-neutral-100">{classLabel}</Text>
            </>
          ) : null}
        </View>

        <Button title="Sign out" variant="outline" className="mt-10 w-full" onPress={() => void onSignOut()} />
      </View>
    </SafeAreaView>
  );
}
