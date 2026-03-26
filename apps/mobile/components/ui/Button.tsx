import { useRef, type ReactNode } from 'react';
import {
  Animated,
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type PressableProps,
} from 'react-native';

import { cn } from '@/lib/cn';
import { useColorScheme } from '@/components/useColorScheme';

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

const BAR_HEIGHT = 4;
const RADIUS = 16;

// Colors for the bottom shadow bar
const BAR_COLOR: Record<Variant, string> = {
  primary: '#A04F08',  // brand.dark
  outline: '#E5E0D8',  // ui.border
  ghost:   'transparent',
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
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isDark = useColorScheme() === 'dark';
  const translateY = useRef(new Animated.Value(0)).current;

  const pressIn = () => {
    if (isDisabled) return;
    Animated.timing(translateY, { toValue: BAR_HEIGHT, duration: 60, useNativeDriver: true }).start();
  };

  const pressOut = () => {
    Animated.timing(translateY, { toValue: 0, duration: 80, useNativeDriver: true }).start();
  };

  if (variant === 'ghost') {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        onPressIn={(e) => { pressIn(); onPressIn?.(e); }}
        onPressOut={(e) => { pressOut(); onPressOut?.(e); }}
        className={cn('flex-row items-center justify-center rounded-2xl px-6 py-4 active:opacity-60', isDisabled && 'opacity-50', className)}
        {...rest}
      >
        <Text className={cn('text-center text-base font-sans-bold', isDark ? 'text-brand-secondary' : 'text-brand-primary', textClassName)}>
          {title}
        </Text>
      </Pressable>
    );
  }

  return (
    // Outer container reserves space for the bar without ever changing size
    <View style={{ paddingBottom: BAR_HEIGHT }}>
      {/* Static shadow bar — always present, button slides over it on press */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: BAR_HEIGHT + RADIUS, // extends up behind button so top of bar is hidden
          backgroundColor: BAR_COLOR[variant],
          borderBottomLeftRadius: RADIUS,
          borderBottomRightRadius: RADIUS,
        }}
      />
      {/* Button slides down on press, covering the bar */}
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Pressable
          accessibilityRole="button"
          disabled={isDisabled}
          onPressIn={(e) => { pressIn(); onPressIn?.(e); }}
          onPressOut={(e) => { pressOut(); onPressOut?.(e); }}
          className={cn(
            'flex-row items-center justify-center rounded-2xl px-6 py-4',
            variant === 'primary' && 'bg-brand-primary',
            variant === 'outline' && 'bg-white dark:bg-neutral-800 border-2 border-ui-border dark:border-neutral-600',
            isDisabled && 'opacity-50',
            className,
          )}
          {...rest}
        >
          {loading ? (
            <ActivityIndicator color={variant === 'primary' ? '#fff' : '#E8720C'} />
          ) : (
            <View className="flex-row items-center justify-center gap-2">
              {leftIcon ?? null}
              <Text
                className={cn(
                  'text-center text-base font-sans-bold',
                  variant === 'primary' && 'text-white',
                  variant === 'outline' && (isDark ? 'text-brand-secondary' : 'text-brand-dark'),
                  textClassName,
                )}
              >
                {title}
              </Text>
              {rightIcon ?? null}
            </View>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}
