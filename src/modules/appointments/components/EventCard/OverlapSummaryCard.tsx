import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/src/ui/components/primitives/Icon';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  count: number;
  start: Date;
  end: Date;
  isWeek: boolean;
  onPress: () => void;
}

export const OverlapSummaryCard = ({ count, start, end, onPress, isWeek }: Props) => {
  const startTime = format(start, 'HH:mm', { locale: es });
  const endTime = format(end, 'HH:mm', { locale: es });

  return (
    <Pressable
      onPress={onPress}
      className="border-border w-full flex-1 items-center justify-center rounded-lg border-2 bg-background"
      style={{
        paddingVertical: isWeek ? 4 : 10,
        marginHorizontal: 2,
      }}>
      <View className="flex-col items-center justify-center gap-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-bold text-textPrimary">{count}</Text>
          <Icon name="calendar" size={20} color="textSecondary" />
        </View>

        {!isWeek && (
          <Text className="text-sm font-medium text-textSecondary">
            {startTime} – {endTime}
          </Text>
        )}
      </View>
    </Pressable>
  );
};
