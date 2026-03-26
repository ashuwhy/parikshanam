import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Image } from 'expo-image';
import { Pressable, Text } from 'react-native';

import GoogleIcon from '../../assets/icons/google.svg';

import { supabase } from '@/lib/supabase';

function parseHashParams(url: string): Record<string, string> {
  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) return {};
  const hash = url.slice(hashIndex + 1);
  const params = new URLSearchParams(hash);
  const out: Record<string, string> = {};
  params.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

export function GoogleSignInButton() {
  const onPress = async () => {
    try {
    const redirectTo = Linking.createURL('google-callback');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;
    if (!data.url) return;

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success' || !result.url) return;

    try {
      const url = new URL(result.url);
      const code = url.searchParams.get('code');
      if (code) {
        const { error: ex } = await supabase.auth.exchangeCodeForSession(code);
        if (ex) throw ex;
        return;
      }
    } catch {
      // non-standard URL — try fragment flow below
    }

    const params = parseHashParams(result.url);
    const access_token = params.access_token;
    const refresh_token = params.refresh_token;
    if (access_token && refresh_token) {
      await supabase.auth.setSession({ access_token, refresh_token });
    }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => void onPress()}
      style={({ pressed }: { pressed: boolean }) => pressed ? { transform: [{ translateY: 3 }] } : undefined}
      className="bg-white dark:bg-neutral-800 rounded-2xl border-2 border-b-4 border-ui-border dark:border-neutral-600 px-6 py-4 items-center justify-center flex-row gap-3">
      <Image source={GoogleIcon} style={{ width: 20, height: 20 }} contentFit="contain" />
      <Text className="text-base font-sans-bold text-brand-primary">Continue with Google</Text>
    </Pressable>
  );
}
