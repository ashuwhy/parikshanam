import { CSSProperties } from 'react';

/**
 * BRAND COLORS
 * Primary brand identity colors — derived from the Parikshanam app icon.
 *
 * Icon palette:
 *   Orange  #E8720C — open book pages, arrow accent, body stick (hero action color)
 *   Navy    #1B3A6E — arrow shaft, book spine, structural depth
 *   Teal    #1B8A7A — yin-yang accent half
 *   Gold    #F5C842 — sun rays, warmth accent
 */
export const brand = {
  primary: '#E8720C',   // Vivid Orange — primary buttons, active states, progress fills
  secondary: '#F5A623', // Warm Amber — hover glows, light accents, dark mode text
  dark: '#A04F08',      // Burnt Orange — button bottom-border, shadow base
  navy: '#1B3A6E',      // Deep Navy — structural text, depth accents
  navyLight: '#2A5298', // Navy mid — secondary actions, links in dark mode
  teal: '#1B8A7A',      // Teal — accent highlights, info states, focus rings
  gold: '#F5C842',      // Gold — streak/warning accents, sun/energy motif
  success: '#22C55E',   // Green — correct answers, completed lessons
  error: '#EF4444',     // Red — wrong answers, errors
  warning: '#F5C842',   // Gold — streak at risk, partial progress
  info: '#1B8A7A',      // Teal — informational states
  locked: '#9CA3AF',    // Gray — locked content, disabled states
} as const;

/**
 * NEUTRAL COLORS
 * Grayscale palette for text, backgrounds, and borders
 */
export const neutral = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  950: '#030712',
} as const;

/**
 * SEMANTIC COLORS
 * Named by purpose for consistent usage across the app
 */
export const colors = {
  // Backgrounds
  background: {
    primary: '#F9F7F5', // ui.bg
    secondary: '#FFFFFF', // ui.card
    tertiary: '#F9F7F5', 
    inverse: '#111827', 
  },
  
  // Text
  text: {
    primary: '#111827', 
    secondary: '#374151', 
    tertiary: '#6B7280', 
    quaternary: '#9CA3AF', 
    inverse: '#FFFFFF',
    link: '#E8720C', // brand.primary orange
  },
  
  // Borders
  border: {
    default: '#E5E0D8', // ui.border
    strong: '#A04F08', // brand.dark (burnt orange)
    subtle: '#E5E0D8',
  },
  
  // Surfaces
  surface: {
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Interactive
  interactive: {
    primary: brand.primary,
    primaryHover: brand.secondary,
    primaryActive: brand.dark,
    secondary: '#FFFFFF',
    secondaryHover: '#F9F7F5',
  },
  
  // Status
  status: {
    success: '#22C55E',
    successLight: '#DCFCE7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    warning: '#F5C842',
    warningLight: '#FEF9C3',
    info: '#1B8A7A',
    infoLight: '#CCFBF1',
  },
} as const;

/**
 * DARK MODE COLORS
 * Adapted for dark theme while maintaining the Dimensional Joy design language
 */
export const darkColors = {
  // Backgrounds
  background: {
    primary: '#111111', // Dark background
    secondary: '#1C1C1C', // Dark card background
    tertiary: '#374151', 
    inverse: '#F9F7F5', 
  },
  
  // Text
  text: {
    primary: '#F9FAFB', // Light text on dark
    secondary: '#E5E7EB',
    tertiary: '#9CA3AF',
    quaternary: '#6B7280',
    inverse: '#111827',
    link: '#F5A623', // brand.secondary amber — lighter for dark mode
  },
  
  // Borders
  border: {
    default: '#374151', // Darker border
    strong: '#F5A623',  // brand.secondary amber — visible on dark
    subtle: '#4B5563',
  },
  
  // Surfaces
  surface: {
    card: '#1F2937',
    elevated: '#374151',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Interactive
  interactive: {
    primary: brand.primary,
    primaryHover: brand.secondary,
    primaryActive: brand.dark,
    secondary: '#374151',
    secondaryHover: '#4B5563',
  },
  
  // Status (keep vibrant for visibility)
  status: {
    success: '#22C55E',
    successLight: '#14532D',
    error: '#EF4444',
    errorLight: '#7F1D1D',
    warning: '#F5C842',
    warningLight: '#78350F',
    info: '#1B8A7A',
    infoLight: '#134E4A',
  },
} as const;

/**
 * SPACING SCALE
 * Consistent spacing values (in pixels)
 */
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
} as const;

/**
 * BORDER RADIUS
 * Consistent border radius values
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  default: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

/**
 * FONT FAMILIES
 * Roboto = primary/body · Nunito = secondary/display (headings, labels, CTAs)
 *
 * In React Native, fontWeight doesn't compose with fontFamily — each weight
 * must be a separate named font. Use these constants for inline styles, and
 * the matching `font-{variant}` Tailwind class for className usage.
 */
export const fonts = {
  // Roboto — body & interface text
  sans: 'Roboto_400Regular',
  sansMedium: 'Roboto_500Medium',
  sansBold: 'Roboto_700Bold',
  // Nunito — headings, display, labels
  display: 'Nunito_700Bold',
  displayExtra: 'Nunito_800ExtraBold',
  displayBlack: 'Nunito_900Black',
} as const;

/**
 * ICON COLORS
 * Semantic icon color tokens aligned to the brand palette.
 * Always import these instead of hardcoding hex values.
 */
export const iconColors = {
  primary: '#E8720C',   // brand.primary — featured, CTAs, active states
  secondary: '#1B8A7A', // brand.teal — UI accent, avatars, highlights
  structural: '#1B3A6E', // brand.navy — section headers, structural icons
  muted: '#6B7280',     // neutral-500 — placeholders, disabled
  subtle: '#9CA3AF',    // neutral-400 — decorative, search, clear
  empty: '#D1D5DB',     // neutral-300 — empty states
  onBrand: '#FFFFFF',   // white — icons on colored backgrounds
  onWarning: '#A04F08', // brand.dark — icons on warning/gold backgrounds
} as const;

/**
 * TYPOGRAPHY
 * Font sizes, weights, and line heights
 */
export const typography = {
  fontFamily: fonts,
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

/**
 * SHADOWS
 * Elevation values for different surfaces
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

/**
 * DIMENSIONAL SHADOWS
 * The app's signature "flat/dimensional" shadow style (shadowRadius: 0, shadowOpacity: 1).
 * Use these instead of inline style objects for the card-raised look.
 *
 * Light mode: uses border color (#dddddc) as shadow
 * Dark mode: uses near-black (#1a1a2e) as shadow
 * Brand: uses brand.dark (#A04F08) for primary/CTA elements
 */
export const dimensionalShadows = {
  /** Subtle lift — stat cards, subject pills */
  sm: {
    light: {
      shadowColor: '#E5E0D8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 2,
    } as const,
    dark: {
      shadowColor: '#1a1a2e',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 2,
    } as const,
  },
  /** Standard card lift — course cards, course list items */
  md: {
    light: {
      shadowColor: '#E5E0D8',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    } as const,
    dark: {
      shadowColor: '#1a1a2e',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    } as const,
  },
  /** CTA/primary button — uses brand.dark (#A04F08) as shadow */
  brand: {
    sm: {
      shadowColor: '#A04F08',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    } as const,
    md: {
      shadowColor: '#A04F08',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    } as const,
  },
  /** Overlay badge — black, subtle (e.g. olympiad badge on thumbnail) */
  badge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  } as const,
  /** Brand glow — diffused orange glow for avatar rings and accent elements */
  brandGlow: {
    shadowColor: '#E8720C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  } as const,
} as const;

/**
 * BUTTON VARIANTS
 * Predefined button styles
 */
export const buttonVariants = {
  primary: {
    backgroundColor: brand.primary,
    textColor: '#FFFFFF',
    hoverBackgroundColor: brand.dark,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: brand.primary,
    textColor: brand.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    textColor: brand.primary,
  },
} as const;

/**
 * INPUT VARIANTS
 * Predefined input field styles
 */
export const inputVariants = {
  default: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.default,
    textColor: colors.text.primary,
    placeholderColor: colors.text.tertiary,
  },
  error: {
    borderColor: colors.status.error,
  },
  focus: {
    borderColor: brand.primary,
  },
} as const;

/**
 * HELPER FUNCTIONS
 */

/**
 * Get color value for current theme
 */
export function getColor<K extends keyof typeof colors>(
  colorKey: K,
  isDark: boolean = false
): typeof colors[K] {
  if (isDark && darkColors[colorKey]) {
    return darkColors[colorKey] as unknown as typeof colors[K];
  }
  return colors[colorKey];
}

/**
 * Convert spacing key to pixels
 */
export function getSpacing(key: keyof typeof spacing): number {
  return spacing[key];
}

/**
 * Convert border radius key to pixels
 */
export function getBorderRadius(key: keyof typeof borderRadius): number {
  return borderRadius[key];
}

/**
 * Get shadow style
 */
export function getShadow(level: keyof typeof shadows): CSSProperties {
  return shadows[level] as unknown as CSSProperties;
}

/**
 * Export everything for easy import
 */
export const theme = {
  brand,
  neutral,
  colors,
  darkColors,
  fonts,
  iconColors,
  spacing,
  borderRadius,
  typography,
  shadows,
  dimensionalShadows,
  buttonVariants,
  inputVariants,
  getColor,
  getSpacing,
  getBorderRadius,
  getShadow,
} as const;

export type Theme = typeof theme;
