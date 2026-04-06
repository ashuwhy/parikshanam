import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { iconColors } from '@/constants/Colors';

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-xs font-display-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        {title}
      </Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} className="flex-row items-center gap-0.5">
          <Text className="text-xs font-display-black text-brand-primary">
            {actionLabel}
          </Text>
          <ChevronRight size={12} color={iconColors.primary} strokeWidth={3} />
        </Pressable>
      ) : null}
    </View>
  );
}
