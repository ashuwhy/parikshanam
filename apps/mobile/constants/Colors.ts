/**
 * CENTRALIZED THEME CONFIGURATION
 * All colors and styling for the Parikshanam mobile app
 * 
 * For detailed theme options, see @/constants/theme
 */

import { brand, colors, darkColors } from './theme';

export { brand, colors, darkColors, dimensionalShadows } from './theme';

// Re-export brand for backward compatibility
const tintColorLight = brand.primary;
const tintColorDark = '#fff';

export default {
  light: {
    text: colors.text.primary,
    background: colors.background.primary,
    tint: tintColorLight,
    tabIconDefault: colors.text.tertiary,
    tabIconSelected: brand.primary,
  },
  dark: {
    text: darkColors.text.primary,
    background: darkColors.background.primary,
    tint: tintColorDark,
    tabIconDefault: darkColors.text.tertiary,
    tabIconSelected: darkColors.interactive.primary,
  },
};
