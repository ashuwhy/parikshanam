const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const brand = {
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  accent: '#F59E0B',
  success: '#10B981',
  error: '#EF4444',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  card: '#FFFFFF',
} as const;

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
