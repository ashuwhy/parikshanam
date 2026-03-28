import { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type PressableProps,
} from 'react-native';

import { cn } from '@/lib/cn';
import { useColorScheme } from '@/components/useColorScheme';
import { brand, colors } from '@/constants/Colors';

type Variant = 'primary' | 'outline' | 'ghost';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: Variant;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  textClassName?: string;
};

export function Button({
  title,
  variant = 'primary',
  loading,
  disabled,
  leftIcon,
  rightIcon,
  className,
  textClassName,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isDark = useColorScheme() === 'dark';

  if (variant === 'ghost') {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        className={cn(
          'flex-row items-center justify-center rounded-2xl px-6 py-4 active:opacity-60 overflow-hidden',
          isDisabled && 'opacity-50',
          className
        )}
        {...rest}
      >
        <View className={cn("flex-row items-center gap-2", loading && "opacity-0")}>
          {leftIcon ?? null}
          <Text
            className={cn(
              'text-center text-base font-sans-bold',
              isDark ? 'text-brand-secondary' : 'text-brand-primary',
              textClassName
            )}
          >
            {title}
          </Text>
          {rightIcon ?? null}
        </View>
        
        {loading && (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator color={isDark ? brand.secondary : brand.primary} />
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center rounded-2xl px-6 py-4 active:opacity-80 overflow-hidden',
        variant === 'primary' && 'bg-brand-primary',
        variant === 'outline' &&
          'bg-white dark:bg-neutral-800 border-2 border-ui-border dark:border-neutral-600',
        isDisabled && 'opacity-50',
        className
      )}
      {...rest}
    >
      <View className={cn("flex-row items-center justify-center gap-2", loading && "opacity-0")}>
        {leftIcon ?? null}
        <Text
          className={cn(
            'text-center text-base font-sans-bold',
            variant === 'primary' && 'text-white',
            variant === 'outline' &&
              (isDark ? 'text-brand-secondary' : 'text-brand-dark'),
            textClassName
          )}
        >
          {title}
        </Text>
        {rightIcon ?? null}
      </View>

      {loading && (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator
            color={variant === 'primary' ? colors.text.inverse : brand.primary}
          />
        </View>
      )}
    </Pressable>
  );
}
