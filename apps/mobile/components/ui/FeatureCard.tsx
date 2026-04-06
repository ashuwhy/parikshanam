import { Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

type Props = {
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
};

export function FeatureCard({ Icon, iconBg, iconColor, title, description, tag, tagColor }: Props) {
  return (
    <View className="flex-row items-start gap-3.5 rounded-2xl border border-ui-border bg-white dark:bg-neutral-800 dark:border-neutral-700 px-4 py-4">
      {/* Icon */}
      <View
        className="w-10 h-10 rounded-xl items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg, borderColor: iconColor + '40', borderWidth: 1 }}
      >
        <Icon size={20} color={iconColor} strokeWidth={2.2} />
      </View>

      <View className="flex-1">
        {/* Tag */}
        <View
          className="self-start rounded-full px-2.5 py-0.5 mb-1.5"
          style={{ backgroundColor: tagColor + '15', borderColor: tagColor + '30', borderWidth: 1 }}
        >
          <Text
            className="text-[9px] font-display-black uppercase tracking-widest"
            style={{ color: tagColor }}
          >
            {tag}
          </Text>
        </View>

        <Text className="text-sm font-display-extra text-neutral-900 dark:text-neutral-100 mb-1">
          {title}
        </Text>
        <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 leading-relaxed" numberOfLines={2}>
          {description}
        </Text>
      </View>
    </View>
  );
}
