import { useRef } from 'react';
import { TextInput, View } from 'react-native';

const LENGTH = 6;

type Props = {
  value: string;
  onChange: (code: string) => void;
};

export function OTPInput({ value, onChange }: Props) {
  const refs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const chars = value.split('');

    if (digit) {
      chars[index] = digit;
      const next = chars.join('').slice(0, LENGTH);
      onChange(next);
      if (index < LENGTH - 1) {
        refs.current[index + 1]?.focus();
      }
    } else {
      chars.splice(index, 1);
      onChange(chars.join(''));
      if (index > 0) {
        refs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View className="flex-row justify-center gap-2">
      {Array.from({ length: LENGTH }, (_, i) => (
        <TextInput
          key={i}
          ref={(r) => {
            refs.current[i] = r;
          }}
          accessibilityLabel={`OTP digit ${i + 1}`}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          value={value[i] ?? ''}
          onChangeText={(t) => handleChange(t, i)}
          className="h-12 w-11 rounded-lg border border-neutral-200 bg-white text-center text-lg font-semibold text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
        />
      ))}
    </View>
  );
}
