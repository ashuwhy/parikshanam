import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brand } from '@/constants/Colors';

interface VideoPlayerProps {
  url: string;
  onEnded?: () => void;
}

export function VideoPlayer({ url, onEnded }: VideoPlayerProps) {
  // Temporary placeholder until expo-video is properly configured
  // To fix: Run `npx expo install expo-video` and rebuild the app
  
  return (
    <View className="w-full aspect-video bg-neutral-900 rounded-xl overflow-hidden items-center justify-center">
      <Ionicons name="play-circle-outline" size={64} color={brand.primary} />
      <Text className="text-white mt-4 text-base font-medium">Video Player</Text>
      <Text className="text-neutral-400 text-sm mt-1">expo-video needs to be configured</Text>
    </View>
  );
}

