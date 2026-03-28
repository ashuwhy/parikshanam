import { useEvent, useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { AlertCircle, Play, Pause, Maximize, Minimize } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View, Pressable, PanResponder, Modal, useWindowDimensions, StyleSheet } from 'react-native';
import YoutubePlayer, { type YoutubeIframeRef } from 'react-native-youtube-iframe';

import { Button } from '@/components/ui/Button';
import { brand } from '@/constants/Colors';
import { cn } from '@/lib/cn';

/** Lesson videos: YouTube ID. Course intro / storage: signed URL. */
export type VideoPlayerProps =
  | { videoId: string; url?: undefined; onEnded?: () => void }
  | { videoId?: undefined; url: string | null; onEnded?: () => void };

type StorageUrlProps = {
  url: string | null;
  onEnded?: () => void;
};

export function VideoPlayer(props: VideoPlayerProps) {
  if (props.videoId) {
    return <YoutubeLessonPlayer videoId={props.videoId} onEnded={props.onEnded} />;
  }
  return <StorageUrlVideoPlayer url={props.url ?? null} onEnded={props.onEnded} />;
}

function YoutubeLessonPlayer({
  videoId,
  onEnded,
}: {
  videoId: string;
  onEnded?: () => void;
}) {
  const { width } = useWindowDimensions();
  const height = Math.round((width * 9) / 16);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<YoutubeIframeRef>(null);

  const onStateChange = useCallback(
    (state: string) => {
      if (state === 'ended') {
        setPlaying(false);
        onEnded?.();
      }
      if (state === 'paused') setPlaying(false);
      if (state === 'playing') setPlaying(true);
    },
    [onEnded],
  );

  return (
    <View style={youtubeStyles.container}>
      <YoutubePlayer
        ref={playerRef}
        height={height}
        width={width}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
        initialPlayerParams={{
          rel: false,
          modestbranding: true,
          controls: true,
          iv_load_policy: 3,
        }}
        webViewProps={{
          allowsInlineMediaPlayback: true,
          mediaPlaybackRequiresUserAction: false,
        }}
      />
    </View>
  );
}

const youtubeStyles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
});

function formatTime(seconds: number) {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function StorageUrlVideoPlayer({ url, onEnded }: StorageUrlProps) {
  const videoViewRef = useRef<VideoView>(null);
  const fullscreenVideoViewRef = useRef<VideoView>(null);
  
  // Always pass null - never let expo-video manage the source directly.
  // If you pass a URL, expo-video recreates+releases the player on every URL change,
  // which causes "shared object already released" crashes in effects and timers.
  const player = useVideoPlayer(null, (p) => {
    p.loop = false;
  });

  const prevUrl = useRef<string | null>(null);
  useEffect(() => {
    if (url && url !== prevUrl.current) {
      prevUrl.current = url;
      void player.replaceAsync(url).then(() => {
        try { player.play(); } catch { /* player released between replaceAsync and play */ }
      });
    }
  }, [url, player]);

  useEventListener(player, 'playToEnd', () => {
    onEnded?.();
  });

  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  
  const isBuffering = status === 'loading';
  const hasError = status === 'error';

  // Custom Controls State
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Scrubber Drag State
  const [scrubberWidth, setScrubberWidth] = useState(0);
  const scrubberWidthRef = useRef(0); // ref copy so PanResponder (created once) always reads current value
  const durationRef = useRef(0);      // same for duration
  const isDragging = useRef(false);
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const startRatio = useRef(0);

  // Sync video time for the UI slider (4Hz is smooth enough without overhead)
  useEffect(() => {
    const id = setInterval(() => {
      if (isDragging.current) return;
      try {
        setCurrentTime(player.currentTime || 0);
        const d = player.duration || 0;
        setDuration(d);
        durationRef.current = d;
      } catch { /* player released on unmount - interval cleanup races with GC */ }
    }, 250);
    return () => clearInterval(id);
  }, [player]);

  const hideControlsLater = () => {
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      try {
        if (player.playing && !isDragging.current) setShowControls(false);
      } catch { /* player released before timeout fired */ }
    }, 3000);
  };

  const toggleControls = () => {
    setShowControls((v) => !v);
    hideControlsLater();
  };

  useEffect(() => {
    if (isPlaying && !isDragging.current) {
      hideControlsLater();
    } else {
      setShowControls(true);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    }
  }, [isPlaying]);

  const retry = () => {
    if (url) void player.replaceAsync(url).then(() => {
      try { player.play(); } catch {}
    });
  };

  const togglePlaybackRate = () => {
    const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : playbackRate === 2 ? 0.5 : 1;
    try {
      player.playbackRate = nextRate;
      setPlaybackRate(nextRate);
      hideControlsLater();
    } catch {}
  };

  const panResponder = useRef(
    PanResponder.create({
      // Capture in the bubble-down phase so we win before the parent Pressable overlay claims the gesture
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e) => {
        isDragging.current = true;
        if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
        // Read from refs - NOT from closed-over state (which would be stale 0s from mount)
        const sw = scrubberWidthRef.current;
        if (sw > 0) {
          startRatio.current = Math.max(0, Math.min(1, e.nativeEvent.locationX / sw));
          setDragProgress(startRatio.current);
        }
      },
      onPanResponderMove: (_e, gestureState) => {
        const sw = scrubberWidthRef.current;
        if (sw > 0) {
          const newRatio = Math.max(0, Math.min(1, startRatio.current + gestureState.dx / sw));
          setDragProgress(newRatio);
        }
      },
      onPanResponderRelease: (_e, gestureState) => {
        isDragging.current = false;
        const sw = scrubberWidthRef.current;
        const d = durationRef.current;
        if (sw > 0 && d > 0) {
          const newRatio = Math.max(0, Math.min(1, startRatio.current + gestureState.dx / sw));
          try {
            player.currentTime = newRatio * d;
            setCurrentTime(newRatio * d);
          } catch {}
        }
        hideControlsLater();
      },
      onPanResponderTerminate: () => {
        // Another responder stole the gesture - reset drag state cleanly
        isDragging.current = false;
      },
    })
  ).current;

  const currentProgressRatio = isDragging.current 
    ? dragProgress 
    : (duration > 0 ? (currentTime / duration) : 0);

  const renderContent = (full: boolean) => (
    <View 
      className={cn("w-full bg-neutral-950", full ? "flex-1 justify-center" : "")} 
      style={full ? undefined : { aspectRatio: 16 / 9 }}
    >
      {url ? (
        <VideoView
          ref={full ? fullscreenVideoViewRef : videoViewRef}
          player={player}
          style={{ width: '100%', height: full ? '100%' : '100%' }}
          contentFit="contain"
          nativeControls={false}
        />
      ) : null}

      {/* Interactive Overlay to capture taps and show controls */}
      {!hasError && (
        <Pressable 
          className="absolute inset-0 z-10" 
          onPress={toggleControls}
          style={{ backgroundColor: showControls ? 'rgba(0,0,0,0.4)' : 'transparent' }}
        >
          {showControls && (
            <>
              {/* Play / Pause Center Button */}
              <View className="absolute inset-0 items-center justify-center" pointerEvents="box-none">
                <Pressable
                  className="w-16 h-16 rounded-full bg-black/40 items-center justify-center"
                  onPress={() => {
                    try {
                      if (isPlaying) player.pause();
                      else player.play();
                      hideControlsLater();
                    } catch {}
                  }}
                >
                  {isPlaying ? (
                    <Pause color="white" fill="white" size={32} />
                  ) : (
                    <Play color="white" fill="white" size={32} style={{ marginLeft: 4 }} />
                  )}
                </Pressable>
              </View>

              {/* Bottom Control Bar */}
              <View className="absolute bottom-0 left-0 right-0 p-4 pt-10" pointerEvents="box-none">
                {/* Time & Maximize Row */}
                <View className="flex-row items-center justify-between mb-3 px-2">
                  <Text className="text-white font-sans-medium text-xs shadow-sm">
                    {formatTime(isDragging.current ? dragProgress * duration : currentTime)} / {formatTime(duration)}
                  </Text>
                  
                  <View className="flex-row items-center gap-5">
                    <Pressable 
                      onPress={togglePlaybackRate}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text className="text-white font-display-black text-[11px] uppercase tracking-wider shadow-sm">
                        {playbackRate}x
                      </Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => setIsFullscreen(!full)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      {full ? (
                        <Minimize color="white" size={20} strokeWidth={2.5} />
                      ) : (
                        <Maximize color="white" size={18} strokeWidth={2.5} />
                      )}
                    </Pressable>
                  </View>
                </View>

                {/* Scrubber Timeline */}
                <View 
                  className="w-full h-8 justify-center px-2"
                  onLayout={(e) => {
                    // Only update if this is the active view (not the hidden one behind the Modal)
                    if (full === isFullscreen) {
                      const w = e.nativeEvent.layout.width - 16; // subtract px-2 on each side
                      setScrubberWidth(w);
                      scrubberWidthRef.current = w; // keep ref in sync so PanResponder sees it
                    }
                  }}
                  {...panResponder.panHandlers}
                >
                  <View className="w-full h-1.5 bg-white/30 rounded-full">
                    {/* Fill */}
                    <View 
                      className="h-full bg-brand-primary rounded-full absolute left-0 top-0 bottom-0" 
                      style={{ width: `${currentProgressRatio * 100}%` }}
                    />
                    {/* Draggable Dot */}
                    <View 
                      className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-sm"
                      style={{ 
                        left: `${currentProgressRatio * 100}%`,
                        marginTop: -8,       
                        marginLeft: -8,      
                        elevation: 4,
                      }}
                    />
                  </View>
                </View>
              </View>
            </>
          )}
        </Pressable>
      )}

      {/* Buffering overlay - higher zIndex than controls (z-10) + later in tree = on top everywhere */}
      {(isBuffering || !url) && !hasError && (
        <View
          className="absolute inset-0 items-center justify-center"
          style={{ zIndex: 15 }}
          pointerEvents="none"
        >
          <ActivityIndicator size="large" color={brand.primary} />
        </View>
      )}

      {/* Error overlay */}
      {hasError && (
        <View className="absolute inset-0 items-center justify-center bg-neutral-950 px-8 gap-5 z-20">
          <AlertCircle size={44} color={brand.error} strokeWidth={1.5} />
          <View className="items-center gap-1.5">
            <Text className="text-lg font-display-black text-white">
              Video unavailable
            </Text>
            <Text className="text-sm font-sans-medium text-neutral-400 text-center leading-relaxed">
              Something went wrong loading this video.
            </Text>
          </View>
          {url && (
            <Button title="Try again" variant="outline" onPress={retry} />
          )}
        </View>
      )}
    </View>
  );

  return (
    <>
      {/* Normal mode renders inline, but we hide it completely if fullscreen so layout width doesn't fight */}
      {!isFullscreen && renderContent(false)}
      
      {/* Fullscreen uses a native modal so it breaks out of ScrollViews and UI hierarchy */}
      <Modal
        visible={isFullscreen}
        animationType="fade"
        transparent={false}
        statusBarTranslucent
        supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
        onRequestClose={() => setIsFullscreen(false)}
      >
        <View className="flex-1 bg-black">
          {renderContent(true)}
        </View>
      </Modal>
    </>
  );
}
