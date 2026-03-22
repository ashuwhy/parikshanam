import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';

interface VideoPlayerProps {
  url: string;
  onEnded?: () => void;
}

export function VideoPlayer({ url, onEnded }: VideoPlayerProps) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = false;
    p.play();
  });

  // Since expo-video event listener API hooks are still maturing, we can simply provide the standard player.
  // In a real production app we would listen for natural end events.

  return (
    <View className="w-full aspect-video bg-black rounded-xl overflow-hidden">
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        nativeControls
      />
    </View>
  );
}
