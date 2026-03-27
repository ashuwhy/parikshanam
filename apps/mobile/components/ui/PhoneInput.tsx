import { Text, TextInput, View } from 'react-native';
import { iconColors } from '@/constants/Colors';

type Props = {
  value: string;
  onChangeText: (val: string) => void;
  /** If true, shows a red border when value is invalid */
  showValidation?: boolean;
};

/** Strip everything except digits, cap at 10. */
function sanitize(raw: string) {
  return raw.replace(/\D/g, '').slice(0, 10);
}

/** Indian mobile numbers start with 6–9. */
export function isValidIndianPhone(digits: string) {
  return digits.length === 10 && /^[6-9]/.test(digits);
}

export function PhoneInput({ value, onChangeText, showValidation = false }: Props) {
  const digits = sanitize(value);
  const invalid = showValidation && digits.length > 0 && !isValidIndianPhone(digits);

  return (
    <View
      className={`flex-row items-center h-14 rounded-2xl border-2 bg-white overflow-hidden ${
        invalid
          ? 'border-red-400'
          : 'border-ui-border'
      }`}
    >
      {/* Country code pill */}
      <View className="h-full items-center justify-center border-r border-ui-border px-3 bg-neutral-50">
        <Text className="text-base font-sans-bold text-neutral-600">+91</Text>
      </View>

      <TextInput
        value={digits}
        onChangeText={(raw) => onChangeText(sanitize(raw))}
        placeholder="98765 43210"
        placeholderTextColor={iconColors.subtle}
        keyboardType="number-pad"
        maxLength={10}
        className="flex-1 px-4 text-base font-sans-medium text-neutral-900"
      />

      {/* Digit counter */}
      {digits.length > 0 && (
        <Text className={`pr-3 text-xs font-sans-medium ${digits.length === 10 ? 'text-green-500' : 'text-neutral-400'}`}>
          {digits.length}/10
        </Text>
      )}
    </View>
  );
}
