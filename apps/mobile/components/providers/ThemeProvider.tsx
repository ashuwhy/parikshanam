import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

type ColorScheme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  colorScheme: 'light' | 'dark';
  themePreference: ColorScheme;
  setThemePreference: (scheme: ColorScheme) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'parikshanam_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ColorScheme>('system');
  const [isReady, setIsReady] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    SecureStore.getItemAsync(THEME_STORAGE_KEY).then((value) => {
      if (value === 'light' || value === 'dark' || value === 'system') {
        setThemePreferenceState(value);
      }
      setIsReady(true);
    }).catch(() => {
      setIsReady(true);
    });
  }, []);

  // Determine actual color scheme
  const colorScheme: 'light' | 'dark' =
    themePreference === 'system'
      ? deviceColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themePreference;

  const isDark = colorScheme === 'dark';

  const setThemePreference = async (scheme: ColorScheme) => {
    setThemePreferenceState(scheme);
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, scheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        themePreference,
        setThemePreference,
        isDark,
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
