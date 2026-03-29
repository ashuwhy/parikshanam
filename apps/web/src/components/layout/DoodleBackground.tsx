"use client";

import { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

const DOODLES = [
  "/doodles/doodle1.png",
  "/doodles/doodle2.png",
  "/doodles/doodle3.png",
  "/doodles/doodle4.png",
  "/doodles/doodle5.png",
  "/doodles/doodle6.png",
  "/doodles/doodle7.png",
  "/doodles/doodle8.png",
  "/doodles/doodle9.png",
  "/doodles/doodle10.png",
  "/doodles/doodle11.png",
  "/doodles/doodle12.png",
];

/** Deterministic 0..1 from an integer seed (stable across SSR and client). */
function seeded01(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface DoodlePosition {
  id: number;
  src: string;
  top: number;
  left: number;
  rotation: number;
  scale: number;
  opacity: number;
}

const MAX_DOODLES = 8;

function buildDoodles(mode: "fixed" | "section"): DoodlePosition[] {
  const newDoodles: DoodlePosition[] = [];
  const rows = 3;
  const cols = 4;
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;

  const section = mode === "section";
  const skipThreshold = section ? 0.58 : 0.55;
  const baseOpacity = section ? 0.34 : 0.4;
  const opacityJitter = section ? 0.28 : 0.32;
  const scaleMin = section ? 0.82 : 0.88;
  const scaleRange = section ? 0.32 : 0.38;

  let id = 0;

  outer: for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newDoodles.length >= MAX_DOODLES) break outer;

      const idx = r * cols + c;
      const skipRoll = seeded01(idx * 17 + 1);
      if (skipRoll > skipThreshold) continue;

      const baseX = c * cellWidth + cellWidth / 2;
      const baseY = r * cellHeight + cellHeight / 2;

      const jitterX = (seeded01(idx * 31 + 2) - 0.5) * (cellWidth * 0.8);
      const jitterY = (seeded01(idx * 47 + 3) - 0.5) * (cellHeight * 0.8);

      const doodlePick = Math.floor(seeded01(idx * 91 + 4) * DOODLES.length);

      newDoodles.push({
        id: id++,
        src: DOODLES[doodlePick]!,
        top: baseY + jitterY,
        left: baseX + jitterX,
        rotation: seeded01(idx * 13 + 5) * 360,
        scale: scaleMin + seeded01(idx * 23 + 6) * scaleRange,
        opacity: baseOpacity + seeded01(idx * 41 + 7) * opacityJitter,
      });
    }
  }

  return newDoodles;
}

export type DoodleBackgroundProps = {
  /**
   * `fixed` - one full-viewport layer (use in root layout only).
   * `section` - fills `position: relative` parent; clipped to that section.
   */
  mode?: "fixed" | "section";
  className?: string;
};

export function DoodleBackground({ mode = "fixed", className }: DoodleBackgroundProps) {
  const doodles = useMemo(() => buildDoodles(mode), [mode]);

  return (
    <div
      className={cn(
        "pointer-events-none inset-0 overflow-hidden",
        mode === "section" ? "absolute" : "fixed",
        mode === "fixed" && "z-0",
        className,
      )}
      aria-hidden
    >
      {doodles.map((doodle) => (
        <div
          key={doodle.id}
          className="absolute"
          style={{
            top: `${doodle.top}%`,
            left: `${doodle.left}%`,
            transform: `translate(-50%, -50%) rotate(${doodle.rotation}deg) scale(${doodle.scale})`,
            opacity: doodle.opacity,
          }}
        >
          <Image
            src={doodle.src}
            alt=""
            width={176}
            height={176}
            sizes="(max-width: 768px) 40vw, 208px"
            quality={55}
            className={cn(
              "object-contain",
              mode === "section" ? "h-36 w-36 sm:h-40 sm:w-40" : "h-48 w-48 sm:h-52 sm:w-52",
            )}
          />
        </div>
      ))}
    </div>
  );
}
