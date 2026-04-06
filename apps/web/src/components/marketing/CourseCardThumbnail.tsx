"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BookOpen, Star } from "lucide-react";
import { loadYouTubeIframeAPI } from "@/lib/youtubeIframeApi";

type Props = {
  videoId: string | null;
  thumbnailUrl: string | null;
  label: string | null;
  isFeatured: boolean;
};

export function CourseCardThumbnail({ videoId, thumbnailUrl, label, isFeatured }: Props) {
  const playerId = useId().replace(/:/g, "");
  const playerRef = useRef<YT.Player | null>(null);
  const [ytReady, setYtReady] = useState(false);
  const playLogged = useRef(false);

  useEffect(() => {
    // Basic check length == 11 usually means it's a Youtube Video ID
    const isYoutube = videoId && videoId.trim().length === 11;
    if (!isYoutube || !videoId) return;

    let cancelled = false;

    const initPlayer = () => {
      void loadYouTubeIframeAPI().then(() => {
        if (cancelled || !window.YT?.Player) return;

        new window.YT.Player(playerId, {
          videoId: videoId.trim(),
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
            playlist: videoId.trim(),
            origin: window.location.origin,
          },
          events: {
            onReady: (e: YT.PlayerEvent) => {
              if (cancelled) return;
              playerRef.current = e.target;
            },
            onStateChange: (e: YT.OnStateChangeEvent) => {
              if (cancelled) return;
              if (e.data === window.YT.PlayerState.PLAYING) {
                if (!playLogged.current) {
                  playLogged.current = true;
                  setYtReady(true);
                }
              }
              if (e.data === window.YT.PlayerState.ENDED) {
                e.target.playVideo();
              }
            },
          },
        });
      });
    };

    let idleId: number | ReturnType<typeof setTimeout>;
    if (typeof requestIdleCallback !== "undefined") {
      idleId = requestIdleCallback(initPlayer, { timeout: 2000 });
    } else {
      idleId = setTimeout(initPlayer, 0);
    }

    return () => {
      cancelled = true;
      if (typeof requestIdleCallback !== "undefined") {
        cancelIdleCallback(idleId as number);
      } else {
        clearTimeout(idleId as ReturnType<typeof setTimeout>);
      }
      try {
        playerRef.current?.destroy();
      } catch {}
      playerRef.current = null;
    };
  }, [videoId, playerId]);

  return (
    <div
      className="group relative aspect-video flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(232,114,12,0.12) 0%, rgba(27,58,110,0.08) 100%)",
      }}
    >
      {/* Background YouTube Video - Scaled up heavily (scale-[1.35]) to crop out all branding, titles, and play buttons from the edges */}
      {videoId && (
        <div className="absolute inset-0 pointer-events-none z-0 scale-[1.35]">
          <div id={playerId} />
        </div>
      )}

      {/* The Thumbnail "Curtain" - fades out once the video is fully actively playing */}
      <div 
        className={`absolute inset-0 z-[1] flex items-center justify-center transition-opacity duration-700 pointer-events-none ${ytReady ? "opacity-0" : "opacity-100"}`}
        style={{ background: ytReady ? "transparent" : "inherit" }}
      >
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnailUrl} alt="" className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105" />
        ) : (
          <BookOpen size={48} color="#E8720C" strokeWidth={1.5} className="opacity-95" />
        )}
      </div>

      {label && (
        <div
          className="absolute top-3 left-3 z-[2] px-3 py-1.5 rounded-[var(--radius-control-sm)] text-[11px] uppercase tracking-widest shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm"
          style={{ background: "rgba(27,58,110,0.95)", color: "white", fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
        >
          {label}
        </div>
      )}

      {isFeatured && (
        <div
          className="absolute top-3 right-3 z-[2] flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-control-sm)] shadow-[0_2px_8px_rgba(232,114,12,0.25)]"
          style={{ background: "#E8720C", fontFamily: "var(--font-nunito-var)" }}
        >
          <Star size={11} color="white" fill="white" strokeWidth={0} />
          <span style={{ fontSize: 11, color: "white", fontWeight: 900 }}>Featured</span>
        </div>
      )}
    </div>
  );
}
