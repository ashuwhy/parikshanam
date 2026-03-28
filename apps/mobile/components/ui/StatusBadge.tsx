import { Text, View, type ViewProps } from 'react-native';
import { cn } from '@/lib/cn';

type BadgeVariant = 'success' | 'warning' | 'error' | 'locked' | 'info';

export type StatusBadgeProps = ViewProps & {
  label: string;
  variant?: BadgeVariant;
  className?: string;
};

export function StatusBadge({ label, variant = 'success', className, ...rest }: StatusBadgeProps) {
  return (
    <View
      className={cn(
        'self-start rounded-full px-3 py-1',
        variant === 'success' && 'bg-green-100 dark:bg-green-900',
        variant === 'warning' && 'bg-yellow-100 dark:bg-yellow-900',
        variant === 'error' && 'bg-red-100 dark:bg-red-900',
        variant === 'locked' && 'bg-gray-100 dark:bg-gray-800',
        variant === 'info' && 'bg-blue-100 dark:bg-blue-900',
        className,
      )}
      {...rest}>
      <Text
        className={cn(
          'text-xs font-display uppercase tracking-wide',
          variant === 'success' && 'text-brand-dark dark:text-green-200',
          variant === 'warning' && 'text-yellow-800 dark:text-yellow-200',
          variant === 'error' && 'text-red-800 dark:text-red-200',
          variant === 'locked' && 'text-status-locked dark:text-gray-400',
          variant === 'info' && 'text-blue-800 dark:text-blue-200',
        )}>
        {label}
      </Text>
    </View>
  );
}
