import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { dimensionalShadows } from '@/constants/Colors';

const SUBJECTS = [
  { emoji: '🔢', label: 'Math' },
  { emoji: '⚗️', label: 'Science' },
  { emoji: '🌍', label: 'Geography' },
  { emoji: '💻', label: 'Computing' },
];

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-ui-bg">
      <View className="flex-1 justify-between px-6 pb-10 pt-8">

        {/* Hero */}
        <View className="flex-1 items-center justify-center">

          {/* Logo */}
          <Image source={require('../../assets/images/icon.png')} className="h-24 w-24" />

          {/* Wordmark */}
          <Text className="mt-5 text-3xl font-black tracking-tight text-neutral-900">
            Parikshanam
          </Text>
          <Text className="mt-2 text-base font-medium text-neutral-500 text-center leading-relaxed">
            The Olympiad learning app.{'\n'}Learn smart. Compete hard. Win big.
          </Text>

          {/* Subject pills */}
          <View className="mt-8 flex-row gap-2">
            {SUBJECTS.map((s) => (
              <View
                key={s.label}
                className="items-center rounded-2xl border border-ui-border bg-white px-3 py-2"
                style={dimensionalShadows.sm.light}
              >
                <Text className="text-xl">{s.emoji}</Text>
                <Text className="mt-0.5 text-xs font-bold text-neutral-600">{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Social proof */}
          <View className="mt-8 flex-row items-center gap-2">
            <View className="flex-row">
              {['🧑', '👧', '🧒'].map((e, i) => (
                <View
                  key={i}
                  className="h-7 w-7 items-center justify-center rounded-full bg-ui-accent border-2 border-white"
                  style={{ marginLeft: i === 0 ? 0 : -8 }}
                >
                  <Text className="text-xs">{e}</Text>
                </View>
              ))}
            </View>
            <Text className="text-sm font-semibold text-neutral-600">
              Join <Text className="text-brand-dark font-black">10,000+</Text> students
            </Text>
          </View>
        </View>

        {/* CTA */}
        <View className="gap-4">
          <GoogleSignInButton />
          <Text className="text-center text-xs font-medium text-neutral-400">
            By continuing you agree to our{' '}
            <Text className="font-bold text-neutral-500">Terms &amp; Privacy Policy</Text>
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}
