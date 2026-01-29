import { FC } from 'react';
import { View, Text } from 'react-native';
import { Icon } from '@/src/ui/components/primitives/Icon';

type AppHeaderProps = {
  title?: string;
  iconSize?: number;
};

export const AppHeader: FC<AppHeaderProps> = ({ title = 'Pawn Planner', iconSize = 32 }) => {
  return (
    <View className="bg-primary h-20 w-full flex-row items-center justify-center shadow">
      <Icon name="pawPrint" size={iconSize} color="black" fixedColor />

      <Text className="ml-2 text-2xl font-bold text-white">{title}</Text>
    </View>
  );
};
