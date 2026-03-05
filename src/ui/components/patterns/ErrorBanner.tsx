import { View, Text } from 'react-native';
import { Icon } from '../primitives/Icon';

interface ErrorBannerProps {
  message: string | null;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;
  return (
    <View className="mb-4 flex-row items-center gap-2 rounded-lg bg-red-50 px-4 py-3 dark:bg-red-950">
      <Icon name="alertCircle" size={16} color="danger" />
      <Text className="flex-1 text-sm text-red-600 dark:text-red-400">{message}</Text>
    </View>
  );
}
