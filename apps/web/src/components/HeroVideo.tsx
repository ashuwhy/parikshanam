"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type Props = {
  src: string;
  className?: string;
};

export function HeroVideo({ src, className = "" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const unmute = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    void el.play().catch(() => {});
    setMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const sync = () => setMuted(el.muted);
    el.addEventListener("volumechange", sync);
    return () => el.removeEventListener("volumechange", sync);
  }, []);

  return (
    <div
      className={`relative mx-auto w-full max-w-[min(17.5rem,82vw)] aspect-[9/16] max-h-[min(54dvh,26rem)] overflow-hidden rounded-[var(--radius-card)] bg-[#0a0a0a] border-2 border-[#E5E0D8] shadow-[0_12px_40px_-14px_rgba(27,58,110,0.2),0_4px_16px_-6px_rgba(232,114,12,0.12)] ring-2 ring-[#E8720C]/25 ring-offset-1 ring-offset-[#F9F7F5] sm:max-w-[min(18.5rem,85vw)] sm:max-h-[min(58dvh,28rem)] sm:ring-offset-2 md:max-w-[min(20rem,88vw)] md:max-h-[min(62dvh,30rem)] lg:max-w-[min(18rem,25vw)] xl:max-w-[min(22rem,30vw)] 2xl:max-w-[min(24rem,35vw)] lg:max-h-none lg:w-full lg:aspect-[9/16] ${className}`}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        src={src}
        autoPlay
        muted={muted}
        playsInline
        loop
        controls
        controlsList="nodownload"
        preload="auto"
        aria-label="Parikshanam introduction video"
      />

      {muted ? (
        <button
          type="button"
          onClick={unmute}
          className="absolute bottom-14 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/30 bg-[#1B3A6E]/95 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg backdrop-blur-sm transition hover:bg-[#152d57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8720C] sm:bottom-16"
          style={{ fontFamily: "var(--font-nunito-var)" }}
        >
          <VolumeX className="h-5 w-5 shrink-0" aria-hidden />
          Unmute
        </button>
      ) : (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E0D8] bg-white/95 text-[#1B3A6E] shadow-md backdrop-blur-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8720C]"
          aria-label="Mute video"
        >
          <Volume2 className="h-5 w-5" aria-hidden />
        </button>
      )}
    </div>
  );
}
