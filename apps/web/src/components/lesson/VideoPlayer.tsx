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
      className={`relative h-full w-full min-h-[160px] overflow-hidden bg-[#050505] select-none group ${!barShown && hasStarted && playing ? "cursor-none" : ""}`}
      onContextMenu={(e) => e.preventDefault()}
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
      role="region"
      aria-label={`Video: ${title}`}
    >
      {/* YouTube mount: clip overflow; iframe never receives pointer events */}
      <div
        className="absolute inset-0 z-0 overflow-hidden [&_iframe]:pointer-events-none transition-transform duration-700 ease-out"
        data-yt-mount={playerId}
      >
        <div id={playerId} className="h-full w-full" style={{ pointerEvents: "none", opacity: hasStarted || awaitingPlayback ? 1 : 0, transition: "opacity 0.5s ease-in-out" }} />
      </div>

      {/* Full-area tap-to-pause (invisible while playing) */}
      {hasStarted && playing && (
        <button
          type="button"
          className="absolute inset-0 z-[15] cursor-pointer touch-none border-0 bg-transparent p-0"
          onClick={togglePlay}
          aria-label="Pause video"
        >
          <span
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-[30%] max-h-[12rem] bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 ease-out ${barShown ? "opacity-100" : "opacity-0"}`}
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            aria-hidden
          />
        </button>
      )}

      {/* Paused state overlay */}
      {hasStarted && !playing && ready && (
        <div
          className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center bg-black/40 backdrop-blur-[2px] touch-none transition-all duration-500"
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
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500"
            aria-hidden
          />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 hover:bg-[#E8720C]/90 hover:scale-110 hover:border-[#E8720C]/50 shadow-[0_8px_32px_rgba(0,0,0,0.5)] group">
            <Play size={40} className="ml-1.5 text-white transition-transform duration-300 group-hover:scale-110 group-active:scale-95" fill="white" aria-hidden />
          </div>
        </div>
      )}

      {/* Pre-play Loading / Play Button Curtain */}
      {showPrePlayCurtain && (
        <div
          className="absolute inset-0 z-[22] flex cursor-pointer items-center justify-center bg-[#050505] transition-opacity duration-700"
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
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-[#E8720C]" size={42} aria-hidden strokeWidth={2} />
              <span className="text-white/50 text-xs font-semibold uppercase tracking-widest animate-pulse" style={{ fontFamily: "var(--font-nunito-var)" }}>Loading</span>
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 hover:bg-[#E8720C]/90 hover:scale-110 hover:border-[#E8720C]/50 hover:shadow-[0_0_40px_rgba(232,114,12,0.4)] group">
              <Play size={40} className="ml-1.5 text-white transition-transform duration-300 group-hover:scale-110 group-active:scale-95" fill="white" aria-hidden />
            </div>
          )}
        </div>
      )}

      {/* Floating Control Bar */}
      <div
        className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 md:bottom-5 md:left-5 md:right-5 z-30 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform ${
          barShown ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0 translate-y-4 scale-[0.98]"
        }`}
      >
        <div
          className="mx-auto max-w-5xl rounded-2xl bg-[#0a0f1a]/80 backdrop-blur-2xl border border-white/15 px-3 py-2.5 sm:px-4 sm:py-3 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.6)] relative"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Seek Bar */}
          <div className="group/seek relative w-full flex items-center h-4 sm:h-5 mb-1.5 sm:mb-2 cursor-pointer touch-none">
            {/* Background Track */}
            <div className="absolute inset-x-0 h-1 sm:h-1.5 rounded-full bg-white/20 transition-all duration-300 ease-out group-hover/seek:h-1.5 sm:group-hover/seek:h-2" />
            {/* Progress Track */}
            <div 
              className="absolute left-0 h-1 sm:h-1.5 rounded-full bg-gradient-to-r from-[#FF9D42] to-[#E8720C] transition-all duration-300 ease-out group-hover/seek:h-1.5 sm:group-hover/seek:h-2 pointer-events-none shadow-[0_0_12px_rgba(232,114,12,0.6)]"
              style={{ width: `${progress}%` }}
            />
            {/* Input Slider */}
            <input
              type="range"
              min={0}
              max={seekMax}
              step={0.1}
              value={Math.min(currentTime, seekMax)}
              onChange={handleSeek}
              aria-label="Seek sequence"
              className="absolute inset-0 w-full h-full cursor-pointer appearance-none bg-transparent m-0 outline-none
                         [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none 
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(232,114,12,0.8)] 
                         [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-300 [&::-webkit-slider-thumb]:ease-out 
                         [&::-webkit-slider-thumb]:scale-0 group-hover/seek:[&::-webkit-slider-thumb]:scale-125 z-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 sm:gap-3">
            {/* Playback Controls */}
            <div className="flex items-center gap-0 sm:gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/10 hover:text-[#E8720C] hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#E8720C] focus-visible:outline-none"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <Pause size={20} fill="currentColor" aria-hidden className="sm:w-6 sm:h-6" />
                ) : (
                  <Play size={20} fill="currentColor" aria-hidden className="sm:w-6 sm:h-6" />
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  skip(-10);
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 hidden sm:flex items-center justify-center rounded-full text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-[#E8720C] hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#E8720C] focus-visible:outline-none"
                aria-label="Rewind 10 seconds"
              >
                <RotateCcw size={18} aria-hidden strokeWidth={2.5} className="sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  skip(10);
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 hidden sm:flex items-center justify-center rounded-full text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-[#E8720C] hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#E8720C] focus-visible:outline-none"
                aria-label="Forward 10 seconds"
              >
                <FastForward size={18} aria-hidden strokeWidth={2.5} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="group/vol flex items-center ml-1 sm:ml-2 relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/10 hover:text-[#E8720C] hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#E8720C] focus-visible:outline-none"
                aria-label={muted || volume === 0 ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? (
                  <VolumeX size={18} aria-hidden strokeWidth={2.5} className="sm:w-5 sm:h-5" />
                ) : (
                  <Volume2 size={18} aria-hidden strokeWidth={2.5} className="sm:w-5 sm:h-5" />
                )}
              </button>
              <div className="w-0 overflow-hidden opacity-0 group-hover/vol:w-16 group-hover/vol:ml-1 group-hover/vol:opacity-100 transition-all duration-300 ease-out origin-left flex items-center">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Volume level"
                  className="w-14 h-1 cursor-pointer appearance-none rounded-full bg-white/20 outline-none
                             [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none 
                             [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                             [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(232,114,12,0.8)]"
                  style={{
                    background: `linear-gradient(to right, #E8720C ${muted ? 0 : volume}%, rgba(255,255,255,0.2) ${muted ? 0 : volume}%)`,
                  }}
                />
              </div>
            </div>

            {/* Timestamps */}
            <div
              className="ml-2 font-mono tracking-wide text-[11px] text-white/80 sm:text-xs font-medium cursor-default"
              aria-live="polite"
            >
              {formatTime(currentTime)}
              <span className="mx-1 text-white/40">/</span>
              {formatTime(duration)}
            </div>

            <div className="flex-1 min-w-[1rem]" />

            {/* Title Display */}
            <span 
               className="hidden md:inline-block max-w-[160px] lg:max-w-[240px] truncate text-[12px] font-semibold text-white/60 cursor-default"
               style={{ fontFamily: "var(--font-nunito-var)" }}
            >
              {title}
            </span>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void toggleFullscreen();
              }}
              className="w-8 h-8 sm:w-10 sm:h-10 ml-1 sm:ml-2 flex items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/10 hover:text-[#E8720C] hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#E8720C] focus-visible:outline-none"
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize size={18} aria-hidden strokeWidth={2.5} className="sm:w-5 sm:h-5" />
              ) : (
                <Maximize size={18} aria-hidden strokeWidth={2.5} className="sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
