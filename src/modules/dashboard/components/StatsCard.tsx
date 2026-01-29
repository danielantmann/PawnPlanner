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
  moreLabel?: string; // 👈 añadido
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
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-textPrimary dark:text-textPrimaryDark text-lg font-semibold">
          {title}
        </Text>

        {onPressMore && moreLabel && (
          <Pressable onPress={onPressMore}>
            <Text className="text-primary font-medium">{moreLabel}</Text>
          </Pressable>
        )}
      </View>

      {/* Card */}
      <View
        className={`bg-backgroundAlt dark:bg-backgroundDarkAlt flex-row ${radius} ${padding} shadow`}>
        {items.map((item, index) => (
          <View key={index} className="flex-1 items-center">
            {item.icon && <Icon name={item.icon} size={iconSize} color="primary" />}

            <Label>{item.label}</Label>

            <Text
              className={`font-bold ${
                variant === 'lg' ? 'text-2xl' : 'text-xl'
              } ${item.color ?? 'text-textPrimary dark:text-textPrimaryDark'}`}>
              {item.value}
            </Text>

            {index < items.length - 1 && (
              <View className="bg-border dark:bg-borderDark absolute bottom-2 right-0 top-2 w-px opacity-30" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
