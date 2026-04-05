import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AlertCircle, ArrowLeft, Award, ChevronRight, Download, Search } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { supabase } from '@/lib/supabase';
import { findStudentsByNameQuery } from '@/lib/ysc';
import type { YscStudentRecord } from '@/lib/ysc';
import { brand, iconColors } from '@/constants/Colors';

const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? 'https://parikshanam.com';

function sanitize(name: string): string {
  return name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
}

export default function YscScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [matches, setMatches] = useState<YscStudentRecord[]>([]);
  const [selected, setSelected] = useState<YscStudentRecord | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    const found = findStudentsByNameQuery(query);
    setMatches(found);
    setSearched(true);
    setSelected(found.length === 1 ? found[0]! : null);
  };

  const handleDownload = async (student: YscStudentRecord) => {
    setDownloading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert('Sign in required', 'Please sign in to download your certificate.');
        return;
      }

      const response = await fetch(`${WEB_URL}/api/ysc/generate-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          rollNo: student.rollNo,
          name: student.name,
          class: student.class,
          subject: student.subject,
          score: student.score,
        }),
      });

      if (response.status === 401) {
        Alert.alert('Session expired', 'Please sign out and sign in again.');
        return;
      }
      if (!response.ok) {
        const err = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(err?.error ?? 'Failed to generate certificate');
      }

      // Convert response to base64 and save locally
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]!);
      }
      const base64 = btoa(binary);

      const filename = `YSC-${student.certificateType}-${sanitize(student.name)}.pdf`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
      } else {
        Alert.alert('Saved', `Certificate saved to: ${fileUri}`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      Alert.alert('Download failed', msg);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-950" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center gap-1 mb-6 -ml-1 self-start"
          >
            <ArrowLeft size={18} color={iconColors.muted} strokeWidth={2} />
            <Text className="text-sm font-sans-medium text-neutral-500">Back</Text>
          </Pressable>

          {/* Hero */}
          <View className="items-center mb-8">
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center mb-4"
              style={{ backgroundColor: brand.primary + '18' }}
            >
              <Award size={28} color={brand.primary} strokeWidth={2.25} />
            </View>
            <Text className="text-2xl font-display-black text-neutral-900 dark:text-neutral-100 text-center">
              YSC Certificate
            </Text>
            <Text className="mt-1 text-sm font-sans-medium text-neutral-500 text-center">
              Young Scientist Challenge — APS Kolkata
            </Text>
          </View>

          {/* Search */}
          <View className="rounded-2xl border-2 border-ui-border bg-white dark:bg-neutral-800 p-5 mb-5">
            <Text className="text-xs font-display-black uppercase tracking-wider text-neutral-500 mb-3">
              Enter your name
            </Text>
            <View className="flex-row gap-2">
              <TextInput
                className="flex-1 rounded-xl border-2 border-ui-border px-4 py-3 text-base font-sans-medium text-neutral-900 dark:text-neutral-100 bg-ui-bg dark:bg-neutral-900"
                placeholder="e.g. PARIDHI JHA"
                placeholderTextColor={iconColors.empty}
                value={query}
                onChangeText={setQuery}
                autoCapitalize="characters"
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
              <Pressable
                onPress={handleSearch}
                className="rounded-xl px-4 items-center justify-center"
                style={{ backgroundColor: brand.primary }}
              >
                <Search size={20} color="#fff" strokeWidth={2} />
              </Pressable>
            </View>
          </View>

          {/* No results */}
          {searched && matches.length === 0 && (
            <View className="rounded-2xl border-2 border-status-error/30 bg-status-error/5 p-6 items-center mb-5">
              <AlertCircle size={32} color={iconColors.error} strokeWidth={1.8} />
              <Text className="mt-3 text-base font-display-extra text-status-error text-center">
                Student not found
              </Text>
              <Text className="mt-1 text-sm font-sans-medium text-status-error/80 text-center">
                Check spelling and try your full registered name.
              </Text>
            </View>
          )}

          {/* Multiple matches — pick one */}
          {searched && matches.length > 1 && !selected && (
            <View className="rounded-2xl border-2 border-ui-border bg-white dark:bg-neutral-800 p-5 mb-5">
              <Text className="text-base font-display-extra text-neutral-900 dark:text-neutral-100 mb-3">
                Multiple matches — pick your row
              </Text>
              {matches.map((m, i) => (
                <Pressable
                  key={`${m.rollNo}-${m.class}-${m.subject}-${i}`}
                  onPress={() => setSelected(m)}
                  className="flex-row items-center justify-between rounded-xl border-2 border-ui-border px-4 py-3 mb-2"
                >
                  <View>
                    <Text className="font-display-extra text-neutral-900 dark:text-neutral-100">
                      {m.name}
                    </Text>
                    <Text className="text-xs font-sans-medium text-neutral-500 mt-0.5">
                      Roll {m.rollNo} · Class {m.class} · {m.subject}
                    </Text>
                  </View>
                  <ChevronRight size={18} color={iconColors.muted} strokeWidth={2} />
                </Pressable>
              ))}
            </View>
          )}

          {/* Certificate found */}
          {selected && (
            <View className="rounded-2xl border-2 border-brand-accent bg-white dark:bg-neutral-800 p-5">
              <Text className="text-lg font-display-black text-neutral-900 dark:text-neutral-100 mb-4">
                Certificate found
              </Text>

              <View className="flex-row flex-wrap gap-3 mb-4">
                {[
                  { label: 'Name', value: selected.name },
                  { label: 'Class', value: selected.class },
                  { label: 'Subject', value: selected.subject },
                  { label: 'Score', value: selected.score },
                ].map(({ label, value }) => (
                  <View
                    key={label}
                    className="rounded-xl border border-ui-border bg-ui-bg dark:bg-neutral-900 p-3"
                    style={{ minWidth: '45%', flexGrow: 1 }}
                  >
                    <Text className="text-xs font-display-black uppercase tracking-wider text-neutral-500 mb-1">
                      {label}
                    </Text>
                    <Text className="text-base font-display-extra text-neutral-900 dark:text-neutral-100">
                      {value}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Certificate type badge */}
              <View className="rounded-xl border-2 border-brand-accent p-3 mb-5">
                <Text className="text-xs font-display-black uppercase tracking-wider text-neutral-500 mb-2">
                  Certificate type
                </Text>
                <View
                  className="self-start rounded-full px-3 py-1"
                  style={{
                    backgroundColor:
                      selected.certificateType === 'merit' ? brand.gold + '55' : brand.navy + '20',
                  }}
                >
                  <Text
                    className="text-sm font-display-extra"
                    style={{
                      color: selected.certificateType === 'merit' ? brand.dark : brand.navy,
                    }}
                  >
                    {selected.certificateType === 'merit' ? 'Merit' : 'Participation'}
                  </Text>
                </View>
              </View>

              <View className="gap-2">
                {matches.length > 1 && (
                  <Pressable
                    onPress={() => setSelected(null)}
                    disabled={downloading}
                    className="rounded-xl border-2 border-ui-border py-3 items-center"
                  >
                    <Text className="font-display-extra text-neutral-700 dark:text-neutral-300">
                      Choose another
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={() => void handleDownload(selected)}
                  disabled={downloading}
                  className="rounded-xl py-4 flex-row items-center justify-center gap-2"
                  style={{ backgroundColor: brand.primary, opacity: downloading ? 0.7 : 1 }}
                >
                  {downloading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Download size={18} color="#fff" strokeWidth={2} />
                  )}
                  <Text className="text-base font-display-extra text-white">
                    {downloading ? 'Generating PDF…' : 'Download certificate'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
