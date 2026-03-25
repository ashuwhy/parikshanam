import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { AlertCircle, Loader } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { iconColors } from '@/constants/Colors';

type Props = {
  /** Signed URL for the video. Pass null to show a loading state. */
  url: string | null;
  onEnded?: () => void;
};

export function VideoPlayer({ url, onEnded }: Props) {
  const player = useVideoPlayer(url ?? '', (p) => {
    p.loop = false;
    // Don't autoplay until we have a real URL
    if (url) p.play();
  });

  // Re-play when url changes (e.g. after signed URL refresh)
  const prevUrl = useRef<string | null>(null);
  useEffect(() => {
    if (url && url !== prevUrl.current) {
      player.replace(url);
      player.play();
      prevUrl.current = url;
    }
  }, [url, player]);

  // Fire onEnded callback when video reaches the end
  useEvent(player, 'playToEnd', () => {
    onEnded?.();
  });

  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const isBuffering = status === 'loading';
  const hasError = status === 'error';

  return (
    <View className="w-full bg-neutral-950" style={{ aspectRatio: 16 / 9 }}>
      {url ? (
        <VideoView
          player={player}
          style={{ width: '100%', height: '100%' }}
          contentFit="contain"
          allowsFullscreen
          allowsPictureInPicture
          nativeControls
        />
      ) : null}

      {/* Buffering overlay */}
      {(isBuffering || !url) && !hasError && (
        <View className="absolute inset-0 items-center justify-center bg-neutral-950/80">
          <ActivityIndicator size="large" color={iconColors.primary} />
        </View>
      )}

      {/* Error overlay */}
      {hasError && (
        <View className="absolute inset-0 items-center justify-center bg-neutral-950 px-8">
          <AlertCircle size={40} color="#EF4444" strokeWidth={1.5} />
          <Text className="mt-3 text-sm font-sans-medium text-neutral-400 text-center">
            Failed to load video
          </Text>
        </View>
      )}
    </View>
  );
}
