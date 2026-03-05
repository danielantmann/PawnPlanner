import { Text, View, useColorScheme } from 'react-native';
import { Icon } from '@/src/ui/components/primitives/Icon';
import { colors } from '@/src/ui/theme/colors';

type DrawerMenuSectionProps = {
  title: string;
  icon?: string;
};

export const DrawerMenuSection = ({ title, icon }: DrawerMenuSectionProps) => {
  const isDark = useColorScheme() === 'dark';

  const textColor = isDark ? colors.textSecondaryDark : colors.textPrimary;

  return (
    <View className="mb-2.5 mt-7 flex-row items-center">
      {icon && <Icon name={icon as any} size={20} color={textColor} fixedColor />}

      <Text
        className={`
          ${icon === 'flash' ? 'ml-1.5' : icon ? 'ml-2.5' : ''}
          font-bold uppercase
        `}
        style={{
          color: textColor,
          fontSize: 15,
          letterSpacing: 0.5,
        }}>
        {title}
      </Text>
    </View>
  );
};
