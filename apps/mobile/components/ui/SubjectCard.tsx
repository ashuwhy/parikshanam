import { Pressable, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { dimensionalShadows } from '@/constants/theme';

type Props = {
  Icon: LucideIcon;
  label: string;
  olympiad: string;
  color: string;
  bg: string;
  onPress?: () => void;
};

export function SubjectCard({ Icon, label, olympiad, color, bg, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 overflow-hidden rounded-2xl border border-ui-border bg-white dark:bg-neutral-800 dark:border-neutral-700"
    >
      {/* Color bar */}
      <View style={{ height: 4, backgroundColor: color }} />

      <View className="p-3.5">
        {/* Icon */}
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mb-2.5"
          style={{ backgroundColor: bg, borderColor: color + '40', borderWidth: 1 }}
        >
          <Icon size={20} color={color} strokeWidth={2.2} />
        </View>

        <Text className="text-sm font-display-black text-neutral-900 dark:text-neutral-100 mb-1">
          {label}
        </Text>

        {/* Olympiad badge */}
        <Text
          className="text-[9px] font-display-black uppercase tracking-widest"
          style={{ color }}
          numberOfLines={1}
        >
          {olympiad}
        </Text>
      </View>
    </Pressable>
  );
}
