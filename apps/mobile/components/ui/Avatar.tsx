import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useAuth } from '@/hooks/useAuth';
import { href } from '@/lib/href';
import { brand } from '@/constants/Colors';

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

type AvatarProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

/** Tappable avatar — goes to profile screen. Shows Google photo if available, falls back to initials. */
export function Avatar({ size = 'md' }: AvatarProps) {
  const router = useRouter();
  const { profile } = useAuth();
  const label = initials(profile?.full_name, profile?.phone);
  const dim = size === 'lg' ? 40 : size === 'md' ? 36 : 28;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open profile"
      hitSlop={12}
      onPress={() => router.push(href('/profile'))}
    >
      {profile?.avatar_url ? (
        <Image
          source={{ uri: profile.avatar_url }}
          style={{ width: dim, height: dim, borderRadius: dim / 2 }}
          contentFit="cover"
        />
      ) : (
        <View
          style={{
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            backgroundColor: brand.primary + '20',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: brand.primary, fontWeight: '700', fontSize: size === 'lg' ? 16 : size === 'md' ? 14 : 11 }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

/** Non-tappable avatar circle — profile screen display. Shows Google photo or initials. */
export function AvatarCircle({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const { profile } = useAuth();
  const label = initials(profile?.full_name, profile?.phone);
  const dim = size === 'lg' ? 80 : 40;

  if (profile?.avatar_url) {
    return (
      <Image
        source={{ uri: profile.avatar_url }}
        style={{ width: dim, height: dim, borderRadius: dim / 2 }}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      style={{
        width: dim,
        height: dim,
        borderRadius: dim / 2,
        backgroundColor: brand.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: brand.primary, fontWeight: '700', fontSize: size === 'lg' ? 24 : 14 }}>
        {label}
      </Text>
    </View>
  );
}
