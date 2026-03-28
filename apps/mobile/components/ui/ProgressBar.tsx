import { View, Text } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  variant?: 'success' | 'warning' | 'accent';
}

export function ProgressBar({ progress, label, variant = 'success' }: ProgressBarProps) {
  const percentage = Math.min(Math.max(progress * 100, 0), 100);
  
  const fillColor = {
    success: 'bg-brand-primary',
    warning: 'bg-status-warning',
    accent: 'bg-ui-accent dark:bg-blue-500',
  }[variant];
  
  const textColor = {
    success: 'text-brand-primary dark:text-brand-secondary',
    warning: 'text-status-warning',
    accent: 'text-ui-accent dark:text-blue-400',
  }[variant];
  
  return (
    <View className="w-full">
      {label ? (
        <View className="flex-row justify-between items-center mb-1.5">
          <Text className="text-xs font-display uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{label}</Text>
          <Text className={`text-xs font-display-black ${textColor}`}>{Math.round(percentage)}%</Text>
        </View>
      ) : null}
      <View className="h-3.5 w-full bg-ui-border dark:bg-neutral-700 rounded-full overflow-hidden border border-ui-border dark:border-neutral-600">
        <View
          className={`h-full ${fillColor} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}
