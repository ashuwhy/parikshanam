import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { AvatarCircle } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useMyPurchases, useUserProgress } from '@/hooks/usePurchases';
import { href } from '@/lib/href';
import { supabase } from '@/lib/supabase';
import { useProfileStore } from '@/lib/stores/useProfileStore';
import { dimensionalShadows } from '@/constants/Colors';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-3.5 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</Text>
      <Text className="text-sm font-bold text-neutral-900 dark:text-neutral-100 max-w-[60%] text-right">{value}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { session, profile, signOut, refreshProfile } = useAuth();
  const classLevels = useProfileStore((s) => s.classLevels);
  const classLabel = profile?.class_level_id != null
    ? classLevels.find((c) => c.id === profile.class_level_id)?.label
    : null;

  const { purchases } = useMyPurchases();
  const { progress } = useUserProgress();

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
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900">

      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={12}
          onPress={() => router.back()}
        >
          <Text className="text-base font-bold text-brand-primary">Close</Text>
        </Pressable>
        <Text className="text-base font-black text-neutral-900 dark:text-neutral-100">Profile</Text>
        <View className="w-12" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Avatar + name block */}
        <View className="items-center bg-white dark:bg-neutral-800 pt-8 pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <AvatarCircle size="lg" />
          <View className="mt-4 items-center px-6 w-full">
            {editing ? (
              <View className="w-full gap-3">
                <TextInput
                  accessibilityLabel="Full name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  autoFocus
                  className="rounded-2xl border-2 border-ui-border dark:border-neutral-600 bg-ui-bg dark:bg-neutral-900 px-4 py-3 text-base font-bold text-neutral-900 dark:text-neutral-100 text-center"
                />
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => void onSaveName()}
                    disabled={saving}
                    className="flex-1 items-center rounded-2xl bg-brand-primary py-3"
                    style={dimensionalShadows.brand.sm}
                  >
                    <Text className="text-sm font-black text-white">{saving ? 'Saving…' : 'Save'}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => { setEditing(false); setName(profile?.full_name ?? ''); }}
                    className="flex-1 items-center rounded-2xl border-2 border-ui-border dark:border-neutral-600 bg-white dark:bg-neutral-800 py-3"
                  >
                    <Text className="text-sm font-black text-neutral-700 dark:text-neutral-300">Cancel</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <>
                <Text className="text-xl font-black text-neutral-900 dark:text-neutral-100">
                  {profile?.full_name?.trim() || 'Add your name'}
                </Text>
                {email && (
                  <Text className="mt-1 text-sm font-medium text-neutral-500">{email}</Text>
                )}
                <Pressable onPress={() => setEditing(true)} className="mt-3 rounded-full border border-ui-border dark:border-neutral-700 px-5 py-1.5">
                  <Text className="text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300">Edit name</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>

        {/* Stats row */}
        <View className="mx-5 mt-5 flex-row gap-3">
          {[
            { value: purchases.length, label: 'Courses' },
            { value: progress.filter((p) => p.lesson_id).length, label: 'Lessons' },
          ].map((s) => (
            <View
              key={s.label}
              className="flex-1 items-center rounded-2xl bg-white dark:bg-neutral-800 py-4 border border-ui-border dark:border-neutral-700"
              style={dimensionalShadows.sm.light}
            >
              <Text className="text-2xl font-black text-brand-primary">{s.value}</Text>
              <Text className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Account info */}
        <View className="mx-5 mt-5 rounded-2xl bg-white dark:bg-neutral-800 px-4 border border-ui-border dark:border-neutral-700">
          {email && <InfoRow label="Email" value={email} />}
          {phone && <InfoRow label="Phone" value={phone} />}
          {classLabel && <InfoRow label="Class" value={classLabel} />}
        </View>

        {/* Sign out */}
        <Pressable
          onPress={() => void onSignOut()}
          className="mx-5 mt-5 items-center rounded-2xl border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 py-4"
        >
          <Text className="text-sm font-black text-red-600 dark:text-red-400">Sign Out</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}
