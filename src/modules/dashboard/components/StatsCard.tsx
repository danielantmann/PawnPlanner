import { View, Text, Pressable } from 'react-native';
import { Label } from '@ui/components/primitives/Label';
import { Icon } from '@ui/components/primitives/Icon';
import type { IconName } from '@ui/components/primitives/Icon';

interface StatItem {
  label: string;
  value: string | number;
  icon?: IconName;
  color?: string;
}

interface StatsCardProps {
  title: string;
  items: StatItem[];
  variant?: 'sm' | 'lg';
  onPressMore?: () => void;
  moreLabel?: string;
}

export const StatsCard = ({
  title,
  items,
  variant = 'sm',
  onPressMore,
  moreLabel,
}: StatsCardProps) => {
  const padding = variant === 'lg' ? 'p-6' : 'p-4';
  const radius = variant === 'lg' ? 'rounded-2xl' : 'rounded-xl';
  const iconSize = variant === 'lg' ? 'lg' : 'md';

  return (
    <View className="mt-8">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-textPrimary dark:text-textPrimaryDark">
          {title}
        </Text>
        {onPressMore && moreLabel && (
          <Pressable onPress={onPressMore}>
            <Text className="font-medium text-primary">{moreLabel}</Text>
          </Pressable>
        )}
      </View>

      <View
        className={`flex-row bg-backgroundAlt dark:bg-backgroundAltDark ${radius} ${padding} shadow`}>
        {items.map((item, index) => (
          <View key={index} className="flex-1 items-center">
            {item.icon && <Icon name={item.icon} size={iconSize} color="primary" />}
            <Label>{item.label}</Label>
            <Text
              className={`font-bold ${variant === 'lg' ? 'text-2xl' : 'text-xl'} ${item.color ?? 'text-textPrimary dark:text-textPrimaryDark'}`}>
              {item.value}
            </Text>
            {index < items.length - 1 && (
              <View className="absolute bottom-2 right-0 top-2 w-px bg-border opacity-30 dark:bg-borderDark" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
