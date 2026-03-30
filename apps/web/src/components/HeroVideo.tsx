"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { captureClient } from "@/lib/analytics/capture";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { Button } from "@/components/ui/Button";
import { loadYouTubeIframeAPI } from "@/lib/youtubeIframeApi";

type Props = {
  videoId: string;
  className?: string;
};

export function HeroVideo({ videoId, className = "" }: Props) {
  const playerId = useId().replace(/:/g, "");
  const playerRef = useRef<YT.Player | null>(null);
  const playLogged = useRef(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadYouTubeIframeAPI().then(() => {
      if (cancelled || !window.YT?.Player) return;

      new window.YT.Player(playerId, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          fs: 0,
          playsinline: 1,
          loop: 1,
          playlist: videoId,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            if (cancelled) return;
            playerRef.current = e.target;
            setReady(true);
          },
          onStateChange: (e) => {
            if (cancelled) return;
            if (e.data === YT.PlayerState.PLAYING && !playLogged.current) {
              playLogged.current = true;
              captureClient(AnalyticsEvents.hero_video_play, { surface: "hero" });
            }
            if (e.data === YT.PlayerState.ENDED) {
              e.target.playVideo();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* noop */
      }
      playerRef.current = null;
    };
  }, [videoId, playerId]);

  const unmute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.unMute();
    void p.playVideo();
    setMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isMuted()) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  }, []);

  return (
    <div
      className={`relative mx-auto w-full max-w-[min(17.5rem,82vw)] aspect-[9/16] max-h-[min(54dvh,26rem)] overflow-hidden rounded-[var(--radius-card)] bg-[#0a0a0a] border-2 border-[#E5E0D8] shadow-[0_12px_40px_-14px_rgba(27,58,110,0.2),0_4px_16px_-6px_rgba(232,114,12,0.12)] ring-2 ring-[#E8720C]/25 ring-offset-1 ring-offset-[#F9F7F5] sm:max-w-[min(18.5rem,85vw)] sm:max-h-[min(58dvh,28rem)] sm:ring-offset-2 md:max-w-[min(20rem,88vw)] md:max-h-[min(62dvh,30rem)] lg:max-w-[min(18rem,25vw)] xl:max-w-[min(22rem,30vw)] 2xl:max-w-[min(24rem,35vw)] lg:max-h-none lg:w-full lg:aspect-[9/16] ${className}`}
    >
      <div className="h-full w-full pointer-events-none">
        <div id={playerId} />
      </div>

      {ready && (
        <>
          {muted ? (
            <Button
              variant="videoUnmute"
              onClick={unmute}
              className="absolute bottom-14 left-1/2 -translate-x-1/2 sm:bottom-16"
            >
              <VolumeX className="h-5 w-5 shrink-0" aria-hidden />
              Unmute
            </Button>
          ) : (
            <Button
              variant="videoMute"
              onClick={toggleMute}
              className="absolute right-3 top-3"
              aria-label="Mute video"
            >
              <Volume2 className="h-5 w-5" aria-hidden />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
