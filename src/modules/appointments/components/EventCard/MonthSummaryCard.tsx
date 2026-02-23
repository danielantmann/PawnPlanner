import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/src/ui/components/primitives/Icon';

interface Props {
  count: number;
  onPress: () => void;
}

export const MonthSummaryCard = ({ count, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      className="border-border mt-1 rounded-lg border-2 bg-background px-3 py-2">
      <View className="flex-row items-center justify-center gap-1">
        <Text className="text-sm font-bold text-textPrimary">{count}</Text>

        {/* Icono consistente con tu app */}
        <Icon name="calendar" size={18} color="textSecondary" />
      </View>
    </Pressable>
  );
};
