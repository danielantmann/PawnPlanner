import { Pressable, Text } from 'react-native';

interface Props {
  count: number;
  onPress: () => void;
}

export const MonthSummaryCard = ({ count, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      className="border-border mt-1 rounded-lg border-2 bg-background px-3 py-2">
      <Text className="text-center text-sm font-bold text-textPrimary">
        {count} {count === 1 ? 'cita' : 'citas'}
      </Text>
    </Pressable>
  );
};
