import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import '../global.css';

import { DataSync } from '@/components/DataSync';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { AuthProvider } from '@/context/AuthContext';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/hooks/useAuth';
import { href } from '@/lib/href';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

WebBrowser.maybeCompleteAuthSession();

SplashScreen.preventAutoHideAsync();

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { session, profile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const root = segments[0] as string | undefined;
    const inAuthGroup = root === '(auth)';
    const inOnboardingGroup = root === '(onboarding)';

    if (!session) {
      if (!inAuthGroup) {
        router.replace(href('/(auth)/welcome'));
      }
      return;
    }

    const done = profile?.onboarding_completed === true;
    if (!done) {
      if (!inOnboardingGroup) {
        router.replace(href('/(onboarding)/class-select'));
      }
      return;
    }

    if (inAuthGroup || inOnboardingGroup) {
      router.replace(href('/(tabs)'));
    }
  }, [session, profile, loading, segments, router]);

  return <>{children}</>;
}

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotifications } from '@/hooks/useNotifications';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { loading } = useAuth();
  const insets = useSafeAreaInsets();
  useNotifications();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NavigationGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="course/[id]" />
          <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
        </Stack>
      </NavigationGuard>
      <StatusBar style="auto" />
      <Toast topOffset={insets.top + 10} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <DataSync />
              <RootLayoutNav />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </View>
  );
}
