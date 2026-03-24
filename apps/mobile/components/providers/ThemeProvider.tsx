import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  colorScheme: 'light' | 'dark';
  themePreference: ColorScheme;
  setThemePreference: (scheme: ColorScheme) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ColorScheme>('system');

  // Determine actual color scheme
  const colorScheme: 'light' | 'dark' =
    themePreference === 'system'
      ? deviceColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themePreference;

  const isDark = colorScheme === 'dark';

  const setThemePreference = (scheme: ColorScheme) => {
    setThemePreferenceState(scheme);
    // Note: Persistence removed for now - can be added back with AsyncStorage if needed
  };

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
