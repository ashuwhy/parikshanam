import { CSSProperties } from 'react';

/**
 * BRAND COLORS
 * Primary brand identity colors
 */
export const brand = {
  primary: '#58CC02', // Green
  secondary: '#84fb42', // Light/Active Green
  dark: '#2a6900', // Dark Green for borders/shadows
  accent: '#a3d8ff', // Soft blue
  success: '#58CC02',
  error: '#FF4B4B',
  warning: '#FFC800',
  info: '#a3d8ff',
  locked: '#afafaf',
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
    primary: '#f8f6f6', // ui.bg
    secondary: '#FFFFFF', // ui.card
    tertiary: '#f8f6f6', 
    inverse: '#111827', 
  },
  
  // Text
  text: {
    primary: '#111827', 
    secondary: '#374151', 
    tertiary: '#6B7280', 
    quaternary: '#9CA3AF', 
    inverse: '#FFFFFF',
    link: '#58CC02', // brand primary
  },
  
  // Borders
  border: {
    default: '#dddddc', // ui.border
    strong: '#2a6900', // brand.dark
    subtle: '#dddddc',
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
    secondaryHover: '#f8f6f6',
  },
  
  // Status
  status: {
    success: '#58CC02',
    successLight: '#D1FAE5',
    error: '#FF4B4B',
    errorLight: '#FEE2E2',
    warning: '#FFC800',
    warningLight: '#FEF3C7',
    info: '#a3d8ff',
    infoLight: '#DBEAFE',
  },
} as const;

/**
 * DARK MODE COLORS
 * Adapted for dark theme while maintaining the Dimensional Joy design language
 */
export const darkColors = {
  // Backgrounds
  background: {
    primary: '#111827', // Dark background
    secondary: '#1F2937', // Dark card background
    tertiary: '#374151', 
    inverse: '#f8f6f6', 
  },
  
  // Text
  text: {
    primary: '#F9FAFB', // Light text on dark
    secondary: '#E5E7EB', 
    tertiary: '#9CA3AF', 
    quaternary: '#6B7280', 
    inverse: '#111827',
    link: '#84fb42', // Lighter brand color for dark mode
  },
  
  // Borders
  border: {
    default: '#374151', // Darker border
    strong: '#84fb42', // Lighter brand for visibility
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
    success: '#58CC02',
    successLight: '#2a6900',
    error: '#FF4B4B',
    errorLight: '#7F1D1D',
    warning: '#FFC800',
    warningLight: '#78350F',
    info: '#a3d8ff',
    infoLight: '#1E3A8A',
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
