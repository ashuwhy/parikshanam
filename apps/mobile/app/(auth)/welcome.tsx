import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-ui-bg">
      <View className="flex-1 justify-between px-6 pb-10 pt-16">

        {/* Hero */}
        <View className="flex-1 items-center justify-center gap-3">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-brand-primary shadow-dimensional">
            <Text className="text-4xl font-black text-white">P</Text>
          </View>
          <Text className="text-2xl font-black tracking-tight text-neutral-900 mt-4">
            Parikshanam
          </Text>
          <Text className="text-center text-base font-medium text-neutral-600">
            Ace every Olympiad.{'\n'}Learn smart, compete hard.
          </Text>
        </View>

        {/* Sign-in */}
        <View className="gap-3">
          <GoogleSignInButton />
          <Text className="text-center text-xs font-bold uppercase tracking-wider text-neutral-400 mt-2">
            By continuing you agree to our Terms & Privacy Policy
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}
