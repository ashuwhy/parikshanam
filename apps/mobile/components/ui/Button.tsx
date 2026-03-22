import { forwardRef, type ComponentRef } from 'react';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { brand } from '@/constants/Colors';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'outline' | 'ghost';

export type ButtonProps = PressableProps & {
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

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      disabled={isDisabled}
      className={cn(
        'min-h-[48px] items-center justify-center rounded-xl px-5 py-3',
        // Primary variant - uses brand.primary
        variant === 'primary' && 'bg-brand-primary active:bg-brand-primaryDark dark:bg-brand-primary dark:active:bg-brand-primary-light',
        // Outline variant
        variant === 'outline' && 'border border-neutral-200 bg-transparent active:bg-neutral-50 dark:border-neutral-700 dark:active:bg-neutral-900',
        // Ghost variant
        variant === 'ghost' && 'bg-transparent active:bg-neutral-100 dark:active:bg-neutral-800',
        isDisabled && 'opacity-60',
        className,
      )}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : brand.primary} />
      ) : (
        <Text
          className={cn(
            'text-center text-base font-semibold',
            variant === 'primary' && 'text-white',
            variant === 'outline' && 'text-brand-primary dark:text-brand-primary-light',
            variant === 'ghost' && 'text-brand-primary',
            textClassName,
          )}>
          {title}
        </Text>
      )}
    </Pressable>
  );
});
