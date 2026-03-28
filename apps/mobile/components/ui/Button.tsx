import { useRef, useState, type ReactNode } from 'react';
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

const DEPTH = 4;
const RADIUS = 16;

function edgeColor(variant: Variant, isDark: boolean): string {
  if (variant === 'primary') return brand.dark;
  if (variant === 'outline') return isDark ? '#374151' : colors.border.default;
  return 'transparent';
}

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
  const pressed = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  const pressIn = () => {
    if (isDisabled) return;
    setIsPressed(true);
    Animated.spring(pressed, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(pressed, {
      toValue: 0,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start(() => setIsPressed(false));
  };

  if (variant === 'ghost') {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        onPressIn={(e) => {
          pressIn();
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          pressOut();
          onPressOut?.(e);
        }}
        className={cn(
          'flex-row items-center justify-center rounded-2xl px-6 py-4 active:opacity-60',
          isDisabled && 'opacity-50',
          className
        )}
        {...rest}
      >
        <Text
          className={cn(
            'text-center text-base font-sans-bold',
            isDark ? 'text-brand-secondary' : 'text-brand-primary',
            textClassName
          )}
        >
          {title}
        </Text>
      </Pressable>
    );
  }

  const translateY = pressed.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const scaleY = pressed.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.985],
  });

  return (
    <View style={{ paddingBottom: DEPTH }}>
      <Animated.View
        style={{
          transform: [{ translateY }, { scaleY }],
        }}
      >
        <Pressable
          accessibilityRole="button"
          disabled={isDisabled}
          onPressIn={(e) => {
            pressIn();
            onPressIn?.(e);
          }}
          onPressOut={(e) => {
            pressOut();
            onPressOut?.(e);
          }}
          style={{
            borderRadius: RADIUS,
            borderBottomWidth: isPressed ? 0 : DEPTH,
            borderBottomColor: edgeColor(variant, isDark),
          }}
          className={cn(
            'flex-row items-center justify-center rounded-2xl px-6 py-4',
            variant === 'primary' && 'bg-brand-primary',
            variant === 'outline' &&
              'bg-white dark:bg-neutral-800 border-2 border-ui-border dark:border-neutral-600',
            isDisabled && 'opacity-50',
            className
          )}
          {...rest}
        >
          {loading ? (
            <ActivityIndicator
              color={variant === 'primary' ? colors.text.inverse : brand.primary}
            />
          ) : (
            <View className="flex-row items-center justify-center gap-2">
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
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}
