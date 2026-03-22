import { View, Text } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  const percentage = Math.min(Math.max(progress * 100, 0), 100);
  
  return (
    <View className="w-full">
      <View className="flex-row justify-between items-center mb-1.5">
        {label && <Text className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</Text>}
        <Text className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{Math.round(percentage)}%</Text>
      </View>
      <View className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <View 
          className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full" 
          style={{ width: `${percentage}%` }} 
        />
      </View>
    </View>
  );
}
