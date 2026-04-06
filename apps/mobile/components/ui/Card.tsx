import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/cn';

type CardVariant = 'default' | 'interactive' | 'selected' | 'error';

export type CardProps = ViewProps & {
  variant?: CardVariant;
  className?: string;
};

export function Card({ variant = 'default', className, children, ...rest }: CardProps) {
  return (
    <View
      className={cn(
        // Base styles
        'bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-ui-border dark:border-neutral-700',
        // Default card
        variant === 'default' && 'border border-ui-border dark:border-neutral-700',
        // Interactive option card (for quiz answers, selections)
        variant === 'interactive' && 'border-2 border-ui-border dark:border-neutral-600 active:border-ui-accent dark:active:border-blue-500',
        // Selected/correct state
        variant === 'selected' && 'border-2 border-status-success dark:border-green-500',
        // Error/incorrect state
        variant === 'error' && 'border-2 border-status-error dark:border-red-500',
        className,
      )}
      {...rest}>
      {children}
    </View>
  );
}
