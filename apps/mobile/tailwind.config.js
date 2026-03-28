/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        brand: {
          // Icon-native palette - Orange, Navy, Teal, Gold
          primary:   '#E8720C',   // Vivid Orange (open book, arrow accent)
          secondary: '#F5A623',   // Warm Amber (hover glows, dark mode text)
          dark:      '#A04F08',   // Burnt Orange (button shadow/border)
          navy:      '#1B3A6E',   // Deep Navy (arrow shaft, depth)
          navyLight: '#2A5298',   // Navy mid (links on dark)
          teal:      '#1B8A7A',   // Teal (info/accent states)
          gold:      '#F5C842',   // Gold (streak/energy, sun motif)
        },
        ui: {
          bg:     '#F9F7F5',      // Warm off-white (complements orange icon)
          card:   '#FFFFFF',
          border: '#E5E0D8',      // Warm beige border
          accent: '#1B8A7A',      // Teal - secondary highlights, focus rings
        },
        status: {
          success: '#22C55E',     // Green - correct, complete
          warning: '#F5C842',     // Gold - streak risk, partial
          error:   '#EF4444',     // Red - wrong, errors
          locked:  '#9CA3AF',     // Gray - disabled, locked
        },
        // Override neutral-800/900 to match darkColors.background - removes the
        // navy cast from the default Tailwind palette (#1F2937 / #111827)
        neutral: {
          800: '#1C1C1C',
          900: '#111111',
        },
      },
      fontFamily: {
        // Roboto - primary/body font
        sans: ['Roboto_400Regular'],
        'sans-medium': ['Roboto_500Medium'],
        'sans-bold': ['Roboto_700Bold'],
        // Nunito - secondary/display font (headings, labels, CTAs)
        display: ['Nunito_700Bold'],
        'display-extra': ['Nunito_800ExtraBold'],
        'display-black': ['Nunito_900Black'],
        // Legacy
        mono: ['SpaceMono'],
      },
    },
  },
  plugins: [],
};
