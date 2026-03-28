import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useAuth } from '@/hooks/useAuth';
import { href } from '@/lib/href';

function initials(name: string | null | undefined, phone: string | null | undefined) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? '';
    const b = parts[1]?.[0] ?? '';
    return (a + b).toUpperCase() || a.toUpperCase();
  }
  if (phone && phone.length >= 2) {
    return phone.slice(-2);
  }
  return '?';
}

export function Avatar() {
  const router = useRouter();
  const { profile } = useAuth();
  const label = initials(profile?.full_name, profile?.phone);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open profile"
      hitSlop={12}
      onPress={() => router.push(href('/profile'))}
      className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-brand-primaryLight dark:bg-brand-primaryDark">
      <Text className="text-sm font-semibold text-brand-primary dark:text-brand-primary-light">{label}</Text>
    </Pressable>
  );
}

/** Same initials logic without navigation - for profile screen */
export function AvatarCircle({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const { profile } = useAuth();
  const label = initials(profile?.full_name, profile?.phone);
  const dim = size === 'lg' ? 'h-20 w-20' : 'h-10 w-10';
  const text = size === 'lg' ? 'text-2xl' : 'text-sm';

  return (
    <View className={`${dim} items-center justify-center rounded-full bg-brand-primaryLight dark:bg-brand-primaryDark`}>
      <Text className={`font-semibold text-brand-primary dark:text-brand-primary-light ${text}`}>{label}</Text>
    </View>
  );
}
