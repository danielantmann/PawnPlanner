import { View, Text, Pressable, useColorScheme } from 'react-native';
import { Icon } from '@/src/ui/components/primitives/Icon';
import { useAuthStore } from '@/src/modules/auth/store/auth.store';
import { colors } from '@/src/ui/theme/colors';

type DrawerUserHeaderProps = {
  onPressProfile?: () => void;
  onClose: () => void;
};

export const DrawerUserHeader = ({ onPressProfile, onClose }: DrawerUserHeaderProps) => {
  const isDark = useColorScheme() === 'dark';
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const bgAvatar = isDark ? colors.backgroundAltDarkerDark : colors.backgroundAltDarker;
  const textPrimary = isDark ? colors.textPrimaryDark : colors.textPrimary;
  const textSecondary = isDark ? colors.textSecondaryDark : colors.textSecondary;

  return (
    <View className="-ml-2.5 mb-2 mt-1 flex-row items-start justify-between">
      {/* Avatar + nombre + email */}
      <View className="flex-row items-start">
        <View
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: bgAvatar }}>
          <Text className="text-lg font-semibold" style={{ color: textPrimary }}>
            {initials}
          </Text>
        </View>

        <View className="ml-3">
          <Text className="text-base font-semibold" style={{ color: textPrimary }}>
            {fullName}
          </Text>

          <Text className="text-sm" style={{ color: textSecondary }}>
            {user.email}
          </Text>
        </View>
      </View>

      {/* Botón cerrar */}
      <Pressable onPress={onClose} className="-mt-0.5 self-start px-1">
        <Icon name="close" size={28} color={textPrimary} fixedColor />
      </Pressable>
    </View>
  );
};
