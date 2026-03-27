import Constants from 'expo-constants';
import { Heart } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { brand } from '@/constants/Colors';

const VERSION = Constants.expoConfig?.version ?? '1.0.0';

export function AppFooter() {
  return (
    <View className="items-center px-6 pt-3 pb-3 gap-1 border-t border-neutral-100 dark:border-neutral-800">
      <Text className="text-[10px] font-display uppercase tracking-[0.2em] text-brand-primary">
        Parikshanam
      </Text>
      <Text className="text-xs font-sans-medium text-neutral-400 dark:text-neutral-600 text-center">
        India's Next Generation Olympiad Platform
      </Text>
      <View className="flex-row items-center gap-1 mt-1">
        <Text className="text-[10px] font-sans-medium text-neutral-300 dark:text-neutral-700">
          Made with
        </Text>
        <Heart size={8} color={brand.primary} fill={brand.primary} strokeWidth={0} />
        <Text className="text-[10px] font-sans-medium text-neutral-300 dark:text-neutral-700">
          in India · v{VERSION}
        </Text>
      </View>
    </View>
  );
}
