import { Text, TextInput, View } from 'react-native';

type Props = {
  countryCode: string;
  value: string;
  onChangeText: (t: string) => void;
};

export function PhoneInput({ countryCode, value, onChangeText }: Props) {
  return (
    <View className="flex-row items-center overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <View className="border-r border-neutral-200 px-4 py-3 dark:border-neutral-700">
        <Text className="text-base font-medium text-neutral-700 dark:text-neutral-200">{countryCode}</Text>
      </View>
      <TextInput
        accessibilityLabel="Phone number"
        keyboardType="phone-pad"
        maxLength={10}
        placeholder="9876543210"
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/\D/g, ''))}
        className="flex-1 px-4 py-3 text-base text-neutral-900 dark:text-neutral-100"
      />
    </View>
  );
}
