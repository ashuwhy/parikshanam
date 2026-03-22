import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { Button } from '@/components/ui/Button';
import { href } from '@/lib/href';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 justify-center px-6">
        <Text className="text-center text-3xl font-bold text-indigo-600 dark:text-indigo-400">Parikshanam</Text>
        <Text className="mt-2 text-center text-lg text-neutral-600 dark:text-neutral-400">Ace Every Olympiad</Text>

        <View className="mt-12 gap-4">
          <Button title="Sign in with Phone" onPress={() => router.push(href('/(auth)/phone'))} />
          <GoogleSignInButton />
        </View>
      </View>
    </SafeAreaView>
  );
}
