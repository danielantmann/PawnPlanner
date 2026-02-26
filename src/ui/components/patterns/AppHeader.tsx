import { FC } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Icon } from '@/src/ui/components/primitives/Icon';
import { useUIStore } from '@/src/store/ui.store';

type AppHeaderProps = {
  title?: string;
  iconSize?: number;
};

export const AppHeader: FC<AppHeaderProps> = ({ title = 'Pawn Planner', iconSize = 32 }) => {
  const openDrawer = useUIStore((s) => s.openDrawer);

  return (
    <View className="h-20 w-full flex-row items-center justify-between bg-primary px-6 shadow">
      {/* Logo + título */}
      <View className="flex-row items-center">
        <Icon name="pawPrint" size={iconSize} color="black" fixedColor />
        <Text className="ml-3 text-2xl font-bold text-white">{title}</Text>
      </View>

      {/* Botón hamburguesa */}
      <Pressable onPress={openDrawer} hitSlop={10}>
        <Icon name="menu" size={28} color="white" fixedColor />
      </Pressable>
    </View>
  );
};
