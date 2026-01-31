import { FC } from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Icon } from '@/src/ui/components/primitives/Icon';

interface AuthHeaderProps {
  showTitle?: boolean;
}

export const AuthHeader: FC<AuthHeaderProps> = ({ showTitle = true }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Usamos tus tokens de color
  const pawColor = isDark ? 'primary' : 'black';
  const textClass = isDark ? 'text-white' : 'text-primary';

  return (
    <View className="mb-10 items-center">
      <Icon
        name="pawPrint"
        size={64}
        color={pawColor}
        strokeColor={pawColor} // ← SOLUCIÓN
        fixedColor
      />

      {showTitle && <Text className={`mt-2 text-3xl font-bold ${textClass}`}>Pawn Planner</Text>}
    </View>
  );
};
