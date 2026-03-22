import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, Text } from 'react-native';

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
      className="bg-white rounded-2xl border-2 border-ui-border border-b-4 px-6 py-3 shadow-dimensional active:translate-y-0.5 active:border-b-2 active:shadow-active items-center justify-center flex-row gap-2">
      <Text className="text-base font-bold text-brand-dark">Continue with Google</Text>
    </Pressable>
  );
}
