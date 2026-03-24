import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

type Props = {
  onPress?: () => void;
  /** Background style: 'dark' for use over images/dark surfaces, 'light' for white backgrounds */
  variant?: 'dark' | 'light';
};

export function BackButton({ onPress, variant = 'dark' }: Props) {
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={12}
      onPress={onPress ?? (() => router.back())}
      className={`h-9 w-9 items-center justify-center rounded-full ${
        variant === 'dark' ? 'bg-black/30' : 'bg-white border border-ui-border'
      }`}
    >
      <ChevronLeft
        size={20}
        color={variant === 'dark' ? '#fff' : '#374151'}
        strokeWidth={2.5}
      />
    </Pressable>
  );
}
