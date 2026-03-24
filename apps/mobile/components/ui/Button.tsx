import { forwardRef, type ComponentRef } from 'react';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { brand } from '@/constants/Colors';
import { cn } from '@/lib/cn';
import { useColorScheme } from '@/components/useColorScheme';

type Variant = 'primary' | 'outline' | 'ghost';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: Variant;
  loading?: boolean;
  className?: string;
  textClassName?: string;
};

export const Button = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(function Button(
  {
    title,
    variant = 'primary',
    loading,
    disabled,
    className,
    textClassName,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      disabled={isDisabled}
      className={cn(
        'items-center justify-center',
        variant === 'primary' && 'bg-brand-primary rounded-2xl border-b-4 border-brand-dark px-6 py-3 active:translate-y-1',
        variant === 'outline' && 'bg-white dark:bg-neutral-800 rounded-2xl border-2 border-ui-border dark:border-neutral-600 border-b-4 px-6 py-3 active:translate-y-1',
        variant === 'ghost' && 'bg-transparent rounded-2xl px-6 py-3 active:bg-neutral-100 dark:active:bg-neutral-800',
        isDisabled && (variant === 'primary' || variant === 'outline' ? 'bg-ui-border dark:bg-neutral-700 border-b-4 border-status-locked opacity-60' : 'opacity-60'),
        className,
      )}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : brand.primary} />
      ) : (
        <Text
          className={cn(
            'text-center text-base font-sans-bold',
            variant === 'primary' && 'text-white',
            variant === 'outline' && 'text-brand-dark dark:text-brand-secondary',
            variant === 'ghost' && 'text-brand-primary dark:text-brand-secondary',
            textClassName,
          )}>
          {title}
        </Text>
      )}
    </Pressable>
  );
});
