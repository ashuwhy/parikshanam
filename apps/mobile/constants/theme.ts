import { CSSProperties } from 'react';

/**
 * BRAND COLORS
 * Primary brand identity colors
 */
export const brand = {
  primary: '#4F46E5', // Indigo 600
  primaryLight: '#EEF2FF', // Indigo 50
  primaryDark: '#4338CA', // Indigo 700
  accent: '#F59E0B', // Amber 500
  success: '#10B981', // Emerald 500
  error: '#EF4444', // Red 500
  warning: '#F59E0B', // Amber 500
  info: '#3B82F6', // Blue 500
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
    primary: '#FFFFFF',
    secondary: '#F9FAFB', // neutral-50
    tertiary: '#F3F4F6', // neutral-100
    inverse: '#111827', // neutral-900
  },
  
  // Text
  text: {
    primary: '#111827', // neutral-900
    secondary: '#374151', // neutral-700
    tertiary: '#6B7280', // neutral-500
    quaternary: '#9CA3AF', // neutral-400
    inverse: '#FFFFFF',
    link: '#4F46E5', // brand primary
  },
  
  // Borders
  border: {
    default: '#E5E7EB', // neutral-200
    strong: '#D1D5DB', // neutral-300
    subtle: '#F3F4F6', // neutral-100
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
    primaryHover: '#4338CA', // indigo-700
    primaryActive: '#3730A3', // indigo-800
    secondary: '#FFFFFF',
    secondaryHover: '#F9FAFB',
  },
  
  // Status
  status: {
    success: '#10B981',
    successLight: '#D1FAE5',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
  },
} as const;

/**
 * DARK MODE COLORS
 */
export const darkColors = {
  background: {
    primary: '#030712', // neutral-950
    secondary: '#111827', // neutral-900
    tertiary: '#1F2937', // neutral-800
    inverse: '#FFFFFF',
  },
  
  text: {
    primary: '#FFFFFF',
    secondary: '#F3F4F6', // neutral-100
    tertiary: '#9CA3AF', // neutral-400
    quaternary: '#6B7280', // neutral-500
    inverse: '#111827',
    link: '#818CF8', // indigo-400
  },
  
  border: {
    default: '#374151', // neutral-700
    strong: '#4B5563', // neutral-600
    subtle: '#1F2937', // neutral-800
  },
  
  surface: {
    card: '#1F2937', // neutral-800
    elevated: '#1F2937',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  interactive: {
    primary: '#6366F1', // indigo-500
    primaryHover: '#818CF8', // indigo-400
    primaryActive: '#A5B4FC', // indigo-300
    secondary: '#1F2937',
    secondaryHover: '#374151',
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
 * TYPOGRAPHY
 * Font sizes, weights, and line heights
 */
export const typography = {
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
 * BUTTON VARIANTS
 * Predefined button styles
 */
export const buttonVariants = {
  primary: {
    backgroundColor: brand.primary,
    textColor: '#FFFFFF',
    hoverBackgroundColor: brand.primaryDark,
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
    return darkColors[colorKey] as typeof colors[K];
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
  spacing,
  borderRadius,
  typography,
  shadows,
  buttonVariants,
  inputVariants,
  getColor,
  getSpacing,
  getBorderRadius,
  getShadow,
} as const;

export type Theme = typeof theme;
