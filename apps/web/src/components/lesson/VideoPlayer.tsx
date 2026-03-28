"use client";

import { useRef, useState, useCallback } from "react";
import { Pause, Play, Volume2, VolumeX, Maximize } from "lucide-react";

interface Props {
  url: string;
  onEnded?: () => void;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ url, onEnded }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { void v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  }, []);

  const handleEnded = useCallback(() => {
    setPlaying(false);
    onEnded?.();
  }, [onEnded]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const t = parseFloat(e.target.value);
    v.currentTime = t;
    setCurrentTime(t);
  }, []);

  const cycleSpeed = useCallback(() => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  }, [speed]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const fullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) void v.requestFullscreen();
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="relative w-full h-full bg-black group"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        playsInline
      />

      {/* Controls overlay — shown on hover or pause */}
      <div
        className="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }}
      >
        {/* Progress bar */}
        <div className="px-4 pb-2">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 rounded-full cursor-pointer accent-[#E8720C]"
            style={{ background: `linear-gradient(to right, #E8720C ${progress}%, rgba(255,255,255,0.3) ${progress}%)` }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3 px-4 pb-3">
          <button onClick={togglePlay} className="text-white hover:text-[#E8720C] transition-colors">
            {playing ? <Pause size={20} strokeWidth={2.5} /> : <Play size={20} strokeWidth={2.5} />}
          </button>

          <span className="text-xs text-white/70 font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          <button
            onClick={cycleSpeed}
            className="text-xs text-white/80 hover:text-[#E8720C] font-bold transition-colors px-1"
            style={{ fontFamily: "var(--font-nunito-var)" }}
          >
            {speed}x
          </button>

          <button onClick={toggleMute} className="text-white hover:text-[#E8720C] transition-colors">
            {muted ? <VolumeX size={18} strokeWidth={2.5} /> : <Volume2 size={18} strokeWidth={2.5} />}
          </button>

          <button onClick={fullscreen} className="text-white hover:text-[#E8720C] transition-colors">
            <Maximize size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Center play/pause overlay */}
      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full bg-[#E8720C] flex items-center justify-center shadow-lg">
            <Play size={24} color="white" strokeWidth={2.5} fill="white" />
          </div>
        </button>
      )}
    </div>
  );
}
