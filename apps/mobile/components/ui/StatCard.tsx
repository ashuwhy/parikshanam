import { Text, View } from 'react-native';
import { brand } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { dimensionalShadows } from '@/constants/theme';

type Props = {
  highlight: string;
  lines: string[];
};

export function StatCard({ highlight, lines }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      className="flex-1 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-800 px-3 py-3.5"
    >
      <Text
        className="text-sm font-display-black leading-tight mb-1"
        style={{ color: brand.primary }}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {highlight}
      </Text>
      {lines.map((line) => (
        <Text
          key={line}
          className="text-[10px] font-sans-medium leading-snug text-neutral-400 text-center"
          numberOfLines={1}
        >
          {line}
        </Text>
      ))}
    </View>
  );
}

