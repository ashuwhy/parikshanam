"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  FastForward,
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";

import { loadYouTubeIframeAPI } from "@/lib/youtubeIframeApi";

interface Props {
  videoId: string;
  title: string;
  onEnded?: () => void;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ videoId, title, onEnded }: Props) {
  const playerId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onEndedRef = useRef(onEnded);
  const hasStartedRef = useRef(false);
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  const [playing, setPlaying] = useState(false);
  /** True only after the iframe reports PLAYING (hides pre-play black; cleared on ENDED). */
  const [hasStarted, setHasStarted] = useState(false);
  useEffect(() => {
    hasStartedRef.current = hasStarted;
  }, [hasStarted]);
  const [awaitingPlayback, setAwaitingPlayback] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [ready, setReady] = useState(false);

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startProgress = useCallback(() => {
    clearProgressInterval();
    progressIntervalRef.current = setInterval(() => {
      const player = playerRef.current;
      if (!player?.getCurrentTime) return;
      setCurrentTime(player.getCurrentTime() ?? 0);
      const d = player.getDuration?.() ?? 0;
      if (d > 0) setDuration(d);
    }, 500);
  }, [clearProgressInterval]);

  useEffect(() => {
    const onFs = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void loadYouTubeIframeAPI().then(() => {
      if (cancelled || !window.YT?.Player) return;

      const player = new window.YT.Player(playerId, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          controls: 0,
          disablekb: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          fs: 0,
          playsinline: 1,
          cc_load_policy: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            if (cancelled) return;
            const p = e.target;
            playerRef.current = p;
            const d = p.getDuration?.() ?? 0;
            if (d > 0) setDuration(d);
            setReady(true);
          },
          onStateChange: (e) => {
            if (cancelled) return;
            if (e.data === YT.PlayerState.PLAYING) {
              setAwaitingPlayback(false);
              setPlaying(true);
              setHasStarted(true);
              startProgress();
            } else if (e.data === YT.PlayerState.PAUSED) {
              setPlaying(false);
              setAwaitingPlayback(false);
              clearProgressInterval();
            } else if (e.data === YT.PlayerState.BUFFERING) {
              if (!hasStartedRef.current) setAwaitingPlayback(true);
            } else if (e.data === YT.PlayerState.ENDED) {
              setPlaying(false);
              setHasStarted(false);
              setAwaitingPlayback(false);
              clearProgressInterval();
              onEndedRef.current?.();
            }
          },
        },
      });
      playerRef.current = player;
    });

    return () => {
      cancelled = true;
      clearProgressInterval();
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      try {
        playerRef.current?.destroy();
      } catch {
        /* noop */
      }
      playerRef.current = null;
      setReady(false);
      setPlaying(false);
      setHasStarted(false);
      setAwaitingPlayback(false);
      setCurrentTime(0);
      setDuration(0);
    };
  }, [videoId, playerId, startProgress, clearProgressInterval]);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  const barShown = !playing || showControls;

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    const state = p.getPlayerState?.();
    if (state === YT.PlayerState.PLAYING) {
      p.pauseVideo();
    } else {
      if (!hasStarted) setAwaitingPlayback(true);
      if (state === YT.PlayerState.ENDED) {
        p.seekTo(0, true);
      }
      p.playVideo();
    }
  }, [hasStarted]);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  }, [muted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number.parseInt(e.target.value, 10);
    setVolume(v);
    playerRef.current?.setVolume(v);
    if (v === 0) {
      playerRef.current?.mute();
      setMuted(true);
    } else {
      playerRef.current?.unMute();
      setMuted(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number.parseFloat(e.target.value);
    playerRef.current?.seekTo(t, true);
    setCurrentTime(t);
  };

  const skip = (secs: number) => {
    const p = playerRef.current;
    if (!p?.getCurrentTime) return;
    const cur = p.getCurrentTime() ?? 0;
    const d = duration > 0 ? duration : (p.getDuration?.() ?? 0);
    const cap = d > 0 ? d : cur + secs;
    p.seekTo(Math.max(0, Math.min(cur + secs, cap)), true);
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      /* unsupported or denied */
    }
  };

  const seekMax = duration > 0 ? duration : 100;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /** Full black until YouTube reports PLAYING - avoids watermark / chrome flashing during load. */
  const showPrePlayCurtain = !hasStarted;

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full min-h-[160px] overflow-hidden bg-black select-none"
      onContextMenu={(e) => e.preventDefault()}
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
      role="region"
      aria-label={`Video: ${title}`}
    >
      {/* YouTube mount: clip overflow; iframe never receives pointer events */}
      <div
        className="absolute inset-0 z-0 overflow-hidden [&_iframe]:pointer-events-none"
        data-yt-mount={playerId}
      >
        <div id={playerId} className="h-full w-full" style={{ pointerEvents: "none" }} />
      </div>

      {/* While playing: full-area tap-to-pause; only a short bottom fade (not full-frame) to soften native YT chrome */}
      {hasStarted && playing && (
        <button
          type="button"
          className="absolute inset-0 z-[15] cursor-pointer touch-none border-0 bg-transparent p-0"
          onClick={togglePlay}
          aria-label="Pause video"
        >
          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] max-h-[7.5rem] bg-gradient-to-t from-black/45 to-transparent"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            aria-hidden
          />
        </button>
      )}

      {hasStarted && !playing && ready && (
        <div
          className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center bg-black/70 touch-none"
          onClick={togglePlay}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              togglePlay();
            }
          }}
          aria-label="Play video"
        >
          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent"
            aria-hidden
          />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm ring-1 ring-white/20">
            <Play size={28} className="ml-0.5 text-white" fill="white" aria-hidden />
          </div>
        </div>
      )}

      {showPrePlayCurtain && (
        <div
          className="absolute inset-0 z-[22] flex cursor-pointer items-center justify-center bg-black"
          onClick={() => {
            if (ready) void togglePlay();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && ready) {
              e.preventDefault();
              void togglePlay();
            }
          }}
          aria-label={ready ? "Play video" : "Loading video"}
        >
          {!ready || awaitingPlayback ? (
            <Loader2 className="animate-spin text-white/60" size={28} aria-hidden />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-[#E8720C]">
              <Play size={28} className="ml-0.5 text-white" fill="white" aria-hidden />
            </div>
          )}
        </div>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300 ${
          barShown ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div
          className="relative px-3 pb-3 pt-8 sm:px-4"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="group/seek relative mb-3">
            <input
              type="range"
              min={0}
              max={seekMax}
              step={0.1}
              value={Math.min(currentTime, seekMax)}
              onChange={handleSeek}
              aria-label="Seek"
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-[#E8720C] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E8720C] [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:transition-opacity group-hover/seek:[&::-webkit-slider-thumb]:opacity-100"
              style={{
                background: `linear-gradient(to right, #E8720C ${progress}%, rgba(255,255,255,0.3) ${progress}%)`,
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="text-white transition-colors hover:text-[#E8720C]"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause size={20} fill="currentColor" aria-hidden />
              ) : (
                <Play size={20} fill="currentColor" aria-hidden />
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                skip(-10);
              }}
              className="text-white transition-colors hover:text-[#E8720C]"
              aria-label="Rewind 10 seconds"
            >
              <RotateCcw size={18} aria-hidden />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                skip(10);
              }}
              className="text-white transition-colors hover:text-[#E8720C]"
              aria-label="Forward 10 seconds"
            >
              <FastForward size={18} aria-hidden />
            </button>

            <div className="group/vol flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="text-white transition-colors hover:text-[#E8720C]"
                aria-label={muted || volume === 0 ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? (
                  <VolumeX size={18} aria-hidden />
                ) : (
                  <Volume2 size={18} aria-hidden />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                onClick={(e) => e.stopPropagation()}
                aria-label="Volume"
                className="h-1 w-14 overflow-hidden accent-[#E8720C] transition-all duration-200 sm:w-0 sm:group-hover/vol:w-16"
              />
            </div>

            <span
              className="ml-0.5 font-mono text-[11px] text-white/80 sm:text-xs"
              aria-live="polite"
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="min-w-[1rem] flex-1" />

            <span className="max-w-[120px] truncate text-[10px] text-white/60 sm:max-w-[200px] sm:text-xs">
              {title}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void toggleFullscreen();
              }}
              className="text-white transition-colors hover:text-[#E8720C]"
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize size={18} aria-hidden />
              ) : (
                <Maximize size={18} aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
