import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

const nunitoBlack: CSSProperties = {
  fontFamily: "var(--font-nunito-var)",
  fontWeight: 900,
};

const nunitoExtrabold: CSSProperties = {
  fontFamily: "var(--font-nunito-var)",
  fontWeight: 800,
};

const nunitoBold: CSSProperties = {
  fontFamily: "var(--font-nunito-var)",
  fontWeight: 700,
};

/**
 * Transform does not affect document flow - siblings/parent layout stay stable.
 * Motion: see `.btn-press-motion` in globals.css (staggered transform vs shadow).
 */
const transPress = "btn-press-motion";

/** ~4px extruded lip → ~3px travel + lip to 1px */
const depth4 =
  "active:translate-y-[3px] motion-reduce:active:translate-y-0 disabled:active:translate-y-0";

/** ~3px lip → ~2px travel */
const depth3 =
  "active:translate-y-[2px] motion-reduce:active:translate-y-0 disabled:active:translate-y-0";

/** ~2px lip → 1px travel */
const depth2 =
  "active:translate-y-px motion-reduce:active:translate-y-0 disabled:active:translate-y-0";

const pushOrange = cn(
  "shadow-[0_4px_0_0_#A04F08]",
  depth4,
  "active:shadow-[0_1px_0_0_#A04F08]",
  "disabled:active:shadow-[0_4px_0_0_#A04F08]",
);

const pushOrangeSm = cn(
  "shadow-[0_3px_0_0_#A04F08]",
  depth3,
  "active:shadow-[0_1px_0_0_#A04F08]",
  "disabled:active:shadow-[0_3px_0_0_#A04F08]",
);

const pushOrangeElevated = cn(
  "shadow-[0_4px_0_0_#A04F08,0_12px_28px_-8px_rgba(27,58,110,0.14)]",
  depth4,
  "active:shadow-[0_1px_0_0_#A04F08,0_6px_18px_-10px_rgba(27,58,110,0.1)]",
  "disabled:active:shadow-[0_4px_0_0_#A04F08,0_12px_28px_-8px_rgba(27,58,110,0.14)]",
);

/** Darker than `hover:bg-[#152d57]` so the extrusion stays visible at rest and on hover. */
const pushNavy = cn(
  "shadow-[0_4px_0_0_#0f2847]",
  depth4,
  "active:shadow-[0_1px_0_0_#0f2847]",
  "disabled:active:shadow-[0_4px_0_0_#0f2847]",
);

const primaryBase = cn(
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[#E8720C] text-white hover:bg-[#d4640a] select-none",
  transPress,
  "disabled:cursor-not-allowed active:brightness-[0.98] hover:brightness-[1.01] disabled:brightness-100",
);

const primaryCore = cn(primaryBase, pushOrange);

const VARIANTS = {
  primary: {
    className: cn(primaryCore, "w-full py-4 text-base"),
    style: nunitoBlack,
  },
  primaryShadow: {
    className: cn(primaryBase, pushOrangeElevated, "w-full py-4 text-base"),
    style: nunitoBlack,
  },
  primaryCompact: {
    className: cn(primaryCore, "flex-1 py-3 text-sm"),
    style: nunitoBlack,
  },
  primarySm: {
    className: cn(
      "inline-flex items-center justify-center rounded-[var(--radius-control-sm)] bg-[#E8720C] text-white text-sm hover:bg-[#d4640a] select-none",
      transPress,
      "px-4 py-2",
      pushOrangeSm,
      "disabled:cursor-not-allowed active:brightness-[0.98] hover:brightness-[1.01] disabled:brightness-100",
    ),
    style: nunitoExtrabold,
  },
  primaryNav: {
    className: cn(primaryCore, "px-5 py-2.5 rounded-[var(--radius-control-sm)] text-sm"),
    style: nunitoExtrabold,
  },
  primaryNavMobile: {
    className: cn(primaryCore, "w-full text-center py-3 rounded-[var(--radius-control-sm)] text-sm"),
    style: nunitoExtrabold,
  },
  primaryHero: {
    className: cn(primaryCore, "px-5 sm:px-7 py-3.5 sm:py-4 text-sm sm:text-base"),
    style: nunitoExtrabold,
  },
  /** Large hero / download CTAs (shadow lip only - no border-width change on press). */
  primaryHeroLg: {
    className: cn(
      primaryCore,
      "min-w-0 px-6 py-3.5 text-sm sm:px-8 sm:py-4 sm:text-base md:px-10 md:py-5 md:text-[1.1rem]",
    ),
    style: nunitoBlack,
  },
  primaryNavyLg: {
    className: cn(
      "inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[#1B3A6E] text-white hover:bg-[#152d57] select-none text-center",
      transPress,
      pushNavy,
      "px-10 sm:px-12 py-5 sm:py-6 text-base sm:text-lg",
      "disabled:cursor-not-allowed active:brightness-[0.98] hover:brightness-[1.02] disabled:brightness-100",
    ),
    style: nunitoBlack,
  },
  primarySection: {
    className: cn(
      primaryBase,
      pushOrange,
      "px-8 py-4 text-base cursor-pointer hover:brightness-[1.02] active:brightness-[0.97]",
    ),
    style: nunitoExtrabold,
  },
  primaryBrowse: {
    className: cn(primaryBase, pushOrange, "px-8 py-3 text-base"),
    style: nunitoBlack,
  },
  secondary: {
    className: cn(
      "inline-flex items-center justify-center gap-2 w-full py-4 rounded-[var(--radius-button)] border-2 border-[#E5E0D8] bg-white text-[#111827] text-base select-none",
      transPress,
      "shadow-[0_3px_0_0_#DDD8CF]",
      depth3,
      "active:shadow-[0_1px_0_0_#DDD8CF] hover:bg-[#FAFAF9] active:bg-[#F5F4F1]",
    ),
    style: nunitoExtrabold,
  },
  secondaryCompact: {
    className: cn(
      "inline-flex items-center justify-center flex-1 px-4 py-3 rounded-[var(--radius-button)] border-2 border-[#E5E0D8] bg-white text-sm text-[#374151] select-none",
      transPress,
      "shadow-[0_3px_0_0_#DDD8CF]",
      depth3,
      "active:shadow-[0_1px_0_0_#DDD8CF] hover:border-[#E8720C] hover:bg-[#FAFAF9] active:bg-[#F5F4F1]",
    ),
    style: nunitoExtrabold,
  },
  outlineHero: {
    className: cn(
      "inline-flex items-center gap-2 px-5 sm:px-7 py-3.5 sm:py-4 rounded-[var(--radius-button)] bg-white text-[#1B3A6E] text-sm sm:text-base border-2 border-[#E5E0D8] select-none",
      transPress,
      "shadow-[0_3px_0_0_#E3DED4]",
      depth3,
      "active:shadow-[0_1px_0_0_#E3DED4] hover:border-[#E8720C] hover:text-[#E8720C] active:bg-[#FFFBF7]",
    ),
    style: nunitoExtrabold,
  },
  outlineNavCard: {
    className: cn(
      "inline-flex items-center justify-center w-full text-center py-3 rounded-[var(--radius-control-sm)] border-2 border-[#E5E0D8] text-[#374151] text-sm select-none",
      transPress,
      "shadow-[0_2px_0_0_#E8E4DC]",
      depth2,
      "active:shadow-[0_1px_0_0_#E8E4DC] hover:bg-[#FAFAF9] active:bg-[#F5F4F1]",
    ),
    style: nunitoExtrabold,
  },
  outlineAccent: {
    className: cn(
      "inline-flex items-center justify-center px-6 py-3 rounded-[var(--radius-button)] border-2 border-[#E8720C] text-sm text-[#E8720C] select-none",
      transPress,
      "shadow-[0_3px_0_0_#C65F0A]",
      depth3,
      "active:shadow-[0_1px_0_0_#C65F0A] hover:bg-[#E8720C]/5 active:bg-[#E8720C]/10",
    ),
    style: nunitoExtrabold,
  },
  softPrimary: {
    className: cn(
      "inline-flex items-center justify-center gap-2 w-full py-3 rounded-[var(--radius-button)] bg-[#E8720C]/10 text-[#E8720C] text-sm select-none",
      transPress,
      "shadow-[0_2px_0_0_rgba(200,90,8,0.45)]",
      depth2,
      "active:shadow-[0_1px_0_0_rgba(200,90,8,0.45)] hover:bg-[#E8720C]/20 active:bg-[#E8720C]/15",
    ),
    style: nunitoExtrabold,
  },
  linkPanelOrange: {
    className: cn(
      "flex items-center justify-between rounded-[var(--radius-button)] bg-[#E8720C] p-4 hover:bg-[#d4640a] w-full select-none text-white",
      transPress,
      "shadow-[0_4px_0_0_#7A3D06]",
      depth4,
      "active:shadow-[0_1px_0_0_#7A3D06] active:brightness-[0.97]",
    ),
    style: {},
  },
  danger: {
    className: cn(
      "inline-flex items-center justify-center gap-2 w-full py-4 rounded-[var(--radius-button)] border-2 border-red-200 bg-red-50 text-red-600 text-sm select-none",
      transPress,
      "shadow-[0_3px_0_0_#FECACA]",
      depth3,
      "active:shadow-[0_1px_0_0_#FECACA] hover:bg-red-100 active:bg-red-100/90",
    ),
    style: nunitoExtrabold,
  },
  dangerNav: {
    className: cn(
      "inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-control-sm)] bg-red-50 text-red-600 text-sm border-2 border-red-200 select-none",
      transPress,
      "shadow-[0_3px_0_0_#FECACA]",
      depth3,
      "active:shadow-[0_1px_0_0_#FECACA] hover:bg-red-100 active:brightness-[0.98]",
    ),
    style: nunitoExtrabold,
  },
  dangerNavMobile: {
    className: cn(
      "w-full text-center py-3 rounded-[var(--radius-control-sm)] bg-red-50 text-red-600 text-sm border-2 border-red-200 select-none",
      transPress,
      "shadow-[0_3px_0_0_#FECACA]",
      depth3,
      "active:shadow-[0_1px_0_0_#FECACA] hover:bg-red-100 active:brightness-[0.98]",
    ),
    style: nunitoExtrabold,
  },
  ghostPill: {
    className: cn(
      "inline-flex items-center justify-center rounded-full border border-[#E5E0D8] bg-white px-5 py-1.5 text-xs uppercase tracking-wider text-[#6B7280] select-none",
      transPress,
      "shadow-[0_2px_0_0_#EBE8E2]",
      depth2,
      "active:shadow-[0_1px_0_0_#EBE8E2] hover:border-[#E8720C] hover:bg-[#FFFBF7] hover:text-[#E8720C] active:bg-[#FFF5ED]",
    ),
    style: nunitoExtrabold,
  },
  filterOff: {
    className: cn(
      "px-5 py-2 rounded-full border text-xs bg-white border-[#E5E0D8] text-[#6B7280] select-none",
      transPress,
      "shadow-[0_2px_0_0_#EDEAE4]",
      depth2,
      "active:shadow-[0_1px_0_0_#EDEAE4] hover:border-[#E8720C]",
    ),
    style: nunitoExtrabold,
  },
  filterOn: {
    className: cn(
      "px-5 py-2 rounded-full border text-xs bg-[#E8720C] border-[#A04F08] text-white select-none",
      transPress,
      "shadow-[0_2px_0_0_#7A3D06]",
      depth2,
      "active:shadow-[0_1px_0_0_#7A3D06] active:brightness-[0.97] hover:brightness-[1.02]",
    ),
    style: nunitoExtrabold,
  },
  choiceOff: {
    className: cn(
      "px-4 py-2 rounded-[var(--radius-control-sm)] border-2 text-sm bg-white border-[#E5E0D8] text-[#374151] select-none",
      transPress,
      "shadow-[0_2px_0_0_#E8E4DC]",
      depth2,
      "active:shadow-[0_1px_0_0_#E8E4DC] hover:border-[#E8720C]",
    ),
    style: nunitoExtrabold,
  },
  choiceOn: {
    className: cn(
      "px-4 py-2 rounded-[var(--radius-control-sm)] border-2 text-sm bg-[#E8720C] border-[#A04F08] text-white select-none",
      transPress,
      "shadow-[0_2px_0_0_#7A3D06]",
      depth2,
      "active:shadow-[0_1px_0_0_#7A3D06] active:brightness-[0.97] hover:brightness-[1.02]",
    ),
    style: nunitoExtrabold,
  },
  google: {
    className: cn(
      "relative w-full flex items-center justify-center gap-3 px-6 py-4 rounded-[var(--radius-button)] bg-white border-2 border-[#E5E0D8] select-none",
      transPress,
      "shadow-[0_4px_0_0_#D1D5DB]",
      depth4,
      "active:shadow-[0_1px_0_0_#D1D5DB] hover:border-[#E8720C] active:brightness-[0.99] disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_0_#D1D5DB]",
    ),
    style: nunitoExtrabold,
  },
  iconMenu: {
    className: cn(
      "md:hidden p-2 rounded-lg text-[#374151] select-none",
      transPress,
      "shadow-[0_2px_0_0_#E8E6E3]",
      depth2,
      "active:shadow-[0_1px_0_0_#E8E6E3] hover:bg-[#E5E0D8] active:bg-[#DDD9D3]",
    ),
    style: {},
  },
  iconPlain: {
    className: cn(
      "shrink-0 rounded-md p-0.5 text-[#9CA3AF] select-none",
      transPress,
      "shadow-[0_1px_0_0_#E8E6E3]",
      "active:translate-y-px motion-reduce:active:translate-y-0",
      "active:shadow-none hover:bg-[#F3F4F6] active:bg-[#ECECEC]",
    ),
    style: {},
  },
  uploadDashed: {
    className: cn(
      "w-full py-4 rounded-[var(--radius-control-sm)] border-2 border-dashed border-[#D1D5DB] flex flex-col items-center gap-2 select-none",
      transPress,
      "shadow-[0_2px_0_0_#E5E2DC]",
      depth2,
      "active:shadow-[0_1px_0_0_#E5E2DC] hover:border-[#E8720C] hover:bg-[#E8720C]/5 active:bg-[#E8720C]/8",
    ),
    style: {},
  },
  removeOverlay: {
    className: cn(
      "absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center",
      transPress,
      "shadow-[0_2px_0_0_rgba(0,0,0,0.12)]",
      depth2,
      "active:shadow-[0_1px_0_0_rgba(0,0,0,0.12)] hover:bg-white",
    ),
    style: {},
  },
  sidebarSignOut: {
    className: cn(
      "flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-control-sm)] text-sm text-[#9CA3AF] select-none",
      transPress,
      "shadow-[0_2px_0_0_#EFEDEA]",
      depth2,
      "active:shadow-[0_1px_0_0_#EFEDEA] hover:text-red-500 hover:bg-red-50 active:bg-red-100/60",
    ),
    style: nunitoBold,
  },
  accordionHeader: {
    className:
      "w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors duration-100 ease-out hover:bg-[#F9F7F5] active:bg-[#F3F1ED]",
    style: {},
  },
  linkUPI: {
    className:
      "inline border-0 bg-transparent p-0 cursor-pointer text-sm font-mono text-[#1B3A6E] hover:text-[#E8720C] transition-colors duration-100",
    style: {},
  },
  videoUnmute: {
    className: cn(
      "inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#1B3A6E]/95 px-4 py-2.5 text-sm text-white shadow-lg backdrop-blur-sm transition hover:bg-[#152d57] select-none",
      transPress,
      "active:translate-y-px motion-reduce:active:translate-y-0 active:shadow-none",
    ),
    style: nunitoBlack,
  },
  videoMute: {
    className: cn(
      "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E0D8] bg-white/95 text-[#1B3A6E] shadow-md backdrop-blur-sm transition hover:bg-white select-none",
      transPress,
      "active:translate-y-px motion-reduce:active:translate-y-0 active:shadow-none",
    ),
    style: {},
  },
} as const satisfies Record<string, { className: string; style: CSSProperties }>;

export type ButtonVariant = keyof typeof VARIANTS;

export function buttonProps(variant: ButtonVariant, className?: string) {
  const v = VARIANTS[variant];
  return {
    className: cn(v.className, className),
    style: v.style,
  };
}

/** Resolved variant for the client `Button` component */
export function resolveButtonVariant(variant: ButtonVariant) {
  return VARIANTS[variant];
}
