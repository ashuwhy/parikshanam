import { ActivityIndicator, View } from 'react-native';

import { brand } from '@/constants/Colors';

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-ui-bg">
      <ActivityIndicator size="large" color={brand.primary} />
    </View>
  );
}
